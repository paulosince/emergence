# V0.17 — Investigação da D11c: de onde vem a repetição interna?

**Data:** 16/11/2026. **Estatuto:** investigação pelo método, **sem decisão**. Pedido do responsável: "Em ordem, faça as duas" (esta investigação e o ensaio mínimo).
**Legenda:** [R] responsável · [A] assistente · [L] literatura · [P] aprovado no programa.

## 1. A pergunta

O responsável decidiu (D11, D11a, D11b) que a repetição interna entra na V0.17, nos silêncios, repetindo **o que está em formação**, **na mesma velocidade**. Falta saber **o que produz** as incidências repetidas, sem guardar uma cópia da entrada que funcione como fita (*lookup*), o que o programa proíbe.

## 2. Hipóteses formuladas antes da busca [A]

- **R1 (estrutura):** a repetição nasce da própria estrutura já constituída: atividade espontânea percorre as ligações fortalecidas e refaz os padrões.
- **R2 (periferia):** atividade espontânea das Utrd basta para "repetir".
- **R3 (fita):** o sistema guarda a entrada e a toca de novo. Proibida pela regra de não substituição; listada só como contraste.

## 3. O que a literatura diz (resumos e trechos; nada em texto integral)

1. **No hipocampo, a repetição depende de estrutura recorrente aprendida.** Num modelo da área CA3, "the chain-like structure of recurrent excitatory interactions established during learning not only determines the content of replay, but is essential for the generation of the SWRs as well" (Ecker et al., 2022, *eLife* 11:e71850; resumo). Outro modelo mostra a repetição espontânea surgindo porque a plasticidade, durante a exploração, molda a conectividade recorrente (Theodoni et al., 2018, *eLife* 7:e37388; resumo).
2. **Córtex sensorial primário também "ecoa" a experiência recente.** Em córtex visual de rato, após a apresentação repetida de um estímulo, padrões parecidos com a resposta evocada aparecem com mais frequência nas ondas espontâneas (Han, Caporale e Dan, 2008, *Neuron* 60; resumo). Em V1, um clarão no início de um trajeto treinado evoca a sequência, e a velocidade da sequência recordada pode refletir a dinâmica interna da rede, não a velocidade original (Xu, Jiang, Poo e Dan, 2012, *Nat. Neurosci.* 15:449–455; resumo).
3. **Na audição e no canto.** No tentilhão-zebra, a atividade espontânea de neurônios motores durante o sono corresponde à atividade durante o canto (Dave e Margoliash, 2000, *Science*; resumo); a estrutura temporal dessa repetição é dada pela rede local de HVC e fica mais lenta quando HVC é resfriado (Elmaleh et al., 2021, *Neuron*; resumo). No rato, padrões do córtex auditivo precedem e predizem o conteúdo da repetição hipocampal durante o sono (Rothschild, Eban e Frank, 2017, *Nat. Neurosci.* 20:251–259; resumo).
4. **A periferia tem atividade espontânea própria.** Fibras do nervo auditivo disparam espontaneamente, em classes de taxa alta, média e baixa (por exemplo, > 18 disparos/s para as de taxa alta em cobaia; Gleich e Wilson, 1993, *Hear. Res.* 71:69–79; trecho). Não há indício, nas fontes lidas, de que essa atividade reproduza padrões aprendidos.

## 4. Reconstrução causal

| Elo | Biologia | Estatuto |
|---|---|---|
| 1 | Existe excitabilidade espontânea, sem entrada | [L] |
| 2 | A experiência fortalece ligações **entre** unidades (recorrentes ou em cadeia) | [L] |
| 3 | A atividade espontânea percorre essas ligações e reproduz a ordem aprendida | [L] modelos; [L] evidência em hipocampo, córtex e canto |
| 4 | O ritmo da repetição é o da rede, não necessariamente o da experiência | [L] (Xu et al., 2012; Elmaleh et al., 2021) |

## 5. Consequência para a V0.17 (dedução do assistente)

- **R1 exige ligações entre unidades.** Na V0.17, a estrutura de primeiro nível é só **via → ramos → Uint**. Uma Uint que dispara espontaneamente não tem para onde mandar a incidência. **Não há substrato para repetir** o que está em formação enquanto não houver relações **entre Uint**.
- **R2 não repete.** Disparos espontâneos independentes das vias produzem coincidências por acaso. Isso **testa** as candidatas com ruído, mas não reproduz o padrão de nenhuma experiência.
- **R3 é proibida.**

Opções para o responsável decidir:
1. **Repetição pela estrutura, com segundo nível** [A]: permitir que a mesma Pcrt crie relações entre Uint (recursão pela mesma regra [P]; já exploratória na V0.15) e dar às Uint em formação a propriedade de marca-passo (aprovada no programa: qualquer unidade pode tê-la [P]). A repetição só pode aparecer **depois** que houver relações entre Uint. Isso vira uma previsão testável: no começo, os silêncios não repetem nada.
2. **Adiar a repetição** para uma versão com segundo nível (revendo a D11).
3. **Atividade espontânea na periferia** como condição à parte, sabendo que não é repetição.

**Sobre a D11b (mesma velocidade):** a literatura sugere que o ritmo da repetição é o da rede (itens 2 e 3). Na opção 1, isso sai de graça: a repetição percorre os ramos com os atrasos que existem, e a velocidade é a da própria estrutura. É coerente com a D11b.

## 6. Bibliografia desta investigação

1. Dave, A. S., Margoliash, D. (2000). Song replay during sleep and computational rules for sensorimotor vocal learning. *Science*, 290, 812–816. **Resumo.** (páginas de memória; verificar)
2. Ecker, A. et al. (2022). Hippocampal sharp wave-ripples and the associated sequence replay emerge from structured synaptic interactions in a network model of area CA3. *eLife*, 11, e71850. **Resumo.**
3. Elmaleh, M. et al. (2021). Sleep replay reveals premotor circuit structure for a skilled behavior. *Neuron*. **Resumo.** (título de memória; verificar)
4. Gleich, O., Wilson, S. (1993). The diameters of guinea pig auditory nerve fibres: distribution and correlation with spontaneous rate. *Hear. Res.*, 71, 69–79. **Trecho.**
5. Han, F., Caporale, N., Dan, Y. (2008). Reverberation of recent visual experience in spontaneous cortical waves. *Neuron*, 60. **Resumo.**
6. Rothschild, G., Eban, E., Frank, L. M. (2017). A cortical–hippocampal–cortical loop of information processing during memory consolidation. *Nat. Neurosci.*, 20, 251–259. **Resumo.**
7. Theodoni, P. et al. (2018). Theta-modulation drives the emergence of connectivity patterns underlying replay in a network model of place cells. *eLife*, 7, e37388. **Resumo.**
8. Xu, S., Jiang, W., Poo, M.-M., Dan, Y. (2012). Activity recall in a visual cortical ensemble. *Nat. Neurosci.*, 15, 449–455. **Resumo.**
