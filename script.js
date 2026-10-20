
/* =================================
   CONFIGURAÇÕES DO CASAMENTO
================================= */

// Altere estes dados quando tiver as informações.
const casamento = {
    data: "", // Exemplo: "2027-06-12T16:00:00"
    horario: "Horário a definir",
    local: "Local a definir",
    endereco: "",
    listaPresentes: "" // Link da lista, quando existir
};

/* =================================
   INFORMAÇÕES DO CASAMENTO
================================= */

const dataElement = document.getElementById("data-detalhes");
const horarioElement = document.getElementById("horario-detalhes");
const localElement = document.getElementById("local-detalhes");
const enderecoElement = document.getElementById("endereco-detalhes");
const linkMapa = document.getElementById("link-mapa");

horarioElement.textContent = casamento.horario;
localElement.textContent = casamento.local;
enderecoElement.textContent =
    casamento.endereco || "Endereço a definir";

if (casamento.data) {
    const data = new Date(casamento.data);

    if (!Number.isNaN(data.getTime())) {
        const dataFormatada = data.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });

        dataElement.textContent = dataFormatada;

        document.getElementById("data-capa").textContent =
            data.toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            });

        const dataParaContagem = data.getTime();

        iniciarContagem(dataParaContagem);
    }
}

if (casamento.endereco) {
    linkMapa.href =
        "https://www.google.com/maps/search/?api=1&query=" +
        encodeURIComponent(casamento.endereco);
} else {
    linkMapa.hidden = true;
}

if (casamento.listaPresentes) {
    const linkPresentes = document.getElementById("link-presentes");
    linkPresentes.href = casamento.listaPresentes;
    linkPresentes.hidden = false;
}

/* =================================
   CONTAGEM REGRESSIVA
================================= */

function iniciarContagem(dataCasamento) {
    const mensagem = document.getElementById("mensagem-contagem");

    function atualizar() {
        const agora = Date.now();
        const diferenca = dataCasamento - agora;

        if (diferenca <= 0) {
            document.getElementById("dias").textContent = "00";
            document.getElementById("horas").textContent = "00";
            document.getElementById("minutos").textContent = "00";
            document.getElementById("segundos").textContent = "00";

            mensagem.textContent = "Chegou o grande dia! ♡";
            return;
        }

        const dias = Math.floor(
            diferenca / (1000 * 60 * 60 * 24)
        );

        const horas = Math.floor(
            (diferenca / (1000 * 60 * 60)) % 24
        );

        const minutos = Math.floor(
            (diferenca / (1000 * 60)) % 60
        );

        const segundos = Math.floor(
            (diferenca / 1000) % 60
        );

        document.getElementById("dias").textContent = dias;
        document.getElementById("horas").textContent =
            String(horas).padStart(2, "0");
        document.getElementById("minutos").textContent =
            String(minutos).padStart(2, "0");
        document.getElementById("segundos").textContent =
            String(segundos).padStart(2, "0");

        mensagem.textContent = "";
    }

    atualizar();
    setInterval(atualizar, 1000);
}

/* =================================
   FORMULÁRIO DE PRESENÇA
================================= */

const formulario = document.getElementById("form-presenca");

formulario.addEventListener("submit", function(event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const quantidade = document.getElementById("quantidade").value;
    const resposta = document.getElementById("resposta").value;
    const retorno = document.getElementById("retorno-form");

    if (!nome) {
        retorno.textContent = "Por favor, informe seu nome.";
        return;
    }

    retorno.textContent =
        "Obrigado, " + nome +
        "! Sua resposta foi preparada, mas ainda precisa ser enviada.";

    /*
      IMPORTANTE:
      Este formulário ainda não salva nem envia as respostas.
      Para receber as confirmações, será necessário conectá-lo
      a um serviço de formulários ou a um servidor.
    */

    console.log("Confirmação preenchida:", {
        nome: nome,
        quantidade: quantidade,
        resposta: resposta
    });
});
