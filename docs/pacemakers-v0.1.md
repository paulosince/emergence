# Marca-passos e osciladores: avaliação e proposta

**Data:** 09/11/2026. **Pergunta do responsável:** que tipo de oscilador usar no ciclo imposto? Neurônios marca-passo parecem importantes para muita coisa e ainda não os temos. **Estado:** proposta minha, a aprovar. Fontes lidas por resumo, salvo indicação.

## 1. O que a literatura mostra
| Achado | Fonte |
|---|---|
| Neurônios do núcleo supraquiasmático, isolados em cultura, mantêm **cada um** um ritmo circadiano de disparo; na mesma cultura, apesar de sinapses funcionais, **não se sincronizam**; após bloqueio da atividade por 2,5 dias, voltam com a fase original | Welsh, Logothetis, Meister e Reppert (1995) |
| O relógio molecular é um laço de **retroalimentação negativa com atraso**, motivo comum entre espécies | Takahashi (2017) |
| O oscilador de Goodwin (1965), de três variáveis, gera oscilação por retroalimentação negativa com atraso; na forma original exige repressão muito íngreme (coeficiente de Hill acima de 8, segundo Griffith, 1968); variantes reproduzem curvas de resposta de fase e arrastamento pela luz | Gonze e Abou-Jaoudé (2013) e outros, por resumo |
| Neurônios dopaminérgicos da substância negra disparam de forma **autônoma** (marca-passo), sem precisar dos canais de cálcio do tipo L | Guzman et al. (2009) |
| Neurônios do locus coeruleus disparam espontaneamente em frequência estável; o marca-passo depende de canais de cálcio | Sanchez-Padilla et al. (2014), por comentário |
| Geradores centrais de padrão produzem ritmos motores sem entrada temporal externa; propriedades intrínsecas dos neurônios são cruciais; neuromoduladores moldam a saída | Marder e Bucher (2001) |
| O complexo pré-Bötzinger gera o ritmo respiratório e contém neurônios com propriedades de marca-passo; revisões posteriores indicam que os marca-passos **podem não ser essenciais** (o ritmo pode ser da rede) | Smith et al. (1991); revisão posterior, por resumo |
| O septo medial foi proposto como marca-passo do ritmo teta hipocampal; a visão de marca-passo único é considerada incompleta | Buzsáki (2002) |
| Oscilação lenta do sono de ondas lentas | Steriade, Nuñez e Amzica (1993): **não verificado nesta sessão** |

## 2. Onde marca-passos importam no programa
| Uso | Por quê | Quando |
|---|---|---|
| **Modo tônico das fontes moduladoras** | Os neurônios de dopamina e do locus coeruleus **são** marca-passos. A "taxa tônica de base" das fontes já aprovadas é atividade de marca-passo | **Agora** (fontes aprovadas) |
| **Relógio do ciclo sono-vigília** | Cada neurônio do relógio é um oscilador celular; o relógio molecular modula a taxa de disparo | **Agora** (ciclo imposto aprovado) |
| **Atividade espontânea no sono** | A reativação sem entrada do mundo precisa de um gerador | Agora, com o ciclo imposto |
| Ritmo teta e codificação temporal | Sequências e memória episódica | Fase dos níveis superiores |
| Geradores centrais de padrão | Controle motor rítmico | Fase motora |

## 3. Proposta: duas primitivas
### 3.1 Unidade marca-passo (elétrica)
- **Mecanismo:** corrente intrínseca despolarizante leva o neurônio ao limiar periodicamente, sem entrada.
- **Simplificação:** integrador com **impulso intrínseco constante**, limiar, reinício e período refratário. Isso dá um período intrínseco. Entradas **adiantam ou atrasam a fase** (curva de resposta de fase), e moduladores mudam a frequência.
- **Equivalência:** o integrador com impulso constante reproduz o disparo periódico autônomo e a resposta de fase.
- **Perdas:** as correntes iônicas específicas, o disparo em salvas e a dependência de cálcio.
- **Teste:** variante sem marca-passos, para ver se o ritmo emerge da rede por inibição recíproca (que já aprovamos), como sugerem as revisões do pré-Bötzinger.
- **Origem:** literatura, com proposta nossa de simplificação.

### 3.2 Unidade de relógio (molecular)
- **Mecanismo:** laço de retroalimentação negativa com atraso dentro da célula, com período de cerca de 24 h. A luz do mundo ajusta a fase.
- **Simplificação:** oscilador do tipo Goodwin, de três variáveis, ou um laço com atraso explícito, que dispensa a repressão íngreme. Um **pequeno conjunto** dessas unidades, com acoplamento fraco, compõe o relógio.
- **Saída:** a fase do relógio modula a taxa de disparo das unidades marca-passo do relógio, que por sua vez alimentam o interruptor de estado.
- **Equivalência:** o mesmo motivo de rede do relógio real.
- **Perdas:** detalhe molecular, relógios por tecido e acoplamento por neuropeptídeos.
- **Teste:** arrastamento pela luz; deslocamento de fase por pulsos; desacoplar as unidades e ver se cada uma mantém o ritmo, como em Welsh et al. (1995).
- **Origem:** literatura (Goodwin, 1965; Takahashi, 2017).

## 4. Resposta à pergunta
**Tipo de oscilador recomendado:** um **pequeno conjunto de unidades de relógio do tipo Goodwin, com atraso**, arrastadas pela luz do mundo. Elas modulam unidades **marca-passo**, que alimentam o interruptor de estado.

Isso **não introduz variável regulada**: o relógio não corrige um desvio de um ponto de ajuste. Continua fora da rota regulatória do VALORE, como exige a decisão do ciclo imposto.

A mesma primitiva marca-passo serve ao modo tônico das fontes moduladoras.

## 5. Ligação com a hipótese de organização do domínio
Ritmos intrínsecos fornecem **referências temporais internas**. A hipótese do responsável prevê que referências temporais se tornem centrais. **Previsão a registrar:** unidades acopladas a ritmos de marca-passo terão centralidade acima do nulo de taxa. Está sujeita aos mesmos confundidores de taxa já registrados.

## Referências
- Buzsáki, G. (2002). Theta oscillations in the hippocampus. *Neuron* 33, 325–340.
- Guzman, J. N. et al. (2009). Robust pacemaking in substantia nigra dopaminergic neurons. *Journal of Neuroscience* 29(35), 11011–11019.
- Marder, E., e Bucher, D. (2001). Central pattern generators and the control of rhythmic movements. *Current Biology* 11(23), R986–R996.
- Smith, J. C., Ellenberger, H. H., Ballanyi, K., Richter, D. W., e Feldman, J. L. (1991). Pre-Bötzinger complex. *Science* 254, 726–729.
- Welsh, D. K., Logothetis, D. E., Meister, M., e Reppert, S. M. (1995). Individual neurons dissociated from rat suprachiasmatic nucleus express independently phased circadian firing rhythms. *Neuron* 14, 697–706.
- Goodwin (1965) e Griffith (1968): citados por Gonze e Abou-Jaoudé (2013), *PLoS ONE* 8, e69573; originais não lidos.
- Sanchez-Padilla et al. (2014): lido apenas por comentário na *Nature Neuroscience*.
- Takahashi (2017): ver [unidades moduladoras](modulatory-units-v0.1.md).
