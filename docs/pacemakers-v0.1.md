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

## 6. Detalhamento do oscilador do tipo Goodwin (pedido do responsável, 09/11/2026)

### 6.1 A ideia em linguagem simples
Um gene produz um mensageiro (**X**). O mensageiro produz uma proteína (**Y**). A proteína vira, depois de modificada, um repressor (**Z**). O repressor **desliga o próprio gene**.

Como cada passo leva tempo, o repressor chega **atrasado**:
1. Quando chega, já há muito mensageiro e muita proteína; o gene desliga.
2. Sem produção, tudo é degradado aos poucos, inclusive o repressor.
3. Quando o repressor cai o bastante, o gene religa, e o ciclo recomeça.

É uma **retroalimentação negativa com atraso**: o mesmo motivo que, segundo Takahashi (2017), está no relógio de todas as espécies, com peças diferentes.

### 6.2 As equações
Forma de Goodwin (1965), descrita em Gonze e Abou-Jaoudé (2013):
- dX/dt = v₁ · Kⁿ/(Kⁿ + Zⁿ) − k₂X (transcrição reprimida por Z; degradação)
- dY/dt = k₃X − k₄Y (tradução; degradação)
- dZ/dt = k₅Y − k₆Z (ativação do repressor; degradação)

A única não linearidade é a **repressão**: a curva Kⁿ/(Kⁿ + Zⁿ), cuja inclinação é dada por **n** (coeficiente de Hill).

### 6.3 O problema da inclinação e as soluções
- Com degradações lineares, o laço de três passos **só oscila de forma sustentada se n > 8** (Griffith, 1968, citado por Gonze e Abou-Jaoudé, 2013). Abaixo disso, as oscilações se amortecem. Uma repressão tão íngreme é pouco plausível.
- **Condição da secante** (Thron, 1991–1992): num laço de N passos, a instabilidade exige ganho acima de sec(π/N)^N. Com 3 passos o limite é 8; com 4 passos, 4. **Mais passos, ou mais atraso, exigem menos inclinação.**
- **Degradação saturável** (Michaelis-Menten) também resolve: Gonze et al. (2005) obtêm oscilação sustentada com **n = 4**, justificando que a degradação das proteínas do relógio é controlada por fosforilação, ubiquitinação e proteassomo.

### 6.4 Modelo proposto: o de Gonze et al. (2005), para células do núcleo supraquiasmático
Variáveis: X (mensageiro), Y (proteína), Z (repressor) e **V (neuropeptídeo**, produzido em proporção a X). A forma abaixo é **reconstruída** a partir do texto e da tabela de parâmetros; as equações do artigo estão em imagem e **precisam ser conferidas no PDF**:
- dX/dt = v₁ K₁ⁿ/(K₁ⁿ + Zⁿ) − v₂ X/(K₂ + X) + v_c K F/(K_c + K F) + L
- dY/dt = k₃ X − v₄ Y/(K₄ + Y)
- dZ/dt = k₅ Y − v₆ Z/(K₆ + Z)
- dV/dt = k₇ X − v₈ V/(K₈ + V)
- F = média de V entre as células (campo médio do neuropeptídeo)

Parâmetros da figura 1 (lidos):

| v₁ | K₁ | n | v₂ | K₂ | k₃ | v₄ | K₄ | k₅ | v₆ | K₆ | k₇ | v₈ | K₈ | v_c | K_c | K |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0,7 nM/h | 1 nM | 4 | 0,35 nM/h | 1 nM | 0,7/h | 0,35 nM/h | 1 nM | 0,7/h | 0,35 nM/h | 1 nM | 0,35/h | 1 nM/h | 1 nM | 0,4 nM/h | 1 nM | 0,5 |

- **Variabilidade entre células:** as taxas são divididas por um fator sorteado (média 1, desvio 0,05). Células isoladas têm período médio de **23,5 h**; acopladas (10.000 células), cerca de **26,5 h**.
- **Luz:** termo L somado à transcrição de X; no arrastamento, L passa de 0 (escuro) a 0,01 (claro).
- **Acoplamento:** o neuropeptídeo liberado por cada célula forma um campo médio F que age, saturando, na transcrição. O acoplamento **amortece** cada relógio individual e com isso facilita a sincronização rápida.

### 6.5 Como entra no motor
- **Unidade de relógio:** os estados internos X, Y, Z e V avançam por integração numérica entre os eventos do motor. O passo é pequeno diante do período (por exemplo, 0,05 h), e o resultado é determinístico.
- **Conjunto:** um pequeno número de unidades de relógio (por exemplo, 20), com variabilidade de período, acopladas pelo neuropeptídeo.
  - Variante principal: campo médio, como em Gonze et al.
  - Variante espacial: o neuropeptídeo transmitido pelo módulo de difusão; precisa de parâmetros próprios, ainda sem fonte.
- **Luz:** um canal luminoso do mundo (a sala multi-dia já tem lâmpada e Sol) alimenta o termo L. É um **arrastamento**, não um conteúdo: a unidade de relógio não constitui representação da luz.
- **Saída:** a fase do relógio (por exemplo, o nível de X normalizado) modula o impulso intrínseco das **unidades marca-passo** do relógio; elas alimentam o interruptor de estado. Que neurônios do relógio disparem mais no dia subjetivo é **leitura minha, a verificar**.
- **Compressão do tempo para testes:** multiplicar todas as taxas por um fator encurta o período sem mudar a forma, como Gonze e Abou-Jaoudé (2013) observam ao falar de reescala.

### 6.6 Equivalência, perdas e testes
- **Equivalência:** o mesmo motivo de rede, retroalimentação negativa com atraso, com degradação saturável que dispensa a repressão íngreme.
- **Perdas:** as múltiplas alças do relógio real (Takahashi, 2017), os relógios periféricos, a compensação de temperatura e a regulação pós-transcricional.
- **Testes:**
  1. Oscilação sustentada com n = 4 e degradação saturável; amortecida com degradação linear e n = 4.
  2. Período isolado perto de 23,5 h com os parâmetros publicados.
  3. Sincronização do conjunto acoplado.
  4. Arrastamento por ciclo claro-escuro.
  5. Desacoplado, cada unidade mantém o próprio ritmo (Welsh et al., 1995).
- **Variável regulada?** Não. O relógio não corrige o desvio de um ponto de ajuste. **Continua fora da rota regulatória**, como exige o ciclo imposto.

### Referências desta seção
- Gonze, D., Bernard, S., Waltermann, C., Kramer, A., e Herzel, H. (2005). Spontaneous synchronization of coupled circadian oscillators. *Biophysical Journal* 89, 120–129 (texto e tabela lidos na PMC; equações em imagem não lidas).
- Gonze, D., e Abou-Jaoudé, W. (2013). The Goodwin model: behind the Hill function. *PLoS ONE* 8, e69573 (lido em parte).
- Thron, C. D. (1991/1992). The secant condition for instability in biochemical feedback control. I. *Bulletin of Mathematical Biology* (registro lido; periódico e ano a conferir).

## 7. Implementação (09/11/2026)
- **Unidade de relógio** (`src/rhythm/clock.js`): conjunto de unidades do modelo de Gonze et al. (2005) integrado por Runge-Kutta de quarta ordem. Validação (`tests/rhythm.test.js`):
  - **unidade isolada: 23,7 h** (publicado: 23,5 h);
  - **população acoplada de 50 unidades: 26,9 h** (publicado: cerca de 26,5 h, com 10.000 células);
  - degradação linear com n = 4 **amortece** até parar, conforme a condição de Griffith;
  - **sem acoplamento**, cada unidade continua oscilando, mas a média da população se achata, como em Welsh et al. (1995);
  - com ciclo claro-escuro (L = 0,01 no claro), o período fica **arrastado em 24,00 h**.

  Esses resultados conferem a reconstrução das equações, já que as do artigo estão em imagem: as duas medidas publicadas são reproduzidas.
- **Unidade marca-passo** (`src/rhythm/pacemaker.js`): integrador com impulso intrínseco; próximo disparo calculado em forma fechada (por eventos). Testes:
  - período intrínseco exato;
  - uma entrada excitatória adianta o disparo;
  - mais impulso dá mais frequência;
  - abaixo do limiar de recrutamento, não dispara.
- **Ainda não feito:** ligar a fase do relógio ao impulso dos marca-passos e estes ao interruptor de estado; isso entra com o motor.

## Referências
- Buzsáki, G. (2002). Theta oscillations in the hippocampus. *Neuron* 33, 325–340.
- Guzman, J. N. et al. (2009). Robust pacemaking in substantia nigra dopaminergic neurons. *Journal of Neuroscience* 29(35), 11011–11019.
- Marder, E., e Bucher, D. (2001). Central pattern generators and the control of rhythmic movements. *Current Biology* 11(23), R986–R996.
- Smith, J. C., Ellenberger, H. H., Ballanyi, K., Richter, D. W., e Feldman, J. L. (1991). Pre-Bötzinger complex. *Science* 254, 726–729.
- Welsh, D. K., Logothetis, D. E., Meister, M., e Reppert, S. M. (1995). Individual neurons dissociated from rat suprachiasmatic nucleus express independently phased circadian firing rhythms. *Neuron* 14, 697–706.
- Goodwin (1965) e Griffith (1968): citados por Gonze e Abou-Jaoudé (2013), *PLoS ONE* 8, e69573; originais não lidos.
- Sanchez-Padilla et al. (2014): lido apenas por comentário na *Nature Neuroscience*.
- Takahashi (2017): ver [unidades moduladoras](modulatory-units-v0.1.md).
