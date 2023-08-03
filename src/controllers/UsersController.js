 /**
   * index - GET para listar vários registros.
   * show - GET para exibir um registro especifico.
   * create - POST para criar um registo.
   * update - PUT para atualizar um registro.
   * delete - DELETE para remover um registro
   */


 //criando a criptografia da senha
 const { hash, compare } = require("bcryptjs");

const AppError = require("../utils/AppError");
const sqliteConnection = require("../database/sqlite")

class UsersController{
  async create(request, response){
    const { name, email, password } = request.body;

    const database = await sqliteConnection();
    //cadastrando e verificando se o emeail ja existe
    const checkUserExists = await database.get("SELECT * FROM users WHERE email = (?)", [email]);

    if(checkUserExists){
      throw new AppError("Este e-mail já esta em uso.")
    }

    //criptografando a senha
    const hashedPassword = await hash(password, 8);

    //cadastro de usuários
    await database.run(
      "INSERT INTO users (name, email, password) VALUES(?, ?, ?)", 
      [ name, email, hashedPassword ]
    );

    return response.status(201).json();
  }

  async update(request, response) {
    const { name, email, password, old_password } = request.body;
    const user_id = request.user.id;

    //conecçao com o servidor(banco de dados)
    const database = await sqliteConnection()
    const user = await database.get("SELECT * FROM users WHERE id = (?)", [user_id]);

    if(!user){
      throw new AppError("Usuário não encontrado");
    }

    //altualizando o email,  everificando se o novo ja esta cadastrado
    const userWithUpdateEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email]);
  

    if(userWithUpdateEmail && userWithUpdateEmail.id !== user.id){
      throw new AppError("Este e-mail ja esta em uso.")
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;

    if(password && !old_password){
      throw new AppError("Você precisa informar a senha antiga para definir a nova senha");
    }

    if(password && old_password){
      const checkOldPassword = await compare(old_password, user.password);

      if(!checkOldPassword){
        throw new AppError("A senha antiga não confere.");
      } 

      user.password = await hash(password, 8);
    }

    await database.run(`
      UPDATE users SET
      name = ?,
      email = ?,
      password = ?,
      updated_at = DATETIME('now')
      WHERE id = ?`,
      [ user.name, user.email, user.password, user_id ]
    );

    //DATETIME('now'), utilizando essa expressao, deixamos que o banco de dados coloque a data e hora do momento

    return response.status(200).json();


  }
}
module.exports = UsersController;
