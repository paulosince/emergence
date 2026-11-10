# Registro de decisões do responsável

## 09/11/2026: fechamento das pendências do desenho do motor ("Sim para todos")
| Decisão | Conteúdo aprovado | Documento |
|---|---|---|
| Estabilidade em cascata | O decaimento desacelera a cada nível, sem parar; subir de nível exige reativação com portão modulador; manutenção por reativação; decaimento regulado no sono | [consolidação e decaimento](consolidation-decay-v0.1.md) |
| Recrutamento | Elementos ociosos de um substrato finito, alocados por excitabilidade relativa, com sobreposição entre memórias próximas no tempo; o critério de origem registra a alocação | [divergências](neurobiological-divergence-review-v0.1.md) |
| Níveis | Predefinidos e sem conteúdo como principal; recursão livre como variante | idem |
| Homeostase | Regulação lenta dos receptores e renormalização no sono | [unidades moduladoras](modulatory-units-v0.1.md) |
| Competição | Inibição lateral na resposta | [divergências](neurobiological-divergence-review-v0.1.md) |
| Ordem das escalas | Ajuste de atraso mais lento que o de peso | idem |
| Três fatores | Modulação epistêmica (novidade, surpresa) na primeira versão | [neuromodulação](neuromodulation-v0.1.md) |
| Consolidação | Portão modulador como principal; contagem de confirmações como variante | idem |
| Dissociação | Teste de dissociação entre correção e Orientação antecipado para a fase do motor | idem |
| Substância | Parâmetros medidos; partes por milhão do volume extracelular; remoção por região (linear pelo núcleo analítico; saturável numérica) | [difusão espacial](spatial-diffusion-v0.1.md) |
| Fontes | Neuronais predefinidas com entradas constituídas; gliais por território, com divisão por capacidade | [unidades moduladoras](modulatory-units-v0.1.md) |
| Receptores | Perfil por tipo e nível, com dessensibilização e regulação lenta | idem |
| Primeiros moduladores | Novidade e incerteza esperada | idem |
| Ciclo sono-vigília | Ciclo imposto por oscilador agora, com decaimento regulado no sono; ciclo completo com pressão homeostática depois da fase do motor. **Tipo de oscilador: em avaliação** ([marca-passos](pacemakers-v0.1.md)) | idem |
| Pré-registro | Revisão por mim com estas decisões; aprovação pelo responsável | [pré-registro](preregistration-v1.md) |
| Equivalências | Aprovadas como propostas registradas, revisáveis | [divergências](neurobiological-divergence-review-v0.1.md) |
| Nomes | Renomear as etapas numeradas do roteiro agora; identificadores de código quando cada módulo for reescrito | [nomenclatura](nomenclature.md) |

Decisões anteriores do mesmo dia: coordenadas constitutivas; unidades novas nascem perto das fontes aferentes; latência derivada da distância como variante já agora; núcleo analítico como implementação principal, sem colisões mecânicas, com partículas como variante de validação.

## 09/11/2026: marca-passos
- **Unidade marca-passo aprovada:** integrador com impulso intrínseco constante, limiar e reinício; entradas deslocam a fase; moduladores mudam a frequência; variante sem marca-passos (ritmo da rede por inibição recíproca) para comparação.
- **Unidade de relógio do tipo Goodwin:** detalhamento pedido ([marca-passos, seção 6](pacemakers-v0.1.md)); decisão pendente.

## 09/11/2026: tamanho e envelope
- **Separar** o tamanho do **substrato** (parâmetro por fase) do **envelope de segurança** (unidades recrutadas, taxa de criação, descargas, instâncias; parada que falha fechada; por fase).
- **Teste de desempenho** depois do incremento de substrato e recrutamento.
- **Série de escala** na fase do motor: substratos de 1.000, 10.000 e 100.000 elementos, para medir como os critérios variam com o tamanho.
- Envelope reavaliado a cada fase com o responsável; valores no pré-registro revisado.

## 09/11/2026: pré-registro e parâmetros abertos
- **Pré-registro aprovado** (versão revisada, com critério de maturação, envelope de 50.000 unidades vivas e 100 milhões de descargas, e tabela de parâmetros declarados).
- **Critério de maturação:** formulado depois de observar o motor. Minha recomendação registrada é **calibrá-lo com controles antes da campanha**; o responsável aprovou o texto sem objeção explícita a isso, então farei a calibração, salvo instrução contrária.
- **Parâmetros abertos a todos:** fonte única em `src/engines/constitutive/parameters.js`, executor configurável `scripts/run-constitutive.mjs`, tabela em [parâmetros](parameters.md). Mudar valor pré-registrado torna a execução exploratória.

## 09–10/11/2026 (sessão longa) — resumo
Ver [CONTINUITY.md](../CONTINUITY.md), seções 2 a 4, e os documentos citados ali: efeitos, surpresa, maturação v2, sono por estados ativos, via eferente, janela exploratória, robô (especificação v1), ambiente, interface de observação, difusão espacial dos moduladores (aprovada), refazer tudo preservando só o domínio.
