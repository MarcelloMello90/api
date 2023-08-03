const path = require("path");
const multer = require("multer");
const crypto = require("crypto"); //ele gera um hash de forma aleatoria. Assim os arquivos feitos uploads terao um none unico e nao serao sobrepostos.

const TMP_FOLDER = path.resolve(__dirname, "..", "..", "tmp");
const UPLOADS_FOLDER = path.resolve(TMP_FOLDER, "uploads");

const MULTER = {
  storage: multer.diskStorage({
    destination: TMP_FOLDER,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString("hex");
      const fileName = `${fileHash}-${file.originalname}`; //aqui ele cria o nome do arquivo, unificando o hash e o nome do arquivo mesmo, assim o nome do arquivo sera unico.

      return callback(null, fileName);
    },
  }),
};

module.exports = {
  TMP_FOLDER,
  UPLOADS_FOLDER,
  MULTER,
}
 