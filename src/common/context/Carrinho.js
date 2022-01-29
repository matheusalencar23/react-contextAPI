import { createContext, useState, useContext, useEffect } from "react";
import { usePagamentoContext } from "./Pagamento";
import { UsuarioContext } from "./Usuario";

const CarrinhoContext = createContext();
CarrinhoContext.displayName = "Carrinho";

const CarrinhoProvider = ({ children }) => {
  const [carrinho, setCarrinho] = useState([]);
  const [quantidadeProdutos, setQuantidadesProdutos] = useState(0);
  const [totalCarrinho, setTotalCarrinho] = useState(0);
  return (
    <CarrinhoContext.Provider
      value={{
        carrinho,
        setCarrinho,
        quantidadeProdutos,
        setQuantidadesProdutos,
        totalCarrinho,
        setTotalCarrinho,
      }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
};

const useCarrinhoContext = () => {
  const {
    carrinho,
    setCarrinho,
    quantidadeProdutos,
    setQuantidadesProdutos,
    totalCarrinho,
    setTotalCarrinho,
  } = useContext(CarrinhoContext);

  const { formaPagamento } = usePagamentoContext();
  const { setSaldo } = useContext(UsuarioContext);

  function efetuarCompra() {
    setCarrinho([]);
    setSaldo((saldoAtual) => saldoAtual - totalCarrinho);
  }

  useEffect(() => {
    const { novoTotal, novaQuantidade } = carrinho.reduce(
      (contador, produto) => {
        return {
          novaQuantidade: contador.novaQuantidade + produto.quantidade,
          novoTotal: contador.novoTotal + produto.valor * produto.quantidade,
        };
      },
      { novoTotal: 0, novaQuantidade: 0 },
    );
    setQuantidadesProdutos(novaQuantidade);
    setTotalCarrinho(novoTotal * formaPagamento.juros);
  }, [carrinho, formaPagamento, setQuantidadesProdutos, setTotalCarrinho]);

  function mudarQuantidade(id, quantidade) {
    return carrinho.map((item) => {
      if (item.id === id) item.quantidade = item.quantidade + quantidade;
      return item;
    });
  }

  function adicionarProduto(novoProduto) {
    const temOProduto = carrinho.some((item) => item.id === novoProduto.id);
    if (!temOProduto) {
      novoProduto.quantidade = 1;
      return setCarrinho((carrinhoAnterior) => [
        ...carrinhoAnterior,
        novoProduto,
      ]);
    }
    setCarrinho(mudarQuantidade(novoProduto.id, 1));
  }

  function removerProduto(id) {
    const produto = carrinho.find((item) => item.id === id);
    const ehOUltimo = produto && produto.quantidade === 1;
    if (ehOUltimo) {
      return setCarrinho((carrinhoAnterior) =>
        carrinhoAnterior.filter((item) => item.id !== id),
      );
    }
    if (produto && produto.quantidade === 0) {
      return;
    }
    setCarrinho(mudarQuantidade(id, -1));
  }

  return {
    carrinho,
    setCarrinho,
    adicionarProduto,
    removerProduto,
    quantidadeProdutos,
    totalCarrinho,
    efetuarCompra,
  };
};

export { CarrinhoProvider, useCarrinhoContext };
