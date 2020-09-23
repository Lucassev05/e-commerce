else {
    // const quantidadeDoItemNoCarrinho = produtoExisteNoPedido.quantidade;
    // let totalDeElementos =
    //   novoProduto.quantidade - quantidadeDoItemNoCarrinho;
    if (totalDeElementos < 0) {
      totalDeElementos = Math.abs(totalDeElementos);
      arrayDeItensDoPedido[indexDoProdutoNoPedido].quantidade =
        novoProduto.quantidade;
      const atualizouProduto = atualizarQuantidadeProduto(
        novoProduto.id,
        totalDeElementos,
        false
      );
      if (atualizouProduto) {
        mensagemDeSucesso(ctx, 201, listaDePedidos[indexDoPedido]);
      } else {
        mensagemDeErro(ctx, 404, "Produto não encontrado");
      }
    } else {
      if (
        !informacoesDoProduto.deletado &&
        informacoesDoProduto.quantidade >= totalDeElementos
      ) {
        arrayDeItensDoPedido[indexDoProdutoNoPedido].quantidade +=
          novoProduto.quantidade;
        const atualizouProduto = atualizarQuantidadeProduto(
          novoProduto.id,
          totalDeElementos
        );
        if (atualizouProduto) {
          mensagemDeSucesso(ctx, 201, listaDePedidos[indexDoPedido]);
        } else {
          mensagemDeErro(ctx, 404, "Produto não encontrado");
        }
      } else if (informacoesDoProduto.deletado) {
        mensagemDeErro(
          ctx,
          404,
          "Produto não pode ser adicionado ao seu pedido"
        );
      } else if (informacoesDoProduto.quantidade < totalDeElementos) {
        mensagemDeErro(
          ctx,
          404,
          "Quantidade de produtos insuficiente no estoque!"
        );
      }
    }
  }