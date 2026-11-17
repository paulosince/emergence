# V0.17 — Otimização, fase 1: plano e critério de equivalência (escrito antes)

**Redação:** assistente (Claude), 17/11/2026. **Engenharia, não ciência:** nenhuma regra muda. Critério aprovado pelo responsável: **estatístico + exato onde der**.
**Base:** [estudo de otimização](../estudo-otimizacao-motor.md). **Motor de referência:** `motor_correcoes.py` (conjunto B). **Motor novo:** `motor_rapido.py`.

## Mudanças
1. **Listas de ramos por fibra:** a incidência percorre só os ramos da sua fibra (exato: mesma ordem, mesma conta).
2. **"Acerto recente" restrito ao lado da Uint:** só os ramos da mesma fibra e da mesma Uint (exato).
3. **Decaimento sob demanda:** cada ramo guarda o instante da última atualização; a força é atualizada quando lida (muda arredondamentos → estatístico).
4. **Eliminação competitiva verificada a cada 1 ms simulado**, em vez de a cada incidência de A (muda o instante exato da eliminação em até 1 ms, frente a um tempo de eliminação de 60 s → estatístico).

## Critério (fixado agora; números do assistente)
- **Exato:** com as mudanças 1 e 2 apenas (3 e 4 desligadas), saída idêntica à referência nas sementes 31–40 (grave e agudo).
- **Estatístico:** com tudo ligado, **sementes novas 61–90**, grave (seleção de Δ) e agudo (seleção em fase), referência e motor novo nas mesmas sementes. **Equivalente** se, em cada faixa, a diferença de taxa for ≤ 10 pontos percentuais **e** a taxa do motor novo estiver dentro do intervalo de 95% da referência. Senão, levar ao responsável.
- **Ganho:** tempo por execução, referência × novo, na mesma máquina e no mesmo processo.
