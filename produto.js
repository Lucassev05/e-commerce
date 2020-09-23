//criar novo produto POST /products
//obter informações do protudo GET /products/:id
//obter todos os produtos GET /products
//atualizar produto PUT /products/:id
//deletar produto DELETE /products/:id

/*
Listar todos os produtos
Obter informações de um produto em particular
Adicionar um novo produto
Atualizar informações de um produto
Marcar um produto como deletado
Alterar a quantidade disponível de um produto
*/

/* estrutuda dos dados
ID : NUMBER
NOME: STRING
QUANTIDADE: NUMBER
VALOR: NUMBER (EM CENTAVOS)
DELETADO: BOOLEAN
*/
const { mensagemDeErro, mensagemDeSucesso } = require("./helpers");
const arrayDeProdutos = [];
const adicionarNovoProduto = (ctx, produto) => {
  let novoProduto = {
    id: arrayDeProdutos.length + 1,
    nome: produto.nome,
    quantidade: produto.quantidade,
    valor: produto.valor,
    deletado: false,
  };
  arrayDeProdutos.push(novoProduto);
  mensagemDeSucesso(ctx, 201);
};

const listarTodosProdutos = (ctx) => {
  ctx.body = arrayDeProdutos;
};

const informacaoDoProtudo = (ctx, id, pedido = false) => {
  let naoEncontrado = true;
  let elemento = false;
  arrayDeProdutos.forEach((element) => {
    if (element.id == id) {
      elemento = element;
      naoEncontrado = false;
      return;
    }
  });
  if (!pedido) {
    if (elemento) {
      ctx.body = elemento;
    } else {
      mensagemDeErro(ctx, 404, "Produto não encontrado");
    }
  } else {
    return elemento;
  }
};

const deletarProduto = (ctx, id) => {
  let naoEncontrado = true;
  if (arrayDeProdutos.length > 0) {
    arrayDeProdutos.forEach((element, i) => {
      if (element.id == id) {
        arrayDeProdutos[i].deletado = true;
        naoEncontrado = false;
        mensagemDeSucesso(ctx, 200, arrayDeProdutos[i]);
        return;
      }
    });
  }
  if (naoEncontrado) {
    mensagemDeErro(ctx, 404, "Produto não encontrado");
  }
};

const atualizarProduto = (ctx, id) => {
  let naoEncontrado = true;
  let informacao = ctx.request.body;

  arrayDeProdutos.forEach((element, i) => {
    if (element.id == id && element.deletado == true) {
      return;
    } else if (element.id == id) {
      const elementoEditado = {
        id: element.id,
        nome: informacao.nome ? informacao.nome : element.nome,
        quantidade: informacao.quantidade
          ? informacao.quantidade
          : element.quantidade,
        valor: informacao.valor ? informacao.valor : element.valor,
        deletado: element.deletado,
      };
      naoEncontrado = false;
      arrayDeProdutos.splice(i, 1, elementoEditado);
      mensagemDeSucesso(ctx, 200, elementoEditado);
      return;
    }
  });

  if (naoEncontrado) {
    mensagemDeErro(ctx, 404, "Produto não encontrado");
  }
};

const atualizarQuantidadeProduto = (id, qtd, decrementar = true) => {
  let sucesso = false;
  arrayDeProdutos.forEach((element, i) => {
    if (element.id == id) {
      if (decrementar) {
        arrayDeProdutos[i].quantidade -= qtd;
        sucesso = true;
      } else {
        arrayDeProdutos[i].quantidade += qtd;
        sucesso = true;
      }
    }
  });
  if (sucesso) {
    return true;
  } else {
    return false;
  }
};

module.exports = {
  adicionarNovoProduto,
  listarTodosProdutos,
  informacaoDoProtudo,
  deletarProduto,
  atualizarProduto,
  atualizarQuantidadeProduto,
};
