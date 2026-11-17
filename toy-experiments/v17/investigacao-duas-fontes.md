# V0.17 — Investigação: duas fontes ao mesmo tempo e a diversidade de entradas (degrau 2)

**Pedido do responsável (17/11):** depois do degrau 2 (grave 7/30), "Os dois": diagnosticar e pesquisar o NB em paralelo.
**Redação:** assistente (Claude), 17/11/2026. Diagnóstico em [resultados](ensaio-minimo/resultados.md) (degrau 2 e diagnóstico).
**Legenda:** [L] literatura; [I] inferência; [A] proposta (a aprovar).

## 1. O problema, em uma frase
Cada relação, sozinha, é encontrada (controle 30/30). Com as duas, as 8 Uints se decidem **juntas, no episódio 1**, pela relação que ganhou os primeiros quase-acertos, porque **todas** recebem das **mesmas duas fibras** e das **mesmas Upros**.

## 2. O que a biologia tem e nós não temos [L]
1. **Muitas fibras por ouvido e por faixa, cada uma com seu ruído.** Cerca de 10 fibras do nervo auditivo por célula ciliada interna (cochlea.eu, Huet & Bourien; página de divulgação dos autores). No gerbil, as fibras de **baixa frequência** são quase todas de **alta atividade espontânea** (> 18/s por definição; Huet et al. 2016, *Hear Res*, resumo; a mediana não foi lida). Cada fibra dispara com seu próprio acaso.
2. **Cada célula da MSO amostra poucas entradas, e cada célula, as suas.**
   - Bastam 2–4 fibras excitatórias por dendrito para disparar, de pelo menos 4–8 no total; 2–3 inibitórias (Couchman et al. 2010, texto integral).
   - As células esféricas recebem ≤ 3 fibras do nervo (quase sempre 2, no camundongo; investigação da convergência, Cao & Oertel 2010, só resumo).
   - Os axônios esféricos dão vários colaterais na MSO e cobrem 40–60% da extensão do núcleo (gato; Karino et al. 2011, ver investigação da arborização terminal).
   - [I] Células vizinhas compartilham parte das entradas, mas **não todas**: cada uma tem uma mistura própria.
3. **Ruído de fundo forte e independente.** ~900 eventos espontâneos por segundo chegam à célula da MSO in vivo (van der Heijden et al. 2013, texto integral); ver [ruído na MSO](investigacao-ruido-mso.md).
4. **Separar fontes simultâneas é trabalho da população, não de uma célula.** No colículo inferior (coelho acordado), a atividade média de uma população não localiza bem, mas o **padrão** de atividade de muitos neurônios distingue duas fontes simultâneas de uma só, em parte pela **descorrelação** entre os ouvidos que a segunda fonte causa. (Repositório do MIT, "Decoding sound source location and separation using neural population activity patterns"; **só resumo**; autoria não conferida na página, lembro ser Day & Delgutte 2013, confiança média.) Com um interferente, os neurônios do colículo perdem parte da sintonia, mas a maioria continua sensível (PMC3545175, resumo).

## 3. Hipótese [I]
O que faltou no degrau 2 é **diversidade de entrada**: na biologia, cada Uint receberia de um **subconjunto próprio** de fibras de cada ouvido, cada uma com **atividade espontânea e tremor independentes**. Então os primeiros quase-acertos não seriam os mesmos para todas as Uints, e as relações poderiam se dividir entre elas. Isso também liga o degrau 2 à decisão de hoje sobre o disparo: a **atividade espontânea nas fibras** vira a fonte do ruído **e** da diversidade.

## 4. Proposta para discutir [A] (cada item é decisão do responsável)
1. **Várias fibras por ouvido e por faixa** (por exemplo, 4), todas recebendo as mesmas incidências do mundo, cada uma com **tremor próprio** e **atividade espontânea própria**.
2. **Cada Uint recebe de um subconjunto** delas (2–4 por lado, como na MSO). As Upros nascem em fibras, e os ramos chegam só às Uints que aquela fibra alcança.
3. **Limiar duro** na Uint (sem sorteio). A curva de chance vira consequência do ruído de fundo.
4. **Taxa espontânea**: mapear numa faixa de fibras de alta atividade espontânea (por exemplo, 20, 50 e 100/s), até achar o número do gerbil.
5. Ensaio: repetir o degrau 1 (uma relação) e o degrau 2 (duas) com isso, em sementes novas. O degrau 1 é a garantia de que o que já funcionava continua funcionando.

**Riscos [I]:** mais incidências, ou seja, mais custo (a fila por cursor ajuda); a Pcrt também vê as incidências espontâneas e pode criar Upros por acaso (o que é uma previsão testável); e a mudança é grande: mexe no "dado" (quantas fibras e quem alcança quem).

## 5. Fontes
- [Couchman, Grothe & Felmy 2010 (CORE)](https://core.ac.uk/download/12174948.pdf) — texto integral.
- [van der Heijden et al. 2013 (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC3741096) — texto integral.
- [Huet et al. 2016, Hear Res (resumo)](https://www.bohrium.com/paper-details/sound-coding-in-the-auditory-nerve-of-gerbils/814519254534586368-5767) — resumo.
- [Spiral ganglion neurons: physiology (cochlea.eu)](https://www.cochlea.eu/en/spiral-ganglion/spiral-ganglion-neurons-physiology/) — página de divulgação.
- [Decoding sound source location and separation… (MIT)](https://dspace.mit.edu/entities/publication/2bd808b9-a2ce-4692-8489-38afb5a3d1d7) — resumo.
- [Interferente e sintonia no colículo inferior (PMC3545175)](https://pmc.ncbi.nlm.nih.gov/articles/PMC3545175) — resumo.
- Karino et al. 2011 e Cao & Oertel 2010: já lidos nas investigações da arborização terminal e da convergência.
- Pré-audição (segunda camada, para depois da V0.17): antes de ouvir, a cóclea gera surtos espontâneos sincronizados entre células ciliadas vizinhas, que ajudam a refinar os mapas tonotópicos e somem logo depois do início da audição (Tritsch et al. 2007, *Nature* 450:50, resumo).
