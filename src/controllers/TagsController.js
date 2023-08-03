const knex = require('../database/knex');

class TagsController {
  //funçao para listar todas as tags criadas do usuario
  async index(request, response) {
    const user_id = request.user.id;

    const tags = await knex("tags")
    .where({ user_id })

    return response.json(tags);
  }
}

module.exports = TagsController;