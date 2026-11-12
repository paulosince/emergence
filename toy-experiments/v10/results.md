# EMERGENCE V0.10 — Resultados após execução

**Data:** 2026-11-12. **Estado:** núcleo executado em JS isolado, interface publicada sem validação de navegador. Pré-registro em [preregistration.md](./preregistration.md).

## Implementação
Meio discreto 3D com 12×8×6 = 576 células e 1512 conexões entre vizinhos ortogonais. Duas fontes transdutivas em (1,2,2) e (1,5,3). Propagação por trocas locais em seis direções, marcas temporais em cada célula, persistência e plasticidade local; nenhuma entidade chamada Uint ou Upro é criada. Sementes determinísticas; 720 passos (28,8 unidades de tempo), 60 períodos de estimulação.

## Resultados reais
| Cenário | Plasticidade | Células acima do limiar 0,025 | Maior plasticidade | Eventos de log |
|---|---|---:|---:|---:|
| Associadas | Sim | 60 | 0,093318 | 181 |
| Independentes | Sim | 15 | 0,052801 | 136 |
| Alternadas | Sim | 12 | 0,040943 | 121 |
| Associadas | Não | 0 | 0 | 181 |
| Independentes | Não | 0 | 0 | 136 |
| Alternadas | Não | 0 | 0 | 121 |

As células mais diferenciadas no cenário associado são (1,4,2) e (1,3,3), ambas com plasticidade ~0,093318. A prova por estímulos isolados e conjuntos nos cinco candidatos principais produz resposta isolada A=0, B=0 e conjunta AB>0. Exemplo célula 241: AB=0,0010192.

## Interpretação e refutação
**Não há Uint demonstrada.** O operador `output=structure*min(a,b)` foi programado explicitamente; logo, a seletividade conjunta é propriedade do detector implementado, não integração autonomamente constituída. O uso de traços `traceA` e `traceB` rotulados por fonte também embute separação de canais. O experimento demonstra que plasticidade local e propagação espacial podem diferenciar regiões com atividade conjunta, mas não constitui por si uma unidade integradora segundo a tríade representacional da CLEAR.

A condição 'independente' gera pulsos Bernoulli de ambas as fontes no mesmo instante de amostragem, podendo produzir coincidências; não é controle estrito de independência temporal. A condição 'alternada' também preserva traços que podem se sobrepor temporalmente. A saída é calculada por coincidência instantânea, portanto o resultado de A=0 e B=0 no teste isolado é tautológico. A identificação de células acima do limiar é classificação externa, não criação de uma Uint. Ainda não há percurso Upro identificável, nem demonstração de que uma região integradora organize percursos convergentes.

## Falhas em relação ao pré-registro
- **Parcialmente atendido:** interação por vizinhança espacial, persistência local, diferenciação espacial, controles de plasticidade, visualização e CSV.
- **Não atendido:** constituição autônoma da primeira Uint, formação de Upro aferentes, seleção funcional independente do detector codificado, teste adversarial com ablação espacial e análise de replay.
- **Interface:** não testada em navegador real neste ciclo.

## Conclusão
A V0.10 produz regiões espacialmente diferenciadas, não Uint. A hipótese de precedência ou coemergência Uint–Upro permanece aberta. Não converter essas regiões em Uint por nomenclatura ou limiar. Próxima etapa: retirar a operação de coincidência explícita e os rótulos por origem do mecanismo constitutivo, além de testar perturbação espacial e evolução de percursos locais.
