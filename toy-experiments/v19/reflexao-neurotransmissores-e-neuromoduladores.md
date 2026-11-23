# V0.19 — Reflexão: neurotransmissores e neuromoduladores na transdução representacional

**Data:** 23/11/2026. **Pergunta do responsável:** (1) a presença de neurotransmissores é complicação desnecessária, ou a ausência nos fará fazer malabarismos que complicam do mesmo jeito? (2) Os neuromoduladores com dispersão de partículas (já decididos em 09/11, `docs/spatial-diffusion-v0.1.md`) são necessários **já** para a transdução representacional, ou só depois? Pedido explícito: aplicar o método, sem sugerir a mais nem deixar faltar o que daria muito trabalho depois.
**Redação:** assistente (Claude). **Marcas:** [R] responsável; [L] literatura (grau de leitura); [A] leitura ou proposta do assistente.

## 1. Neurotransmissores

### 1.1 O que eles fazem no modelo neurobiológico que importa para a V0.19, e onde já temos o equivalente

| Função no modelo neurobiológico | Equivalente já decidido | Origem |
|---|---|---|
| Sinal do efeito (excitar ou inibir), que depende também do receptor de quem recebe | Efeito na incidência, adicionado pela Upro; parte das Upros nasce destinada a ser inibitória (20%) | [R] 22–23/11 |
| Gasto e recuperação (depleção de vesículas) | Reserva de efeito; janelas de reabastecimento, carregamento e dispersão | [V18] |
| Cinéticas rápida e lenta (ex.: AMPA e NMDA) | Janela de integração com componente rápida e lenta | [R] 11/11 |
| Co-liberação de glutamato pelas sinapses que serão inibitórias, durante o refinamento | A inibitória nasce excitatória e é selecionada antes de trocar de sinal | [R] 23/11 |

**Leitura [A]:** como entidade, o neurotransmissor continua dispensável (decisão de 18/11 na V0.18).

### 1.2 A peça que faria falta: o detector de coincidência da plasticidade

- No modelo neurobiológico, a regra "chega antes e o disparo vem depois → promove; chega depois → pune" acontece **na sinapse**: o receptor NMDA detecta a junção da entrada com o potencial de ação que volta pelo dendrito (retropropagação). O LTP por tempo é induzido quando a atividade sináptica é seguida de um ou mais potenciais retropropagados [L: revisão de 2012, resumo]. Janelas: até ~20 ms antes (promove), 20–100 ms depois (pune); 60–100 repetições [L: Feldman 2012; Bi e Poo 1998].
- **Isso não é neurotransmissor como entidade, mas precisa estar na regra já.** Sem isso, a regra aprovada (opção A, 23/11) não tem onde ser calculada, e teríamos de improvisar depois.
- **Proposta [A]:** (1) cada ramo guarda um rastro curto da última chegada; (2) o disparo da Uint chega de volta aos seus ramos; (3) a comparação é **local, no ramo**. Equivalência: NMDA + potencial retropropagado. Perdas: dependência da posição no dendrito (sinapses distantes seguem regras diferentes) e da despolarização local.

## 2. Neuromoduladores

### 2.1 O que o modelo neurobiológico mostra sobre mapas sensoriais

- **No adulto, a reorganização do mapa auditivo depende de neuromodulação:** parear tons com estimulação do núcleo basal (acetilcolina) reorganiza o mapa de frequências do córtex auditivo primário; sem o núcleo basal intacto, não há aumento da representação do estímulo [L: Kilgard e Merzenich 1998, resumo e trechos].
- **No período crítico do desenvolvimento, basta a exposição passiva:** o ambiente acústico inicial molda os mapas tonotópicos [L: Zhang, Bao e Merzenich 2001, resumo]; tons puros alteram de forma persistente as representações só se a exposição ocorrer entre P11 e P13 no rato [L: de Villers-Sidani et al. 2007, resumo].
- **Cautela:** no período crítico os neuromoduladores existem no animal; o achado mostra que não é preciso um sinal especial de importância pareado com o estímulo, e não que os neuromoduladores sejam irrelevantes. Confiança média.

### 2.2 Leitura [A]

1. O Sdom da V0.19 nasce vazio, como no período crítico, e a Pcrt fica ligada o tempo todo [R 21/11]. A pergunta da V0.19 (a reapresentação passa pela malha já criada?) **não precisa** de um sinal de importância.
2. **Colocar já traria um confundidor conhecido** (09/11, seção 2.2): unidades que nascem perto das suas fontes e são moduladas por proximidade seriam co-moduladas mecanicamente, e isso produziria comunidades por construção — justamente o tipo de resultado que a V0.19 quer medir (reutilização).
3. **O que reservar agora, para não sofrer depois:**
   - as posições 3D (já decididas): a difusão entra sem refazer nada;
   - a força de aprendizado das regras (do ramo, da Ustr, da Utad) escrita como **parâmetro**, hoje constante, que um neuromodulador poderá escalar depois;
   - nada no código pode supor que a plasticidade é sempre igual em todo lugar.

## 3. Recomendação [A]

1. Neurotransmissor como entidade: **fora** (mantém a decisão da V0.18).
2. Detector de coincidência no ramo (rastro + disparo que volta + comparação local): **entra já**.
3. Neuromoduladores: **depois**, com os ganchos reservados.

## Referências

- Bi, G.-Q., e Poo, M.-M. (1998). Synaptic modifications in cultured hippocampal neurons: dependence on spike timing, synaptic strength, and postsynaptic cell type. *J Neurosci* 18(24), 10464–10472. doi:10.1523/JNEUROSCI.18-24-10464.1998.
- de Villers-Sidani, E., Chang, E. F., Bao, S., e Merzenich, M. M. (2007). Critical period window for spectral tuning defined in the primary auditory cortex (A1) in the rat. *J Neurosci* 27(1), 180–189.
- Feldman, D. E. (2012). The spike-timing dependence of plasticity. *Neuron* 75(4), 556–571. doi:10.1016/j.neuron.2012.08.001.
- Kilgard, M. P., e Merzenich, M. M. (1998). Cortical map reorganization enabled by nucleus basalis activity. *Science* 279(5357), 1714–1718.
- Zhang, L. I., Bao, S., e Merzenich, M. M. (2001). Persistent and specific influences of early acoustic environments on primary auditory cortex. *Nat Neurosci* 4(11), 1123–1130.
