# V0.17 — Investigação: competição quando várias fibras disputam a mesma Uint (antes dos passos 2 + 3)

**Pedido do responsável (17/11, noite):** "Investigar antes" — antes de rodar os passos 2 + 3, porque o teste curto com 8 fibras colapsou: a eliminação competitiva cortou a maior parte dos ramos.
**Redação:** assistente (Claude), 17/11/2026.
**Legenda:** [L] literatura; [C] leitura do código; [I] inferência; [A] proposta (a aprovar).

## 1. Achado no código [C] — erro meu, que vale para todos os ensaios desde a correção 2
- A eliminação competitiva (correção 2) diz: um ramo com força < θ × a do mais forte do mesmo lado da Uint, por **TEL = 60 s contínuos**, é eliminado.
- O relógio usa o **tempo absoluto**. Os episódios duram 10 s, e entre um e outro passam 170 s **sem mundo**.
- Consequência:
  - nenhum ramo consegue ficar 60 s abaixo de θ **dentro** de um episódio (10 s);
  - toda eliminação acontece **pelo intervalo**: o ramo que termina um episódio abaixo de θ e ainda está abaixo na primeira verificação do episódio seguinte é eliminado;
  - na prática, a eliminação é uma decisão tomada **na virada de cada episódio**, contando o tempo em que **não houve experiência**.
- Evidência direta: no teste curto (8 fibras, episódios de 0,2 s), houve 366 eliminações. Nenhuma poderia ter vindo de 60 s de atividade.
- Vale para todos os ensaios com a correção 2 (confirmação, fase, maturação, replicação, degraus, passos). Os resultados continuam válidos como medidos, mas o mecanismo **não era** o descrito no registro. Errata registrada em [resultados](ensaio-minimo/resultados.md).

## 2. O que a biologia diz sobre competição com várias entradas [L]
1. **A eliminação depende de atividade e é relativa.** Entradas menos ativas recuam, e a vencedora se expande (junção neuromuscular). A magnitude **relativa** das entradas importa, e a eliminação é um processo ativo, não só falta de estabilização. (Prévia do bioRxiv 118646 e revisão em *Front Neural Circuits* 2025; resumos e trechos.)
2. **Nem sempre fica uma só.**
   - No tálamo visual (camundongo), cada célula começa com **mais de 20** entradas da retina, e **todas menos 1 a 3** são eliminadas em ~3 semanas, perto da abertura dos olhos. As que ficam se fortalecem **~50×**. (Chen & Regehr 2000, *Neuron*, resumo indexado.)
   - No adulto, ~3 entradas por célula, **todas do mesmo olho**. (PDF de revisão, CSIC; trechos.)
   - [I] **Entradas correlacionadas sobrevivem juntas**; competem as que disparam fora de sincronia.
3. **Na via auditiva:**
   - na LSO, as entradas do MNTB e do núcleo coclear diminuem em número e as restantes se fortalecem **antes** de ouvir (Kim & Kandler 2003; Case et al. 2011, citados em bioRxiv 2024.08.09; trechos);
   - na MSO, a força de uma única fibra excitatória **cresce** depois do início da audição: −1,07 nA (P11), −1,54 (P14), −1,89 (P17) (Franzen et al. 2020, *J Neurosci* 40:1689, **texto integral**); no adulto, ~2,5 nA (Couchman 2010). Os autores não contam quantas fibras ficam;
   - o refinamento das entradas inibitórias da MSO leva **~2 semanas** depois do início da audição (Werthat et al. 2008, resumo).
4. **Escala de tempo:** de dias a semanas, sempre **com atividade**.

## 3. Hipóteses para o colapso com 8 fibras [I]
1. **Relógio do intervalo** (seção 1): com mais ramos por lado, mais ramos ficam abaixo de θ no fim do episódio 1 e são cortados de uma vez na virada.
2. **Critério por força relativa, sem cooperação:** com 2–4 fibras por lado levando **a mesma relação do mundo**, os ramos certos de fibras diferentes são **cooperadores** (disparam juntos), mas o critério compara cada um com o **mais forte** do lado. Quem cresceu um pouco mais devagar é cortado, mesmo estando certo. Na biologia, entradas correlacionadas sobrevivem juntas.
3. **Estoque por lado** (correção 1): mais ramos dividem o mesmo recurso; cada um cresce mais devagar, e mais deles ficam abaixo de θ.

## 4. Propostas [A] (decisão do responsável)
1. **Relógio só com atividade:** TEL passa a contar o **tempo com mundo** (ou o número de incidências), e não o tempo de relógio. É correção de um erro meu, e o mecanismo fica como foi aprovado. Testar no modelo atual (1 fibra) antes, para ver o que muda.
2. **Critério de eliminação pelo NB:** em vez de "força < θ × a mais forte", eliminar o ramo que **não participa dos acertos** da Uint por um tempo com atividade. É a versão "dispara junto, fica junto": cooperadores sobrevivem e o acaso sai. É mecanismo novo; pesquisar a forma antes (ex.: regras de plasticidade ligada ao disparo e eliminação na junção neuromuscular e no tálamo).
3. Os passos 2 + 3 só depois disso.

## 5. Fontes
- [Franzen et al. 2020, J Neurosci (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC7046326/) — texto integral (extração).
- [Chen & Regehr 2000 (resumo indexado)](https://peeref.com/works/74372834).
- [Organotypic model of synaptic competition (bioRxiv 118646)](https://www.biorxiv.org/content/10.1101/118646.full.pdf) — trechos.
- [Revisão: eliminação sináptica nas células mitrais (Front Neural Circuits 2025)](https://frontiersin.org/journals/neural-circuits/articles/10.3389/fncir.2025.1541926/pdf) — trechos.
- [Revisão CSIC (tálamo)](https://digital.csic.es/bitstream/10261/307900/1/flowerthalamus.pdf) — trechos.
- [Ultraestrutura das entradas imaturas da LSO (bioRxiv 2024)](https://www.biorxiv.org/content/10.1101/2024.08.09.606139v1.full) — trechos.
- [Werthat et al. 2008 (PubMed)](https://pubmed.ncbi.nlm.nih.gov/18777566/) — resumo.
- Couchman et al. 2010 — já lido (texto integral).
