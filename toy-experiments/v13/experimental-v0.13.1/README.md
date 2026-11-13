# EMERGENCE V0.13 — ensaio exploratório de constituição

Execução: `npm test` e `npm run experiment` (Node.js, ESM, sem dependências).

## Fronteira experimental
Nenhuma Uint ou Upro é criada pelo script do ambiente. `experiment.js` apenas emite 24 sinais físicos sintéticos, em dois canais. O construtor de `Experiment` inicia com zero Uint e zero Upro. O transdutor aplica `log1p` à amplitude. Regras endógenas instrumentais, predefinidas, acumulam intervalos por canal; após três recorrências da mesma faixa temporal, acionam `UintFactory`. Após duas transições entre unidades efetivamente ativadas, acionam `UproFactory`, calculando atraso da mediana de diferenças observadas. A factory exige uma trilha, mas essa checagem por si só não prova autonomia.

## Resultado executado
24 sinais; 2 Uint constituídas em t=30 e t=34; 2 Upro constituídas em t=44 e t=50; atrasos 4 e 6; 14 entregas agendadas. 6 testes instrumentais passaram.

## Limitações científicas críticas
1. O algoritmo de reconhecimento de recorrências, a discretização temporal, os limiares, a distinção de canais e a regra de conexão são **predefinidos**. O sistema não inventa essas regras.
2. O ambiente fornece deliberadamente uma sequência periódica de dois canais. Isso não predetermina chamadas de factory, mas facilita que o algoritmo reconheça padrões.
3. A determinação de extremos é uma função da ordem de ativações das Uint existentes. Trata-se de autonomia operacional condicionada às regras, não prova de autonomia representacional.
4. O motor de entrega é mínimo: não implementa a semântica temporal integral, concorrência, refratariedade, plasticidade, custos e controles P1–P6 do protocolo fechado.
5. A trilha de auditoria documenta a origem dos eventos, mas ainda não permite reconstrução independente completa do estado de cada operação.
6. Não se demonstrou organização especificadora, fundamentação transdutiva e determinação autônoma em conjunto, nem uso de conteúdo representacional. Não há demonstração L3.
7. O experimento é exploratório, não ensaio confirmatório pré-registrado.

**Conclusão:** foi executado um primeiro ensaio de instanciação condicionada por sinais transduzidos, sem chamadas manuais de factories no cenário. O resultado não valida a V0.13 integral nem representação.
