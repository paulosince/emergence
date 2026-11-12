# V04 — Exuberância, confiança, estabilidade e poda

## Hipótese prévia
Constituir candidatos equivocados pode ser legítimo; confiança e estabilidade baixas permitem seleção posterior e poda.

## Heurística efetivamente aplicada
Atrasos candidatos predefinidos; atualizações programadas de c e s; C=c*s; confirmação/contradição alteram confiança; inatividade reduz estabilidade; poda por limiar; contagem de chegadas é proxy.

**Fonte primária:** código Python arquivado nesta pasta. Os parâmetros exatos, sementes, funções e eventuais testes internos devem ser auditados diretamente no código; este texto não os substitui.

## Resultados registrados
Arquivo original: [toy_resultados_v04.csv](./toy_resultados_v04.csv). Este registro preserva os valores fornecidos pela execução histórica; **não é uma replicação independente**.

- **associated**: cycle=5; source=0; lag_s=0.4; confidence=0.16; stability=0.18; consolidation=0.0288; confirmations=0; contradictions=0; proxy_arrivals=48
- **independent**: cycle=5; source=0; lag_s=0.4; confidence=0.16; stability=0.18; consolidation=0.0288; confirmations=0; contradictions=0; proxy_arrivals=4
- **drifting**: cycle=5; source=0; lag_s=0.4; confidence=0.16; stability=0.18; consolidation=0.0288; confirmations=0; contradictions=0; proxy_arrivals=16

Linhas CSV: 36; cabeçalho: `mode,cycle,source,lag_s,confidence,stability,consolidation,confirmations,contradictions,proxy_arrivals`.

## Conclusão científica delimitada
Associações estáveis consolidam, independentes permanecem frágeis ou são podadas. Não há garantia de que erros persistentes sejam eliminados, nem propagação autônoma completa.

## Limitações e pontos de refutação
- Simulação computacional, não evidência neurobiológica nem demonstração de representação CLEAR.
- Heurísticas de detecção, critérios de reforço/poda e condições iniciais foram definidos por programação.
- Verificar no código se há Upro e Uint efetivamente constituídas ou apenas estruturas/indicadores experimentais.
- Não declarar originalidade, suficiência ou necessidade do mecanismo.
- Resultados negativos, ambiguidades, erros e falhas de generalização são parte dos dados, não exceções a ocultar.

## Proveniência
Código e CSV originais preservados sem alteração intencional nesta pasta. Interpretação científica redigida retrospectivamente em 2026-11-12; não é um registro pré-registrado anterior à execução.
