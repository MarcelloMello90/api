// este arquivo é destinado os arquivos que serao salvos no disk da maquina que estara o backend do projeto.

const fs = reauire("fs"); //para manipulaçao de arquivos
const path = require("path"); //para navegaçao nos diretorios
const uploadConfig = require("../configs/upload");


//quando o usuario for trocar a a img do profile, a foto atual, devera ser deletada e a nova salva no seu lugar

class DiskStorage{
  //funçao para salvar a foto no back end
  async saveFile(file){
    await fs.promises.rename(
      path.resolve(uploadConfig.TMP_FOLDER, file),
      path.resolve(uploadConfig.UPLOADS_FOLDER, file),
    );
    return file;
  }

  async delete(file){
    const filePath = path.resolve(uploadConfig.UPLOADS_FOLDER, file);

    // utilizar o "try" e "catch" na tratativa com imagens para evitar qualquer erro, seja por nome errado, o arquivo nao existir, e aplicaçao seja quebrada
    try{
      await fs.promises.stat(filePath);
    } catch {
      return;
    }

    await fs.promises.unlink(filePath);
  }
}

module.exports = DiskStorage;