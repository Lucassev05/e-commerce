const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const {
  adicionarNovoProduto,
  listarTodosProdutos,
  informacaoDoProtudo,
  deletarProduto,
  atualizarProduto,
  atualizarQuantidadeProduto,
} = require("./produto.js");
const { mensagemDeErro } = require("./helpers");

const server = new Koa();
server.use(bodyParser());

server.use((ctx) => {
  const path = ctx.url;
  const method = ctx.method;

  if (path == "/products") {
    if (method == "POST") {
      adicionarNovoProduto(ctx, ctx.request.body); //passar dado
    } else if (method == "GET") {
      listarTodosProdutos(ctx);
    } else {
      mensagemDeErro(ctx, 405, "Método não permitido");
    }
  } else if (path.includes("/products/")) {
    const id = Number(path.split("/")[2]);
    if (method == "GET") {
      informacaoDoProtudo(ctx, id); //passar dado
    } else if (method == "PUT") {
      atualizarProduto(ctx, id); //passa dado
    } else if (method == "DELETE") {
      deletarProduto(ctx, id); //passar dado
    } else {
      mensagemDeErro(ctx, 405, "Método não permitido");
    }
  } else if (path == "/orders") {
    if (method == "GET") {
      // lista todos os pedidos
    } else {
      mensagemDeErro(ctx, 405, "Método não permitido");
    }
  } else if (path.includes("/orders")) {
    const id = Number(path.split("/")[2]);
    let filtro = path.split("?")[1].split("=")[1];
    if (method == "POST") {
      // adicionar um novo produto na lista de pedidos
    } else if (method == "GET") {
      if (id) {
        // listar apenas um pedido com id
      } else if (estado) {
        // listar pedidos com o estado especifico
      } else {
        // tratamento de erro
      }
    } else if (method == "PUT") {
      // alterar status de um pedido
    } else if (method == "DELETE") {
      // remove um produto na lista de pedidos
    } else {
      mensagemDeErro(ctx, 405, "Método não permitido");
    }
  }
});

server.listen(5000, () => console.log("Rodando na porta 5000"));
