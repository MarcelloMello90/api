const knex = require("../database/knex");
const AppError = require("../utils/AppError"); //para saber se o usuario ja esta cadastrado (email e senha)
const { compare } = require("bcryptjs"); //para saber se a senha digita confere com a cadastrada
const authConfig = require ("../configs/auth");
const { sign } = require("jsonwebtoken");

class SessionsController { 
  async create(request, response){
    const { email, password }= request.body;

    //Validação de o usuário existe
    const user = await knex("users").where({ email }).first();

    if(!user){
      throw new AppError("E-mail e/ou senha incorreta", 401)
    }

    //validando se a senha digitada confere com a cadastrada
    const passwordMatched = await compare(password, user.password);

    if(!passwordMatched){
      throw new AppError("E-mail e/ou senha incorreta", 401);
    }

    const { secret, expiresIn } = authConfig.jwt;
    const token = sign({}, secret, {
      subject: String(user.id),
      expiresIn
    })

    return response.json( { user, token } );
  }
}

module.exports = SessionsController;