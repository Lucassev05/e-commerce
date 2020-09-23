// criar um novo pedido POST /orders
// obter informações de um pedido em particular GET /orders/:id
// obter todos os pedidos GET /orders
// atualizar estado do pedido -  Adicionar produtos na lista de produtos de um pedido
// deletar um pedido DELETE /orders/:id

/* ESTRUTURA DE DADOS
id: number
produtos: array
estado: string
idCliente: string
deletado: boolean
valorTotal: number
*/

/*
Remover um produto da lista de pedidos
Atualizar a quantidade de um produto já adicionado no pedido
Marcar um pedido como cancelado
Marcar um pedido como pago
Marcar um pedido como entregue
Marcar um pedido como processando
Marcar um pedido como deletado
*/
const { mensagemDeErro, mensagemDeSucesso } = require("./helpers");
const {
  atualizarQuantidadeProduto,
  informacaoDoProtudo,
} = require("./produto");
const listaDePedidos = [];

// Listar todos os pedidos - FEITO
const listarTodosPedidos = (ctx) => {
  const arraySemDeletados = [];
  listaDePedidos.forEach((element) => {
    if (!element.deletado) {
      arraySemDeletados.push(element);
    }
  });
  ctx.body = arraySemDeletados;
};

// Criar pedido vazio
const abrirCarrinho = (ctx) => {
  if (ctx.request.body.id) {
    const produtoSolicitado = {
      id: listaDePedidos.length + 1,
      produtos: [],
      estado: "incompleto",
      idCliente: ctx.id,
      deletado: false,
      valorTotal: 0,
    };
    listaDePedidos.push(produtoSolicitado);
    mensagemDeSucesso(ctx, 201, produtoSolicitado);
  } else {
    mensagemDeErro(
      ctx,
      405,
      "É necessário informar o código de identificação do cliente"
    );
  }
};

// Listar apenas um pedido a partir de um id
const exibirPedidoEspecifico = (ctx, id) => {
  let elementoEncontrado = false;
  listaDePedidos.forEach((element) => {
    if (element.id == id) {
      elementoEncontrado = element;
    }
  });
  if (elementoEncontrado) {
    ctx.body = elementoEncontrado;
  } else {
    mensagemDeErro(ctx, 404, "Pedido não encontrado");
  }
};

const listarPedidosPorEstado = (ctx, estado) => {
  let arrayDePedidosPorEstado = [];
  listaDePedidos.forEach((element) => {
    if (element.estado == estado) {
      arrayDePedidosPorEstado.push(element);
    }
  });
  ctx.body = arrayDePedidosPorEstado;
};

// Adicionar um novo produto na lista de pedidos.
const adicionarProdutoNoPedido = (ctx, id) => {
  let pedido = false;
  let novoProduto = {
    id: ctx.request.body.id,
    quantidade: ctx.request.body.quantidade,
  };
  let indexDoPedido = -1;
  listaDePedidos.forEach((element, i) => {
    if (element.id == id) {
      pedido = element;
      indexDoPedido = i;
    }
  });

  if (pedido) {
    if (pedido.estado == "incompleto") {
      const arrayDeItensDoPedido = pedido.produtos;
      let produtoExisteNoPedido = false;
      let indexDoProdutoNoPedido = -1;

      arrayDeItensDoPedido.forEach((element, i) => {
        if (element.id == novoProduto.id) {
          produtoExisteNoPedido = element;
          indexDoProdutoNoPedido = i;
        }
      });

      let informacoesDoProduto = true;
      informacoesDoProduto = informacaoDoProtudo(ctx, novoProduto.id, true);
      if (!produtoExisteNoPedido && informacoesDoProduto) {
        if (
          !informacoesDoProduto.deletado &&
          informacoesDoProduto.quantidade >= novoProduto.quantidade
        ) {
          arrayDeItensDoPedido.push(novoProduto);

          listaDePedidos[indexDoPedido].valorTotal +=
            informacoesDoProduto.valor * novoProduto.quantidade;

          const produtoAtualizado = atualizarQuantidadeProduto(
            novoProduto.id,
            novoProduto.quantidade
          );
          if (produtoAtualizado) {
            mensagemDeSucesso(ctx, 201, novoProduto);
          } else {
            mensagemDeErro(
              ctx,
              406,
              "O item não pode ser adicionado ao seu pedido"
            );
          }
        } else if (informacoesDoProduto.deletado) {
          mensagemDeErro(
            ctx,
            406,
            "O item não pode ser adicionado ao seu pedido"
          );
        } else if (informacoesDoProduto.quantidade < novoProduto.quantidade) {
          mensagemDeErro(
            ctx,
            406,
            "Quantidade de produtos insuficiente no estoque!"
          );
        }
      } else if (produtoExisteNoPedido && informacoesDoProduto) {
        const qtdParaAtualizar =
          novoProduto.quantidade -
          arrayDeItensDoPedido[indexDoProdutoNoPedido].quantidade;
        let atualizouProduto = false;

        if (qtdParaAtualizar < 0) {
          arrayDeItensDoPedido[indexDoProdutoNoPedido].quantidade =
            novoProduto.quantidade;

          atualizouProduto = atualizarQuantidadeProduto(
            novoProduto.id,
            Math.abs(qtdParaAtualizar),
            false
          );

          listaDePedidos[indexDoPedido].valorTotal -=
            informacoesDoProduto.valor * Math.abs(qtdParaAtualizar);
        } else {
          if (
            !informacoesDoProduto.deletado &&
            informacoesDoProduto.quantidade >= qtdParaAtualizar
          ) {
            arrayDeItensDoPedido[
              indexDoProdutoNoPedido
            ].quantidade += qtdParaAtualizar;
            atualizouProduto = atualizarQuantidadeProduto(
              novoProduto.id,
              qtdParaAtualizar
            );

            listaDePedidos[indexDoPedido].valorTotal +=
              informacoesDoProduto.valor * qtdParaAtualizar;
          } else if (informacoesDoProduto.deletado) {
            mensagemDeErro(
              ctx,
              406,
              "Produto não pode ser adicionado ao seu pedido"
            );
          } else if (informacoesDoProduto.quantidade < novoProduto.quantidade) {
            mensagemDeErro(
              ctx,
              406,
              "Quantidade de produtos insuficiente no estoque!"
            );
          }
        }

        if (atualizouProduto) {
          mensagemDeSucesso(ctx, 201, novoProduto);
        } else {
          mensagemDeErro(
            ctx,
            406,
            "Quantidade de produtos insuficiente no estoque!"
          );
        }
      } else if (!informacoesDoProduto) {
        mensagemDeErro(ctx, 404, "Produto não encontrado");
      }
    } else {
      mensagemDeErro(ctx, 406, "Pedidos processados não podem ser alterados!");
    }
  } else {
    mensagemDeErro(ctx, 404, "Pedido não encontrado");
  }
};

const atualizarStatusDoPedido = (ctx, id) => {
  let pedidoEncontrado = false;
  listaDePedidos.forEach((element, i) => {
    if (element.id == id) {
      pedidoEncontrado = true;
      listaDePedidos[i].estado = ctx.request.body.estado;
      mensagemDeSucesso(ctx, 201, listaDePedidos[i]);
    }
  });
  if (!pedidoEncontrado) {
    mensagemDeErro(ctx, 404, "Pedido não encontrado");
  }
};

const removerPedido = (ctx, id) => {
  let encontrouPedido = false;
  listaDePedidos.forEach((element, i) => {
    if (element.id == id) {
      listaDePedidos[i].deletado = true;
      encontrouPedido = true;
    }
  });
  if (encontrouPedido) {
    mensagemDeSucesso(ctx, 200, "Pedido removido");
  } else {
    mensagemDeErro(ctx, 404, "Pedido não encontrado");
  }
};

module.exports = {
  listarTodosPedidos,
  abrirCarrinho,
  exibirPedidoEspecifico,
  listarPedidosPorEstado,
  adicionarProdutoNoPedido,
  atualizarStatusDoPedido,
  removerPedido,
};
