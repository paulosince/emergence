# Tentativa 2 — motor constitutivo V2 (histórico exploratório)

**Estatuto:** revisão exploratória posterior à campanha v1; não equivale a campanha confirmatória pré-registrada.

Documentos históricos ainda em seus caminhos originais:
- [Desenho do motor V2](../../docs/engine-v2-design-proposal.md)
- [Controles exploratórios](../../docs/v2-controls-exploratory-report.md)
- [Efeitos e dinâmica](../../docs/effects-v0.1.md)

Implementação histórica: `src/engines/constitutive/engine-v2.js` e `parameters-v2.js` (conforme README/CONTINUITY; verificar dependências antes de mover).

**Conflitos conhecidos com decisões mais recentes:** ganho independente versus confiança × modulação; modelos anteriores de estabilidade e consolidação; transdução por magnitude variável versus recrutamento por número de Upro. Não harmonizar retroativamente o V2: preservar sua especificação e registrar as diferenças na terceira geração.
