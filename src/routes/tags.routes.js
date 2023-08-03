const { Router} = require("express");

const TagsController = require("../controllers/TagsController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
 
const tagsRoutes = Router();

const tagsController = new TagsController();

tagsRoutes.get("/", ensureAuthenticated, tagsController.index);

//Forma de expor as rotas para o server.js utilizar. Em outras palavras, estou exportando para quem quiser usar a const
module.exports = tagsRoutes;

