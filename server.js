const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const {
  adicionarNovoProduto,
  listarTodosProdutos,
  informacaoDoProtudo,
  deletarProduto,
  atualizarProduto,
} = require("./produto.js");
const {
  listarTodosPedidos,
  abrirCarrinho,
  exibirPedidoEspecifico,
  listarPedidosPorEstado,
  adicionarProdutoNoPedido,
  atualizarStatusDoPedido,
  removerPedido,
} = require("./pedido");
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
    if (method == "POST") {
      abrirCarrinho(ctx);
    } else if (method == "GET") {
      listarTodosPedidos(ctx);
    } else {
      mensagemDeErro(ctx, 405, "Método não permitido");
    }
  } else if (path.includes("/orders")) {
    const id = Number(path.split("/")[2]);
    let estado = path.split("?")[1]; //.split("=")[1];

    if (method == "GET") {
      if (id > 0) {
        exibirPedidoEspecifico(ctx, id);
      } else if (estado) {
        if (estado.includes("=") && estado.split("=")[0] == "estado") {
          estado = estado.split("=")[1];
          listarPedidosPorEstado(ctx, estado);
        } else {
          mensagemDeErro(ctx, 400, "Requisição Inválida");
        }
      } else {
        mensagemDeErro(ctx, 400, "Requisição Inválida");
      }
    } else if (method == "PUT") {
      if (id) {
        const bodyDaRequisicao = ctx.request.body;
        const existeIdDoProduto = bodyDaRequisicao.hasOwnProperty("id");
        const existeQuantidade = bodyDaRequisicao.hasOwnProperty("quantidade");
        const existeStatus = bodyDaRequisicao.hasOwnProperty("estado");

        if (existeIdDoProduto && existeQuantidade && !existeStatus) {
          adicionarProdutoNoPedido(ctx, id);
          // adicionar if para remover ou adicionar produto
        } else if (existeStatus && !existeQuantidade && !existeIdDoProduto) {
          atualizarStatusDoPedido(ctx, id);
        } else {
          mensagemDeErro(ctx, 400, "Requisição Inválida");
        }
      } else {
        mensagemDeErro(ctx, 400, "Requisição Inválida");
      }
    } else if (method == "DELETE") {
      removerPedido(ctx, id);
    } else {
      mensagemDeErro(ctx, 405, "Método não permitido");
    }
  }
});
// alterar status de um pedido

server.listen(5000, () => console.log("Rodando na porta 5000"));
