
/* ========================================
   CONFIGURAÇÕES DO CASAMENTO
======================================== */

const casamento = {
    data: "2026-12-05T18:00:00",
    horario: "18h",
    local: "Paróquia Santa Edwiges",
    endereco: "R. Jaguatirica, 342 - Paratibe, João Pessoa - PB, 58033-455, Brasil",
    listaPresentes: ""
};


/* ========================================
   CONFIGURAÇÃO DO SUPABASE
======================================== */

// Cole aqui a Project URL e a chave pública
// encontradas nas configurações do seu projeto Supabase.

const SUPABASE_URL = "https://usdsdpseddfwugkugecu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_PkNICAnaF5f5Tr5QNOvCBg_Ox7R9vG7";


// Inicializa o Supabase somente se a biblioteca
// estiver carregada e as credenciais preenchidas.

let banco = null;

if (
    window.supabase &&
    SUPABASE_URL !== "COLE_AQUI_SUA_PROJECT_URL" &&
    SUPABASE_PUBLISHABLE_KEY !== "COLE_AQUI_SUA_CHAVE_PUBLICA"
) {
    banco = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );
}


/* ========================================
   INFORMAÇÕES DO CASAMENTO
======================================== */

const dataElement = document.getElementById("data-detalhes");
const dataCapa = document.getElementById("data-capa");
const horarioElement = document.getElementById("horario-detalhes");
const localElement = document.getElementById("local-detalhes");
const enderecoElement = document.getElementById("endereco-detalhes");
const linkMapa = document.getElementById("link-mapa");
const linkPresentes = document.getElementById("link-presentes");


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
   FORMATAÇÃO DA DATA
======================================== */

const dataCasamento = new Date(casamento.data);

if (!Number.isNaN(dataCasamento.getTime())) {
    const dataFormatada = dataCasamento.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        timeZone: "America/Fortaleza"
    });

    if (dataElement) {
        dataElement.textContent = dataFormatada;
    }

    if (dataCapa) {
        dataCapa.textContent = dataCasamento.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            timeZone: "America/Fortaleza"
        });
    }

    iniciarContagem(dataCasamento.getTime());
}


/* ========================================
   LINK PARA O GOOGLE MAPS
======================================== */

if (linkMapa) {
    const enderecoCodificado = encodeURIComponent(casamento.endereco);

    linkMapa.href =
        `https://www.google.com/maps/search/?api=1&query=${enderecoCodificado}`;

    linkMapa.target = "_blank";
    linkMapa.rel = "noopener noreferrer";
    linkMapa.hidden = !casamento.endereco;
}


/* ========================================
   LISTA DE PRESENTES
======================================== */

if (linkPresentes) {
    if (casamento.listaPresentes.trim() !== "") {
        linkPresentes.href = casamento.listaPresentes;
        linkPresentes.target = "_blank";
        linkPresentes.rel = "noopener noreferrer";
        linkPresentes.hidden = false;
    } else {
        linkPresentes.hidden = true;
    }
}


/* ========================================
   CONTAGEM REGRESSIVA
======================================== */

function iniciarContagem(dataAlvo) {
    const diasElement = document.getElementById("dias");
    const horasElement = document.getElementById("horas");
    const minutosElement = document.getElementById("minutos");
    const segundosElement = document.getElementById("segundos");

    function atualizarContagem() {
        const agora = Date.now();
        const diferenca = dataAlvo - agora;

        if (diferenca <= 0) {
            if (diasElement) diasElement.textContent = "0";
            if (horasElement) horasElement.textContent = "0";
            if (minutosElement) minutosElement.textContent = "0";
            if (segundosElement) segundosElement.textContent = "0";
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

        if (diasElement) diasElement.textContent = dias;
        if (horasElement) horasElement.textContent = horas;
        if (minutosElement) minutosElement.textContent = minutos;
        if (segundosElement) segundosElement.textContent = segundos;
    }

    atualizarContagem();
    setInterval(atualizarContagem, 1000);
}


/* ========================================
   CONFIRMAÇÃO DE PRESENÇA (RSVP)
======================================== */

const formulario = document.getElementById("form-presenca");

if (formulario) {
    formulario.addEventListener("submit", async function (event) {
        event.preventDefault();

        const nomeInput = document.getElementById("nome");
        const quantidadeInput = document.getElementById("quantidade");
        const respostaInput = document.getElementById("resposta");
        const retorno = document.getElementById("retorno-formulario");
        const botao = formulario.querySelector('[type="submit"]');

        const nome = nomeInput?.value.trim();
        const quantidade = Number(quantidadeInput?.value);
        const resposta = respostaInput?.value;

        if (!nome || nome.length < 2 || nome.length > 100) {
            if (retorno) {
                retorno.textContent =
                    "Digite seu nome completo (de 2 a 100 caracteres).";
            }
            return;
        }

        if (!Number.isInteger(quantidade) || quantidade < 1 || quantidade > 5) {
            if (retorno) {
                retorno.textContent =
                    "Informe uma quantidade válida, entre 1 e 5 pessoas.";
            }
            return;
        }

        if (resposta !== "Sim" && resposta !== "Não") {
            if (retorno) {
                retorno.textContent =
                    "Selecione se você poderá comparecer.";
            }
            return;
        }

        if (!banco) {
            if (retorno) {
                retorno.textContent =
                    "A confirmação ainda não está conectada. Verifique as configurações do Supabase.";
            }
            return;
        }

        if (botao) {
            botao.disabled = true;
            botao.textContent = "Enviando...";
        }

        if (retorno) {
            retorno.textContent = "";
        }

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
                console.error("Erro ao salvar confirmação:", error);
                throw error;
            }

            if (retorno) {
                retorno.textContent =
                    "Obrigado! Sua confirmação foi registrada com sucesso.";
            }

            formulario.reset();

        } catch (erro) {
            console.error("Não foi possível registrar a confirmação:", erro);

            if (retorno) {
                retorno.textContent =
                    "Não foi possível registrar sua confirmação. Tente novamente mais tarde.";
            }
        } finally {
            if (botao) {
                botao.disabled = false;
                botao.textContent = "Confirmar presença";
            }
        }
    });
}
