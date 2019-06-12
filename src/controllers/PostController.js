const Post = require("../models/Post");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

module.exports = {
  async index(req, res) {
    const posts = await Post.find().sort("-createdAt");
    return res.json(posts);
  },
  async store(req, res) {
    const { author, place, description, hastags } = req.body;
    const { filename: image } = req.file;

    const [name, ext] = image.split("."); //convertendo a extensão da imagem para jpg
    const fileName = `${name}.jpg`;

    await sharp(req.file.path) //redefine algumas configuraçẽos das imagens
      .resize(500)
      .jpeg({ quality: 70 })
      .toFile(path.resolve(req.file.destination, "resized", fileName)); //definindo o local onde as imagen formatadas serão salvas

    fs.unlinkSync(req.file.path); //deletando a imagem que foi editada e salva na pasta resized

    const post = await Post.create({
      author,
      place,
      description,
      hastags,
      image: fileName
    });

    req.io.emit("post", post);
    return res.json(post);
  }
};
