# EMERGENCE V0.14 — Auditoria diagnóstica A → B → A (12/11/2026)

**Estado:** diagnóstico exploratório executado, não validação científica V0.14. Código e testes completos no pacote local entregue nesta conversa.

## Achado impeditivo
Na V0.13, `features` é um mapa indexado por `channel:interval`. Após criar uma Uint, o motor armazena `f.unit` nesse mapa e, na reapresentação, executa `f.unit.activation++`. Assim, a seleção da unidade previamente constituída é realizada por um **lookup programado**, não por acesso demonstrado por meio das operações próprias da malha Uint/Upro. É evidência de reutilização do objeto, não de reacesso representacional.

Outros achados: `threshold` da Uint não governa a ativação; `intensity` é transduzida mas não participa da decisão de constituição ou reacesso; o marcador `proof.kind='endogenous'` não autentica origem; a formação de Upro por transições temporais necessita auditoria própria.

## Diagnóstico executado
Estímulos ambientais A (9), B (9), A novamente (6), sempre via transdutor; nenhuma chamada externa de factory. Uma Uint criada para A, uma para B, a mesma Uint de A ativada na reapresentação, sem nova Uint. Quatro testes instrumentais passaram. **A explicação por lookup não foi refutada.** As fases separadas não produziram relações Upro, portanto o teste não avalia acesso à organização relacional.

## Critério vinculante para continuar
Não substituir o lookup por outro reconhecedor programado ou por relações semeadas. Preservar factories e transdução; investigar operações constitutivas pelas quais incidências atuais possam efetivamente alcançar organizações anteriores. Separar auditoria, alteração de mecanismo, execução e inferência. A retirada pura e simples do mapa inviabilizaria a constituição atual; portanto a limpeza **não está concluída** e nenhuma conclusão de reacesso deve ser declarada.

Referência metodológica: [program-methodology.md](../../docs/program-methodology.md).
