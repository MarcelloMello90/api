const { Router} = require("express");

const NotesController = require("../controllers/NotesController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const notesRoutes = Router();

const notesController = new NotesController();

notesRoutes.use(ensureAuthenticated)

notesRoutes.get("/", notesController.index);
notesRoutes.post("/", notesController.create);
//rota para exibir a nota
notesRoutes.get("/:id", notesController.show);
//rota para deletar a nota
notesRoutes.delete("/:id", notesController.delete);

//Forma de expor as rotas para o server.js utilizar. Em outras palavras, estou exportando para quem quiser usar a const
module.exports = notesRoutes;

