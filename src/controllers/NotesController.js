const knex = require("../database/knex");

class NotesController{
  async create(request, response){
    const { title, description, tags, links } = request.body;
    const user_id = request.user.id;

    const [note_id] = await knex("notes").insert({
      title,
      description,
      user_id
    });

    const linksInsert = links.map(link =>{
      return {
        note_id,
        url: link
      }
    });
  
    await knex("links").insert(linksInsert);

    const tagsInsert = tags.map(name =>{
      return {
        note_id,
        name,
        user_id
      }
    });
      
    await knex("tags").insert(tagsInsert);

   return response.json();
  }

  //exibindo as notas criadas
  async show(request, response) {
    const { id } = request.params;

    const note = await knex("notes").where({ id }).first();
    const tags = await knex("tags").where({ note_id: id }).orderBy("name");
    const links = await knex("links").where({ note_id: id }).orderBy("created_at");

    return response.json({
      ...note,
      tags,
      links
    });
  }

  //deletando as nota(s) criada(s)
  async delete(request, response) {
    const { id } = request.params;

    await knex("notes").where({ id }).delete();

    return response.json();
  }

  //inserindo filtro p o filtro
  async index(request, response) {
    const { title, tags } = request.query;

    const user_id = request.user.id;

    let notes;

    if(tags){
      //transformando um filtro simples, para tag's, ou seja, podera realizar a consulta por tag's
      const filterTags = tags.split(',').map(tag => tag.trim());
      
      notes = await knex("tags")
      //como iremos fazer consulta em varias tabelas e na o correr o risco de pegar o dado errado por ambiguidade de nome, utilizamos como identificaçao, o nome da tabela + ponto + o nome do campo
      .select([
        "notes.id",
        "notes.title",
        "notes.user_id",
      ])
      //consulta pelo id do usuario
      .where("notes.user_id", user_id)
      //consulta pelo link
      .whereLike("notes.title", `%${title}%`)
      .whereIn("name", filterTags)
      //conectar uma table na outra
      .innerJoin("notes", "notes.id", "tags.note_id")
      //lista o resultado da consulta por titulo
      .orderBy("notes.title")    
    }else{


     notes = await knex("notes").where({ user_id }).whereLike("title",`%${title}%`).orderBy("title");
      //.whereLike("title",`%${title}%`) : trecho utilizado para pesquisar o conteúdo ou sua parcialidade dentro do banco
      //.orderBy("title");  : trecho utilizado para listar por ordem alfabética
    }

    const userTags = await knex("tags").where({ user_id });
    const notesWithTags = notes.map(note => {
      const noteTags = userTags.filter(tag => tag.note_id === note.id);

      return {
        ...note,
        tags: noteTags
      }
    });

    return response.json(notesWithTags);
  }
}
module.exports = NotesController;