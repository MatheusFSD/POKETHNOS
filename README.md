# pokethnos_java

- **backend/** — Java 17 + Spring Boot. Toda a lógica de domínio e as regras do jogo (tribos, bandos, eras, pontuação, controle de regiões) expostas como API REST. Estado da partida mantido em memória (sem banco de dados).
- **frontend/** — React (Vite). Interface do jogo, consumindo a API do backend.

## Como rodar

### 1. Backend

Requer Docker e Docker Compose. Na raiz do projeto:

```bash
docker compose up --build
```

- backend em `http://localhost:8080`
- frontend em `http://localhost:5173`

O `frontend/Dockerfile` recebe `VITE_API_BASE_URL` como build arg (padrão `http://localhost:8080`, já configurado no `docker-compose.yml`) — a Vite embute essa URL no bundle estático em tempo de build, então ela precisa ser o endereço que o **navegador** vai usar para falar com o backend, não o nome do serviço dentro da rede do Compose. Se for publicar em outro host/porta, ajuste esse valor e rode `docker compose build frontend` de novo.

Para derrubar: `docker compose down`.

## Arquitetura

O jogo original roda inteiramente no navegador, com um objeto de estado global (`GerenciadorJogo`) e habilidades de tribo implementadas como callbacks síncronos que abrem modais e esperam o clique do jogador (padrão Strategy + State, ambos preservados aqui).

Como o backend não pode "pausar" uma requisição HTTP esperando um clique, esse fluxo foi convertido em uma máquina de estados explícita:

- Cada ação do jogador é um endpoint REST (`POST /api/games/{id}/actions/...`) que avança a partida o quanto for possível sem intervenção do jogador.
- Quando uma habilidade precisa de uma escolha (ex.: Voadores escolhendo a região do marcador, Venenosos escolhendo cartas para remover, Fadas escolhendo cartas para manter, Lutadores decidindo jogar um 2° Bando), o backend pausa e retorna um `pendingDecision` no estado da partida, com as opções válidas já calculadas.
- O frontend renderiza o modal correspondente e chama o endpoint de resolução daquela decisão, que retoma o fluxo de onde parou.

Principais pacotes do backend (`backend/src/main/java/com/pokethnos/`):

- `domain/` — classes de domínio (Carta, CartaPokemon, CartaDragao, Bando, Jogador, Regiao, Tribo, Baralho, Tabuleiro, MarcadorRegiao), espelhando `js/models.js`.
- `strategy/` — uma `EstrategiaHabilidade` por tribo (Voadores, Venenosos, Psíquicos, Metálicos, Fadas, Lutadores), espelhando `js/strategies.js`.
- `engine/` — `GerenciadorJogo` (estado da partida), `GameData` (dados estáticos: regiões, tribos, cartas, tokens de glória), `ScoringService` (pontuação de era).
- `service/GameService` — orquestra o ciclo de vida da partida e a máquina de estados de turno.
- `web/` — controller REST, DTOs e o mapeamento de estado interno → JSON.