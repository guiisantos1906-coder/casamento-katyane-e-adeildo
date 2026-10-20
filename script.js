
const contagem = document.getElementById("contagem-regressiva");

// Data do casamento: 5 de dezembro de 2026, às 18h.
// O horário é considerado no fuso local do navegador.
const dataCasamento = new Date(2026, 11, 5, 18, 0, 0);

function atualizarContagem() {
    const agora = new Date();
    const diferenca = dataCasamento.getTime() - agora.getTime();

    if (diferenca <= 0) {
        contagem.textContent = "Chegou o grande dia! ❤️";
        return;
    }

    const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
    const horas = Math.floor(
        (diferenca / (1000 * 60 * 60)) % 24
    );
    const minutos = Math.floor(
        (diferenca / (1000 * 60)) % 60
    );
    const segundos = Math.floor(
        (diferenca / 1000) % 60
    );

    contagem.textContent =
        `${dias} dias, ${horas} horas, ` +
        `${minutos} minutos e ${segundos} segundos`;
}

atualizarContagem();
setInterval(atualizarContagem, 1000);
