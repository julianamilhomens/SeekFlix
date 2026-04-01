<div align="center">

<img src="https://github.com/user-attachments/assets/7cc5e51e-2c3c-4064-b700-4528a7c0d57f" alt="SeekFlix Logo" width="200" />

### Busca de filmes e séries com dados em tempo real

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/pt-BR/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/pt-BR/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
[![TMDB](https://img.shields.io/badge/API-TMDB-01b4e4?style=flat)](https://www.themoviedb.org/documentation/api)
[![Netlify](https://img.shields.io/badge/Deploy-Netlify-00C7B7?style=flat&logo=netlify&logoColor=white)](https://www.netlify.com)

🔗 **[Ver projeto em produção](https://seekflix.netlify.app)** 

[Português](#português) • [English](#english)

---
<video src="https://github.com/user-attachments/assets/01f66bdf-e483-4fff-b28a-b28ab309aa66" alt="Demonstração do SeekFlix" width="500" />

</div>



### 📋 Planejamento

Antes de iniciar o desenvolvimento, o projeto foi planejado em um quadro Kanban no Notion com tarefas organizadas por etapa — HTML, CSS e JavaScript — e melhorias futuras mapeadas no backlog.

🔗 [Ver planejamento no Notion](https://www.notion.so/478266d4ded543218c2b93a2830919b1?v=4ebb4f11ea404e9a982c4768825c1041)

**Etapas concluídas:**
- Etapa 1 — HTML: estrutura base, header, telas, estados, grid, modal e toast
- Etapa 2 — CSS: variáveis, reset, layout, animações e responsividade
- Etapa 3 — JavaScript: configuração da API, busca async/await, renderização, modal, histórico, filtros e eventos

**Melhorias mapeadas para o futuro (backlog):**
- Criar backend para proteger a chave de API
- Migrar para React
- Adicionar debounce na busca
- Implementar paginação de resultados
- Melhorar UX com animações adicionais

---

### 📌 O que foi desenvolvido

O **SeekFlix** é uma aplicação web interativa para busca de filmes e séries. O usuário digita um título, a aplicação consulta a API pública do TMDB (The Movie Database) em tempo real e exibe os resultados de forma dinâmica.

O projeto foi desenvolvido utilizando apenas **HTML, CSS e JavaScript puro**, sem frameworks ou bibliotecas externas, com foco em entregar uma experiência funcional, organizada e agradável de usar.

**Funcionalidades entregues:**
- Tela inicial com campo de busca e filtros por tipo (Todos / Filmes / Séries)
- Tela de resultados com grid de cards dinâmicos (poster, nota, ano e tipo)
- Modal de detalhes ao clicar em um card (sinopse, elenco, gêneros e banner)
- Loading state enquanto a API responde
- Tratamento de erros com mensagens amigáveis e botão "Tentar novamente"
- Histórico das últimas 5 buscas salvo no navegador via localStorage
- Design responsivo para desktop, tablet e celular
- Animações nos cards e transições de tela

---

### ⚙️ Como funciona a aplicação

O fluxo da aplicação é dividido em três etapas:

**1. Tela inicial**
O usuário vê um campo de busca com filtros de tipo. Ao digitar e clicar em "Buscar" (ou pressionar Enter), a aplicação valida o campo e inicia a requisição.

**2. Busca e exibição de resultados**
O JavaScript faz uma chamada assíncrona (`fetch` com `async/await`) para a API do TMDB usando o endpoint `/search/multi`, que retorna filmes e séries ao mesmo tempo. Enquanto aguarda a resposta, um spinner de loading é exibido. Ao receber os dados, os resultados são renderizados dinamicamente no DOM como cards clicáveis.

**3. Detalhes do item**
Ao clicar em um card, um modal é aberto com uma segunda requisição à API — desta vez para o endpoint de detalhes (`/movie/{id}` ou `/tv/{id}`), que retorna sinopse, elenco e imagem de banner.

**Diagrama do fluxo:**
```
Usuário digita → fetch para TMDB API → recebe JSON → renderiza cards → clica → abre modal
```

---
### 🧠 Principais decisões tomadas

#### Vanilla JavaScript em vez de frameworks:
Optei por não usar React porque o escopo do projeto não exigia gerenciamento de estado complexo. Usar JavaScript puro me deu controle total sobre o código e facilitou a explicação de cada decisão. A migração para React está mapeada como melhoria futura.

#### `async/await` para as requisições:
Escolhi `async/await` em vez de `.then()` porque o código fica mais legível e próximo de uma leitura sequencial, facilitando o entendimento do fluxo da aplicação.

#### `classList.add/remove` para controlar estados:
Em vez de manipular `display` diretamente no JavaScript, criei a classe `.escondido` no CSS e uso `classList` para adicioná-la ou removê-la. Isso separa responsabilidades: o CSS cuida da aparência, o JS cuida da lógica.

#### `localStorage` para o histórico:
As últimas 5 buscas são salvas no navegador para que o usuário não perca o histórico ao recarregar a página.

#### Filtro client-side:
Quando o usuário troca o filtro na tela de resultados, a aplicação não faz nova requisição à API — filtra o array já carregado em memória. Isso evita requisições desnecessárias e torna o filtro instantâneo.

#### Grid com `auto-fill` e `minmax`:
O layout de cards usa CSS Grid com `repeat(auto-fill, minmax(180px, 1fr))`, tornando a grade responsiva automaticamente sem media queries específicas para cada breakpoint.

#### Segurança da chave de API:
Em projetos front-end puros, não é possível esconder completamente a chave da API. A solução correta seria um back-end próprio intermediando as chamadas ao TMDB. Para este projeto, a chave está no código com consciência dessa limitação — e a criação do back-end está mapeada no backlog.

---

### 🚀 Como executar localmente

**Pré-requisito:** uma chave de API gratuita do TMDB.

1. Acesse [themoviedb.org](https://www.themoviedb.org), crie uma conta e gere uma chave em **Configurações → API**
2. Clone o repositório ou baixe os arquivos
3. Abra o `script.js` e substitua `'SUA_CHAVE_AQUI'` pela sua chave
4. Abra o `index.html` diretamente no navegador — não é necessário servidor

---

### 🔭 O que faria diferente com mais tempo

Essas melhorias já estão mapeadas no backlog do planejamento:

**Back-end como intermediário** — 
Criaria uma API própria (Node.js com Express) para intermediar as chamadas ao TMDB, protegendo a chave de API no servidor.

**Migração para React** — 
Refatoraria o projeto em componentes React para melhor organização e reaproveitamento de código.

**Debounce na busca** — 
Adicionaria debounce no campo de busca para disparar a requisição automaticamente enquanto o usuário digita, sem precisar clicar no botão.

**Paginação dos resultados** — 
Implementaria um botão "Carregar mais" ou scroll infinito para buscar as páginas seguintes da API.

**Tela de favoritos** — 
Usaria o localStorage para permitir que o usuário salve filmes e séries favoritos em uma lista persistente.

**Testes** — 
Escreveria testes básicos com Jest para as funções principais, como a montagem dos cards e o tratamento de erros.

---

### 🛠️ Tecnologias utilizadas

| Tecnologia | Uso |
|---|---|
| HTML5 | Estrutura e semântica da aplicação |
| CSS3 | Estilização, animações e responsividade |
| JavaScript ES6+ | Lógica, consumo de API e manipulação do DOM |
| [TMDB API](https://www.themoviedb.org/documentation/api) | Fonte dos dados de filmes e séries |
| [Google Fonts](https://fonts.google.com/) | Fontes Bebas Neue e DM Sans |
| localStorage | Persistência do histórico de buscas |
| [Netlify](https://www.netlify.com) | Hospedagem e deploy contínuo |
| [Notion](https://notion.so) | Planejamento e organização das tarefas |

---

### 📁 Estrutura do projeto

```
seekflix/
├── index.html     # Estrutura e marcação da aplicação
├── style.css      # Estilos, animações e responsividade
├── script.js      # Lógica, consumo de API e interações
└── README.md      # Documentação do projeto
```

---

<br>

## English

---

### 📋 Planning

Before starting development, the project was planned in a Notion Kanban board with tasks organized by stage — HTML, CSS, and JavaScript — and future improvements mapped in the backlog.

🔗 [View planning on Notion](https://www.notion.so/478266d4ded543218c2b93a2830919b1?v=4ebb4f11ea404e9a982c4768825c1041)

**Completed stages:**
- Stage 1 — HTML: base structure, header, screens, states, grid, modal, and toast
- Stage 2 — CSS: variables, reset, layout, animations, and responsiveness
- Stage 3 — JavaScript: API setup, async/await search, rendering, modal, history, filters, and events

**Future improvements (backlog):**
- Create a back-end to protect the API key
- Migrate to React
- Add debounce to the search field
- Implement results pagination
- Improve UX with additional animations

---

### 📌 What was developed

**SeekFlix** is an interactive web application for searching movies and TV shows. The user types a title, the app queries the TMDB (The Movie Database) public API in real time, and dynamically displays the results.

The project was built using only **HTML, CSS, and vanilla JavaScript** — no frameworks or external libraries — focused on delivering a functional, organized, and pleasant experience.

**Features delivered:**
- Home screen with search field and filters (All / Movies / TV Shows)
- Results screen with a dynamic card grid (poster, rating, year, and type)
- Details modal on card click (synopsis, cast, genres, and banner)
- Loading state while the API responds
- Error handling with user-friendly messages and a "Try again" button
- History of the last 5 searches saved in the browser via localStorage
- Responsive design for desktop, tablet, and mobile
- Card animations and screen transitions

---

### ⚙️ How the application works

The application flow is divided into three stages:

**1. Home screen**
The user sees a search field with type filters. After typing and clicking "Search" (or pressing Enter), the app validates the input and starts the request.

**2. Search and results display**
JavaScript makes an asynchronous call (`fetch` with `async/await`) to the TMDB API using the `/search/multi` endpoint, which returns movies and TV shows simultaneously. While waiting for the response, a loading spinner is shown. Once data arrives, results are dynamically rendered in the DOM as clickable cards.

**3. Item details**
Clicking a card opens a modal with a second API call — this time to the details endpoint (`/movie/{id}` or `/tv/{id}`), which returns synopsis, cast, and banner image.

**Flow diagram:**
```
User types → fetch to TMDB API → receives JSON → renders cards → clicks → opens modal
```

---

### 🧠 Main decisions made

#### Vanilla JavaScript instead of frameworks:
I chose not to use React because the project scope didn't require complex state management. Plain JavaScript gave me full control over the code and made it easier to explain every decision. Migration to React is mapped as a future improvement.

#### `async/await` for requests:
I chose `async/await` over `.then()` because it produces more readable code that flows sequentially, making the application logic easier to follow.

#### `classList.add/remove` for state control:
Instead of directly manipulating `display` in JavaScript, I created a `.escondido` (hidden) class in CSS and use `classList` to add or remove it. This separates concerns: CSS handles appearance, JS handles logic.

#### `localStorage` for search history:
The last 5 searches are saved in the browser so the user doesn't lose their history on page reload.

#### Client-side filtering:
When the user switches filters on the results screen, the app doesn't make a new API call — it filters the already-loaded results array in memory. This avoids unnecessary requests and makes filtering instant.

#### Grid with `auto-fill` and `minmax`:
The card layout uses CSS Grid with `repeat(auto-fill, minmax(180px, 1fr))`, making the grid automatically responsive without specific media queries for each breakpoint.

#### API key security: 
In front-end only projects, it's not possible to fully hide the API key. The proper solution would be a dedicated back-end to proxy TMDB calls server-side. For this project, the key is in the code with awareness of this limitation — and back-end creation is mapped in the backlog.

---

### 🚀 Running locally

**Prerequisite:** a free TMDB API key.

1. Go to [themoviedb.org](https://www.themoviedb.org), create an account, and generate a key under **Settings → API**
2. Clone the repository or download the files
3. Open `script.js` and replace `'SUA_CHAVE_AQUI'` with your key
4. Open `index.html` directly in your browser — no server required

---

### 🔭 What I would do differently with more time

These improvements are already mapped in the planning backlog:

**Back-end as intermediary** — 
I would create a dedicated API (Node.js with Express) to proxy TMDB calls and keep the API key protected on the server.

**Migration to React** — 
I would refactor the project into React components for better organization and code reuse.

**Debounced search field** — 
I would add debounce to the search field to trigger requests automatically as the user types, without needing to click the button.

**Results pagination** — 
I would implement a "Load more" button or infinite scroll to fetch subsequent pages from the API.

**Favorites screen** — 
I would use localStorage to let users save favorite movies and shows in a persistent list.

**Tests** — 
I would write basic tests with Jest for the main functions, such as card rendering and API error handling.

---

### 🛠️ Technologies

| Technology | Usage |
|---|---|
| HTML5 | Application structure and semantics |
| CSS3 | Styling, animations, and responsiveness |
| JavaScript ES6+ | Logic, API consumption, and DOM manipulation |
| [TMDB API](https://www.themoviedb.org/documentation/api) | Movie and TV show data source |
| [Google Fonts](https://fonts.google.com/) | Bebas Neue and DM Sans fonts |
| localStorage | Search history persistence |
| [Netlify](https://www.netlify.com) | Hosting and continuous deployment |
| [Notion](https://notion.so) | Project planning and task organization |

---

### 📁 Project structure

```
seekflix/
├── index.html     # Application structure and markup
├── style.css      # Styles, animations, and responsiveness
├── script.js      # Logic, API consumption, and interactions
└── README.md      # Project documentation
```

---

## 👨‍💻 Desenvolvido por
<div align="center">
  <img src="https://github.com/julianamilhomens.png" width="100px" style="border-radius: 50%" alt="Juliana Milhomens"/>
  <br/>
  <strong>Juliana Milhomens</strong>
  <br/>

[![GitHub](https://img.shields.io/badge/GitHub-julianamilhomens-181717?style=for-the-badge&logo=github)](https://github.com/julianamilhomens)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-julianamilhomens-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/julianamilhomens)
</div
