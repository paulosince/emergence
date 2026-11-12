# V0.8 — Observatório espacial JavaScript

[Interface](./index.html) · [Pré-registro](./preregistration.md) · [Estado de resultados](./results.md)

## Executar

Servidor estático na raiz do repositório: `python -m http.server 8000`; abrir `http://localhost:8000/toy-experiments/v08/`. Abrir `index.html` diretamente via `file://` pode bloquear imports ES modules; o visualizador do ChatGPT também pode bloquear JavaScript.

Não há build nem dependências externas. Arquivos em `src/` têm responsabilidades separadas: `space` (limites e geometria), `entities` (registro de entidades), `mechanisms` (transdução, marcas, Pcrt, propagação, consolidação), `simulation` (orquestração), `audit` (trilha), `view` (projeção tridimensional) e `main` (interface).

## Estatuto científico e limitações

O observatório projeta um volume tridimensional manipulável por rotação e zoom, mas não é um motor físico 3D. As marcas têm posição fixa e extensão crescente: a frente é uma propriedade escalar, não uma entidade geométrica propagante independente. As fibras são agrupamentos lógicos; a linha visual de Upro não é geometria física efetivamente percorrida. A rotina `pcrtCapture` é uma heurística programada. Não há constituição de Uint: o contador deverá permanecer em zero. `upro.propagation.arrived` registra chegada simulada, mas não há recepção funcional por Uint nem confirmação por contradição; a confiança cresce por captura repetida. Não se demonstrou representação.

O código não foi validado por execução em navegador nesta publicação. Testes reproduzíveis e resultados quantitativos devem ser adicionados, sem alegar execução não realizada.

## Auditoria

Exportar CSV pelo botão da interface. Os registros incluem criação, mudança de propriedades, remoção, captura, propagação e decisões constitutivas. Esta primeira versão não é event sourcing completo: replay integral e trilha de aleatoriedade por sorteio ainda precisam ser implementados. As sementes e o cenário são fixados no código, mas a trilha ainda não registra cada sorteio. Esses pontos são pendências explícitas, não requisitos satisfeitos.
