const { Router, response} = require("express");
const multer = require("multer");
const uploadConfig = require("../configs/upload")

const UsersController = require("../controllers/UsersController");
const UserAvatarController = require("../controllers/UserAvatarController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
 
const usersRoutes = Router();
const upload = multer(uploadConfig.MULTER)

const usersController = new UsersController();
const userAvatarController = new UserAvatarController()

usersRoutes.post("/", usersController.create);
usersRoutes.put("/", ensureAuthenticated, usersController.update);
usersRoutes.patch("/avatar", ensureAuthenticated, upload.single("avatar"), userAvatarController.update); //rota para alterar um dado especifico, no caso a imagem do profile


//Forma de expor as rotas para o server.js utilizar. Em outras palavras, estou exportando para quem quiser usar a const
module.exports = usersRoutes;