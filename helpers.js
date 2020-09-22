const mensagemDeErro = (ctx, codigoDoErro, mensagem) => {
  ctx.status = codigoDoErro;
  ctx.body = {
    status: "erro",
    dados: {
      mensagem,
    },
  };
};

const mensagemDeSucesso = (
  ctx,
  codigoAcerto = 200,
  mensagem = ctx.request.body
) => {
  ctx.status = codigoAcerto;
  ctx.body = {
    status: "sucesso",
    dados: mensagem,
  };
};

module.exports = {
  mensagemDeErro,
  mensagemDeSucesso,
};
