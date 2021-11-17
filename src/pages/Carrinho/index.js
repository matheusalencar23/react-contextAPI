import {
  Button,
  Snackbar,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import { useCarrinhoContext } from "common/context/Carrinho";
import Produto from "components/Produto";
import { useState, useContext, useMemo } from "react";
import {
  Container,
  Voltar,
  TotalContainer,
  PagamentoContainer,
} from "./styles";
import { useHistory } from "react-router-dom";
import { usePagamentoContext } from "common/context/Pagamento";
import { UsuarioContext } from "common/context/Usuario";

function Carrinho() {
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const { carrinho, totalCarrinho, efetuarCompra } = useCarrinhoContext();

  const history = useHistory();

  const { formaPagamento, tiposPagamentos, mudarFormaPagamento } =
    usePagamentoContext();

  const { saldo } = useContext(UsuarioContext);

  const total = useMemo(() => saldo - totalCarrinho, [saldo, totalCarrinho]);

  return (
    <Container>
      <Voltar onClick={() => history.goBack()} />
      <h2>Carrinho</h2>
      {carrinho.map((item) => (
        <Produto {...item} key={item.id} />
      ))}
      <PagamentoContainer>
        <InputLabel> Forma de Pagamento </InputLabel>
        <Select
          value={formaPagamento.id}
          onChange={(e) => mudarFormaPagamento(e.target.value)}
        >
          {tiposPagamentos.map((tipo) => {
            return (
              <MenuItem value={tipo.id} key={tipo.id}>
                {tipo.nome}
              </MenuItem>
            );
          })}
        </Select>
      </PagamentoContainer>
      <TotalContainer>
        <div>
          <h2>Total no Carrinho: </h2>
          <span>R$ {parseFloat(totalCarrinho).toFixed(2)}</span>
        </div>
        <div>
          <h2> Saldo: </h2>
          <span>R$ {parseFloat(saldo).toFixed(2)}</span>
        </div>
        <div>
          <h2> Saldo Total: </h2>
          <span>R$ {parseFloat(total).toFixed(2)}</span>
        </div>
      </TotalContainer>
      <Button
        onClick={() => {
          setOpenSnackbar(true);
          efetuarCompra();
        }}
        color="primary"
        variant="contained"
        disabled={total < 0 || carrinho.length === 0}
      >
        Comprar
      </Button>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={openSnackbar}
        onClose={() => setOpenSnackbar(false)}
      >
        <MuiAlert onClose={() => setOpenSnackbar(false)} severity="success">
          Compra feita com sucesso!
        </MuiAlert>
      </Snackbar>
    </Container>
  );
}

export default Carrinho;
