//aqui configuramos o tratamento de erro da biblioteca npm install express-async-errors --save
require("express-async-errors");

//importação do banco de dados
const migrationsRun = require("./database/sqlite/migrations")
const AppError = require("./utils/AppError");

//aqui importamos os dados do express
const express = require("express");
const routes = require("./routes");

migrationsRun();

//aqui inicializamos o express
const app = express();
app.use(express.json());

app.use(routes);

app.use((error, request, response, next) => {
  if(error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message
    });
  }

  console.error(error);

  return response.status(500).json({
    status: "error",
    message: "Internal server error",
  });
});

//aqui é criada a porta de acesso pelo PORT 3333
const PORT = 3333;
app.listen(PORT, () => console.log(`Server in running on Port ${PORT}`));
//PORT é o endereço da aplicação. Apos a aplicação iniciar, é executado a função apos