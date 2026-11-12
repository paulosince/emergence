# Mapa de gerações do EMERGENCE

**Leia este arquivo antes de escolher qualquer motor, protocolo, documentação ou resultado.**

| Geração | Diretório de orientação | Estado | Regra |
|---|---|---|---|
| 1 — V1 | [archive/attempt-1-v1](archive/attempt-1-v1/README.md) | Campanha negativa pré-registrada | Preservar e reproduzir |
| 2 — V2 | [archive/attempt-2-v2](archive/attempt-2-v2/README.md) | Motor exploratório | Preservar e não promover a validação |
| 3 — Reescrita | [research](research/README.md) | Investigação vigente; implementação a verificar | Não herdar premissas automaticamente |

## Distinção entre classificação e movimentação

Esta revisão cria **áreas explícitas e índices de classificação**, mas **não move ainda os arquivos legados**, pois há referências cruzadas, scripts, testes e interfaces públicas apontando para seus caminhos. Uma movimentação sem auditoria comprometeria a reprodutibilidade e poderia quebrar a aplicação.

**Próxima operação técnica controlada:** inventariar a árvore completa e os imports, abrir branch de migração, realocar arquivos de documentação e código com atualização de referências, executar testes e revisar antes do merge. Nenhuma migração física é declarada concluída.

A organização científica é definida pela geração e pelo estatuto de evidência, não simplesmente pela data do arquivo.
