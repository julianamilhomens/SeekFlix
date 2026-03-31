/* ================================
   script.js — SeekFlix

   1. Configuração da API
   2. Variáveis globais
   3. Referências ao DOM
   4. Inicialização
   5. Busca
   6. Renderização dos cards
   7. Modal de detalhes
   8. Histórico de buscas
   9. Filtros
   10. Funções auxiliares
   11. Eventos
================================ */


/* ================================
   1. CONFIGURAÇÃO DA API

   Chave de autenticação para a TMDB API.
   Em produção, o ideal é que essa chave
   fique em um servidor intermediário para
   não ser exposta no client-side. Para
   este projeto de estudo, está no front-end
   com ciência dessa limitação.
================================ */
const CHAVE_API = '7b1331521d94330b07d17dd07494d1d8';

const URL_BASE = 'https://api.themoviedb.org/3';
const URL_IMAGEM = 'https://image.tmdb.org/t/p/w500';
const URL_BANNER = 'https://image.tmdb.org/t/p/w1280';


/* ================================
   2. VARIÁVEIS GLOBAIS
================================ */
let tipoSelecionado = 'multi';
let ultimaBusca = '';
let todosOsResultados = [];


/* ================================
   3. REFERÊNCIAS AO DOM
================================ */
const telaInicial = document.getElementById('telaInicial');
const telaResultados = document.getElementById('telaResultados');

const campoBusca = document.getElementById('campoBusca');
const btnBuscar = document.getElementById('btnBuscar');
const campoBuscaResultados = document.getElementById('campoBuscaResultados');
const btnBuscarResultados = document.getElementById('btnBuscarResultados');

const termoBuscado = document.getElementById('termoBuscado');
const gradeResultados = document.getElementById('gradeResultados');

const loading = document.getElementById('loading');
const erro = document.getElementById('erro');
const mensagemErro = document.getElementById('mensagemErro');
const semResultados = document.getElementById('semResultados');
const btnTentarNovamente = document.getElementById('btnTentarNovamente');

const modal = document.getElementById('modal');
const conteudoModal = document.getElementById('conteudoModal');
const fecharModal = document.getElementById('fecharModal');

const buscasRecentes = document.getElementById('buscasRecentes');
const toast = document.getElementById('toast');
const logo = document.getElementById('logo');


/* ================================
   4. INICIALIZAÇÃO
================================ */
function init() {
  mostrarBuscasRecentes();
}


/* ================================
   5. BUSCA

   Orquestra o fluxo principal:
   validação → requisição → renderização.
   async/await para manter o código
   legível e de fácil manutenção.
================================ */
async function buscar(termo) {
  termo = termo.trim();

  if (!termo) {
    mostrarToast('Digite algo para buscar! 🎬');
    return;
  }

  ultimaBusca = termo;
  salvarBusca(termo);
  mostrarTelaResultados(termo);
  mostrarLoading();

  try {
    const url = `${URL_BASE}/search/${tipoSelecionado}?api_key=${CHAVE_API}&query=${termo}&language=pt-BR&page=1`;
    const resposta = await fetch(url);

    if (!resposta.ok) {
      throw new Error(`Erro ${resposta.status}`);
    }

    const dados = await resposta.json();

    /* O endpoint /search/multi inclui pessoas nos resultados.
       Removemos com filter para exibir apenas filmes e séries. */
    const resultados = dados.results.filter(function(item) {
      return item.media_type !== 'person';
    });

    todosOsResultados = resultados;
    esconderLoading();
    mostrarResultados(resultados);

  } catch (erroCapturado) {
    esconderLoading();
    mostrarErro(erroCapturado.message);
  }
}


/* ================================
   6. RENDERIZAÇÃO DOS CARDS
================================ */
function mostrarResultados(resultados) {
  erro.classList.add('escondido');
  semResultados.classList.add('escondido');
  gradeResultados.innerHTML = '';

  if (resultados.length === 0) {
    semResultados.classList.remove('escondido');
    return;
  }

  resultados.forEach(function(item, indice) {
    const card = criarCard(item, indice);
    gradeResultados.appendChild(card);
  });
}

function criarCard(item, indice) {
  /* Filmes usam "title" e "release_date".
     Séries usam "name" e "first_air_date".
     O operador || garante compatibilidade com ambos. */
  const titulo = item.title || item.name || 'Sem título';
  const tipo = item.media_type || (item.title ? 'movie' : 'tv');
  const dataCompleta = item.release_date || item.first_air_date || '';
  const ano = dataCompleta ? dataCompleta.split('-')[0] : '';
  const nota = item.vote_average ? item.vote_average.toFixed(1) : null;
  const urlPoster = item.poster_path ? URL_IMAGEM + item.poster_path : null;

  const card = document.createElement('div');
  card.className = 'card';

  /* Delay escalonado por índice cria o efeito de entrada em cascata */
  card.style.animationDelay = (Math.min(indice, 8) * 60) + 'ms';

  card.innerHTML = `
    <div class="card-imagem">
      ${urlPoster
        ? `<img src="${urlPoster}" alt="${titulo}" loading="lazy" />`
        : `<div class="sem-poster">🎬</div>`
      }
      ${nota ? `<div class="card-nota">⭐ ${nota}</div>` : ''}
      <div class="card-tipo">${tipo === 'movie' ? 'Filme' : 'Série'}</div>
    </div>
    <div class="card-info">
      <p class="card-titulo">${titulo}</p>
      ${ano ? `<p class="card-ano">${ano}</p>` : ''}
    </div>
  `;

  card.addEventListener('click', function() {
    abrirModal(item.id, tipo);
  });

  return card;
}


/* ================================
   7. MODAL DE DETALHES

   Segunda requisição à API para buscar
   dados completos do item selecionado.
   append_to_response=credits traz o
   elenco na mesma chamada.
================================ */
async function abrirModal(id, tipo) {
  modal.classList.remove('escondido');
  document.body.style.overflow = 'hidden';

  conteudoModal.innerHTML = `
    <div style="padding:60px; display:flex; flex-direction:column; align-items:center; gap:16px; color:#8888a0;">
      <div class="spinner"></div>
      <p>Carregando detalhes...</p>
    </div>
  `;

  try {
    const url = `${URL_BASE}/${tipo}/${id}?api_key=${CHAVE_API}&language=pt-BR&append_to_response=credits`;
    const resposta = await fetch(url);

    if (!resposta.ok) {
      throw new Error('Não foi possível carregar os detalhes.');
    }

    const detalhes = await resposta.json();
    preencherModal(detalhes, tipo);

  } catch (erroCapturado) {
    conteudoModal.innerHTML = `
      <div style="padding:60px; text-align:center; color:#8888a0;">
        <p>⚠️ Não foi possível carregar os detalhes.</p>
      </div>
    `;
  }
}

function preencherModal(detalhes, tipo) {
  const titulo = detalhes.title || detalhes.name;
  const dataCompleta = detalhes.release_date || detalhes.first_air_date || '';
  const ano = dataCompleta ? dataCompleta.split('-')[0] : '';
  const nota = detalhes.vote_average ? detalhes.vote_average.toFixed(1) : 'N/A';
  const sinopse = detalhes.overview || 'Sinopse não disponível.';
  const urlPoster = detalhes.poster_path ? URL_IMAGEM + detalhes.poster_path : null;
  const urlBanner = detalhes.backdrop_path ? URL_BANNER + detalhes.backdrop_path : null;

  const generos = detalhes.genres
    ? detalhes.genres.map(function(g) { return g.name; }).join(', ')
    : '';

  const elenco = detalhes.credits && detalhes.credits.cast
    ? detalhes.credits.cast.slice(0, 5).map(function(a) { return a.name; }).join(', ')
    : '';

  conteudoModal.innerHTML = `
    ${urlBanner
      ? `<img class="modal-banner" src="${urlBanner}" alt="${titulo}" />`
      : `<div class="modal-sem-banner">🎬</div>`
    }
    <div class="modal-corpo">
      <div class="modal-linha-topo">
        ${urlPoster
          ? `<div class="modal-poster"><img src="${urlPoster}" alt="${titulo}" /></div>`
          : `<div class="modal-sem-poster">🎬</div>`
        }
        <div>
          <p style="color: var(--cor-destaque); font-size: 0.8rem; font-weight: 600; text-transform: uppercase; margin-bottom: 6px;">
            ${tipo === 'movie' ? 'Filme' : 'Série'}
          </p>
          <h2 class="modal-titulo">${titulo}</h2>
          <div class="modal-meta">
            <span class="modal-nota">⭐ ${nota}</span>
            ${ano ? `<span>📅 ${ano}</span>` : ''}
            ${generos ? `<span>🎭 ${generos}</span>` : ''}
          </div>
        </div>
      </div>
      <div>
        <p class="modal-subtitulo">Sinopse</p>
        <p class="modal-sinopse">${sinopse}</p>
      </div>
      ${elenco ? `
        <div>
          <p class="modal-subtitulo">Elenco Principal</p>
          <p class="modal-sinopse">${elenco}</p>
        </div>
      ` : ''}
    </div>
  `;
}

function fecharModalFn() {
  modal.classList.add('escondido');
  document.body.style.overflow = '';
}


/* ================================
   8. HISTÓRICO DE BUSCAS

   Persiste os últimos 5 termos buscados
   no localStorage. JSON.stringify e
   JSON.parse convertem entre array
   e string, já que o storage só aceita
   valores do tipo string.
================================ */
const CHAVE_HISTORICO = 'seekflix_historico';

function salvarBusca(termo) {
  let historico = lerHistorico();

  historico = historico.filter(function(t) {
    return t.toLowerCase() !== termo.toLowerCase();
  });

  historico.unshift(termo);
  historico = historico.slice(0, 5);

  localStorage.setItem(CHAVE_HISTORICO, JSON.stringify(historico));
  mostrarBuscasRecentes();
}

function lerHistorico() {
  const salvo = localStorage.getItem(CHAVE_HISTORICO);
  if (!salvo) return [];
  return JSON.parse(salvo);
}

function mostrarBuscasRecentes() {
  const historico = lerHistorico();

  if (historico.length === 0) {
    buscasRecentes.innerHTML = '';
    return;
  }

  let tagsHtml = '';
  historico.forEach(function(termo) {
    tagsHtml += `<button class="tag-recente">${termo}</button>`;
  });

  buscasRecentes.innerHTML = `
    <p class="label-recentes">Buscas recentes</p>
    <div class="lista-recentes">${tagsHtml}</div>
  `;

  buscasRecentes.querySelectorAll('.tag-recente').forEach(function(tag) {
    tag.addEventListener('click', function() {
      campoBusca.value = tag.textContent;
      buscar(tag.textContent);
    });
  });
}


/* ================================
   9. FILTROS

   Na tela inicial: define o tipo para
   a próxima requisição.
   Na tela de resultados: filtra o array
   já carregado, sem nova requisição.
================================ */
function ativarFiltro(botaoClicado, grupo) {
  grupo.querySelectorAll('.btn-filtro').forEach(function(btn) {
    btn.classList.remove('ativo');
  });

  botaoClicado.classList.add('ativo');
  tipoSelecionado = botaoClicado.dataset.tipo;
}

function filtrarResultados(tipo) {
  if (tipo === 'multi') {
    mostrarResultados(todosOsResultados);
    return;
  }

  const filtrados = todosOsResultados.filter(function(item) {
    const tipoItem = item.media_type || (item.title ? 'movie' : 'tv');
    return tipoItem === tipo;
  });

  mostrarResultados(filtrados);
}


/* ================================
   10. FUNÇÕES AUXILIARES
================================ */
function mostrarLoading() {
  loading.classList.remove('escondido');
  erro.classList.add('escondido');
  semResultados.classList.add('escondido');
  gradeResultados.innerHTML = '';
}

function esconderLoading() {
  loading.classList.add('escondido');
}

function mostrarErro(mensagem) {
  erro.classList.remove('escondido');

  if (mensagem.includes('401')) {
    mensagemErro.textContent = 'Chave de API inválida. Verifique o arquivo script.js.';
  } else if (mensagem.includes('Failed to fetch')) {
    mensagemErro.textContent = 'Sem conexão com a internet. Verifique sua rede.';
  } else {
    mensagemErro.textContent = 'Algo deu errado. Tente novamente.';
  }
}

function mostrarTelaResultados(termo) {
  telaInicial.classList.add('escondido');
  telaResultados.classList.remove('escondido');
  termoBuscado.textContent = '"' + termo + '"';
  campoBuscaResultados.value = termo;
}

function mostrarTelaInicial() {
  telaResultados.classList.add('escondido');
  telaInicial.classList.remove('escondido');
  campoBusca.value = '';
  todosOsResultados = [];
}

let timerToast;
function mostrarToast(mensagem) {
  toast.textContent = mensagem;
  toast.classList.remove('escondido');

  clearTimeout(timerToast);
  timerToast = setTimeout(function() {
    toast.classList.add('escondido');
  }, 3000);
}


/* ================================
   11. EVENTOS
================================ */
btnBuscar.addEventListener('click', function() {
  buscar(campoBusca.value);
});

campoBusca.addEventListener('keydown', function(evento) {
  if (evento.key === 'Enter') buscar(campoBusca.value);
});

btnBuscarResultados.addEventListener('click', function() {
  buscar(campoBuscaResultados.value);
});

campoBuscaResultados.addEventListener('keydown', function(evento) {
  if (evento.key === 'Enter') buscar(campoBuscaResultados.value);
});

logo.addEventListener('click', function() {
  mostrarTelaInicial();
  mostrarBuscasRecentes();
});

fecharModal.addEventListener('click', fecharModalFn);

modal.addEventListener('click', function(evento) {
  if (evento.target === modal) fecharModalFn();
});

document.addEventListener('keydown', function(evento) {
  if (evento.key === 'Escape' && !modal.classList.contains('escondido')) {
    fecharModalFn();
  }
});

btnTentarNovamente.addEventListener('click', function() {
  if (ultimaBusca) buscar(ultimaBusca);
});

const grupoFiltrosInicial = document.querySelector('#telaInicial .filtros');
grupoFiltrosInicial.querySelectorAll('.btn-filtro').forEach(function(btn) {
  btn.addEventListener('click', function() {
    ativarFiltro(btn, grupoFiltrosInicial);
  });
});

const grupoFiltrosResultados = document.getElementById('filtrosResultados');
grupoFiltrosResultados.querySelectorAll('.btn-filtro').forEach(function(btn) {
  btn.addEventListener('click', function() {
    ativarFiltro(btn, grupoFiltrosResultados);
    filtrarResultados(tipoSelecionado);
  });
});


/* ================================
   INICIAR
================================ */
init();
