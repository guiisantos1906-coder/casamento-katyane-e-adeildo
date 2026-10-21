
/* ========================================
   CONFIGURAÇÕES DO CASAMENTO
======================================== */

const casamento = {
    data: "2026-12-05T18:00:00",
    horario: "18h",
    local: "Paróquia Santa Edwiges",
    endereco: "R. Jaguatirica, 342 - Paratibe, João Pessoa - PB, 58033-455, Brasil",

    recepcao: "Chácara Teixeira Festas & Eventos",
    enderecoRecepcao: "R. Henrique Ribeiro da Silva, s/n - Paratibe, João Pessoa - PB, 58062-473, Brasil",

    listaPresentes: "https://lista.havan.com.br//Convidado/ItensListaPresente/967848?aba=sobre",

    chavePix: "83993427973"
};

/* ========================================
   SUPABASE
======================================== */

const SUPABASE_URL =
    "https://usdsdpseddfwugkugecu.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_PkNICAnaF5f5Tr5QNOvCBg_Ox7R9vG7";

let banco = null;

if (window.supabase) {
    banco = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );
}

/* ========================================
   INFORMAÇÕES DO CASAMENTO
======================================== */

const dataCasamento = new Date(casamento.data);

const dataElement = document.getElementById("data-detalhes");
const dataCapa = document.getElementById("data-capa");
const horarioElement = document.getElementById("horario-detalhes");
const localElement = document.getElementById("local-detalhes");
const enderecoElement = document.getElementById("endereco-detalhes");

const dataFormatada = dataCasamento.toLocaleDateString(
    "pt-BR",
    {
        day: "2-digit",
        month: "long",
        year: "numeric",
        timeZone: "America/Fortaleza"
    }
);

if (dataElement) {
    dataElement.textContent = dataFormatada;
}

if (dataCapa) {
    dataCapa.textContent = dataCasamento.toLocaleDateString(
        "pt-BR",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            timeZone: "America/Fortaleza"
        }
    );
}

if (horarioElement) {
    horarioElement.textContent = casamento.horario;
}

if (localElement) {
    localElement.textContent = casamento.local;
}

if (enderecoElement) {
    enderecoElement.textContent = casamento.endereco;
}

/* ========================================
   MAPAS
======================================== */

function criarLinkMapa(endereco) {
    return "https://www.google.com/maps/search/?api=1&query="
        + encodeURIComponent(endereco);
}

const linkMapa = document.getElementById("link-mapa");

if (linkMapa) {
    linkMapa.href = criarLinkMapa(casamento.endereco);
}

const linkRecepcao = document.getElementById("link-recepcao");

if (linkRecepcao) {
    linkRecepcao.href = criarLinkMapa(
        casamento.recepcao + ", " + casamento.enderecoRecepcao
    );
}

/* ========================================
   LISTA DE PRESENTES
======================================== */

const linkPresentes = document.getElementById("link-presentes");

if (linkPresentes) {
    linkPresentes.href = casamento.listaPresentes;
    linkPresentes.target = "_blank";
    linkPresentes.rel = "noopener noreferrer";
    linkPresentes.hidden = false;
}

/* ========================================
   CONTAGEM REGRESSIVA
======================================== */

function iniciarContagem(dataAlvo) {

    const diasElement = document.getElementById("dias");
    const horasElement = document.getElementById("horas");
    const minutosElement = document.getElementById("minutos");
    const segundosElement = document.getElementById("segundos");
    const mensagem = document.getElementById("mensagem-contagem");

    function atualizarContagem() {

        const diferenca = dataAlvo - Date.now();

        if (diferenca <= 0) {

            if (diasElement) diasElement.textContent = "0";
            if (horasElement) horasElement.textContent = "0";
            if (minutosElement) minutosElement.textContent = "0";
            if (segundosElement) segundosElement.textContent = "0";

            if (mensagem) {
                mensagem.textContent = "Chegou o grande dia!";
            }

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

        if (diasElement) diasElement.textContent = dias;
        if (horasElement) horasElement.textContent = horas;
        if (minutosElement) minutosElement.textContent = minutos;
        if (segundosElement) segundosElement.textContent = segundos;
    }

    atualizarContagem();

    setInterval(atualizarContagem, 1000);
}

if (!Number.isNaN(dataCasamento.getTime())) {
    iniciarContagem(dataCasamento.getTime());
}

/* ========================================
   CONFIRMAÇÃO DE PRESENÇA
======================================== */

const formulario = document.getElementById("form-presenca");

if (formulario) {

    formulario.addEventListener("submit", async function (event) {

        event.preventDefault();

        const nomeInput = document.getElementById("nome");
        const quantidadeInput = document.getElementById("quantidade");
        const respostaInput = document.getElementById("resposta");

        const retorno = document.getElementById(
            "retorno-formulario"
        );

        const botao = formulario.querySelector(
            'button[type="submit"]'
        );

        const nome = nomeInput.value.trim();
        const quantidade = Number(quantidadeInput.value);
        const resposta = respostaInput.value;

        if (nome.length < 2 || nome.length > 100) {
            retorno.textContent =
                "Digite um nome válido.";
            return;
        }

        if (
            !Number.isInteger(quantidade) ||
            quantidade < 1 ||
            quantidade > 5
        ) {
            retorno.textContent =
                "Informe uma quantidade entre 1 e 5 pessoas.";
            return;
        }

        if (resposta !== "Sim" && resposta !== "Não") {
            retorno.textContent =
                "Selecione uma resposta válida.";
            return;
        }

        if (!banco) {
            retorno.textContent =
                "Não foi possível conectar ao sistema de confirmação.";
            return;
        }

        botao.disabled = true;
        botao.textContent = "Enviando...";
        retorno.textContent = "";

        try {

            const { error } = await banco
                .from("rsvps")
                .insert([
                    {
                        guest_name: nome,
                        party_size: quantidade,
                        attending: resposta === "Sim"
                    }
                ]);

            if (error) {
                throw error;
            }

            retorno.textContent =
                "Obrigado! Sua confirmação foi registrada com sucesso.";

            formulario.reset();

        } catch (erro) {

            console.error(
                "Erro ao registrar confirmação:",
                erro
            );

            retorno.textContent =
                "Não foi possível registrar sua confirmação. Tente novamente.";

        } finally {

            botao.disabled = false;
            botao.textContent = "Confirmar presença";
        }

    });
}

/* ========================================
   COPIAR CHAVE PIX
======================================== */

const botaoPix = document.getElementById("copiar-pix");

if (botaoPix) {

    botaoPix.addEventListener("click", async function () {

        const campoPix = document.getElementById("chave-pix");
        const mensagemPix = document.getElementById("mensagem-pix");

        const chave = casamento.chavePix;

        try {

            if (!navigator.clipboard) {
                throw new Error("Área de transferência indisponível");
            }

            await navigator.clipboard.writeText(chave);

            mensagemPix.textContent =
                "Chave PIX copiada com sucesso!";

            botaoPix.textContent = "Copiado!";

            setTimeout(function () {
                botaoPix.textContent = "Copiar chave PIX";
            }, 3000);

        } catch (erro) {

            campoPix.focus();
            campoPix.select();

            mensagemPix.textContent =
                "Selecione a chave acima e copie manualmente.";
        }

    });
}
