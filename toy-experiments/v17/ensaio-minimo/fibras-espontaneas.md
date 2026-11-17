# V0.17 — Registro prévio: degrau 1 com várias fibras por ouvido, alcance parcial e atividade espontânea

**Estado:** **RASCUNHO** — aguarda aprovação do responsável. Nada foi rodado; o motor ainda precisa ser adaptado.
**Redação:** assistente (Claude), 17/11/2026.
**Base:**
- decisões do responsável de 17/11 (16h40): 8 fibras por ouvido; alcance de 2–4 fibras por lado; atividade espontânea no lugar do sorteio; degrau 1 antes do degrau 2;
- [investigação das duas fontes](../investigacao-duas-fontes.md);
- [ruído na MSO](../investigacao-ruido-mso.md), seções 1 e 5.

**Ponto de partida:** conjunto B, inibição I1 (plano B), fila por cursor. A maturação **não** entra aqui.
**Legenda:** [R] decisão do responsável; [A] proposta do assistente (a aprovar); [L] literatura.

## 1. O que muda
1. **Fibras [R]:** **8 por ouvido** (16 no total) nesta faixa. Todas recebem as **mesmas incidências do mundo**, cada uma com **tremor próprio** (mesmo desvio de hoje, 0,02 ms, sorteado por fibra).
2. **Atividade espontânea:**
   - [R] cada fibra tem incidências espontâneas, independentes das outras e do mundo.
   - [A] Processo de Poisson com **60/s por fibra**, a média das células esféricas no gerbil (Kopp-Scheinpflug et al. 2002). Variante, se o responsável preferir: taxa sorteada por fibra da distribuição medida (média 60, desvio 44, mínimo 1).
3. **Alcance [R: 2–4; A: forma]:**
   - cada Uint sorteia, uma vez e no início, de **2 a 4 fibras de cada ouvido** (uniforme em {2, 3, 4}), sem repetir;
   - é um dado anatômico: não muda durante o ensaio.
4. **Upros [A]:**
   - nascem **numa fibra** e só mandam ramos às Uints que aquela fibra alcança;
   - os atrasos iniciais seguem a regra de hoje **por fibra** (6 Upros, de 0,5 a 20 ms);
   - a Pcrt cria Upros novas na mesma fibra da Upro que teve o quase-acerto (±10%, como hoje).
5. **Disparo [R]:** **limiar duro**: a Uint dispara quando V ≥ 1,5. Sai o sorteio.
6. **Pcrt [A]:** trata as incidências espontâneas como quaisquer outras; ela não sabe de onde vem a incidência, como na biologia.
7. **A Uint compara lados [A]:** a coincidência continua sendo entre os **dois ouvidos** (lado A × lado B), seja qual for a fibra de cada lado.

## 2. Mundo e sementes
- Degrau 1: uma relação, Δ = 0,458 ms; grave e agudo; notas como antes.
- **Sementes 131–160** (30, novas).
- **Condições:** (a) com atividade espontânea; (b) sem atividade espontânea (taxa 0), mesmas sementes, para separar o efeito das fibras múltiplas do efeito do ruído. Com limiar duro e sem ruído, a previsão é que (b) volte ao problema antigo do "ovo e da galinha".
- Total: 2 condições × 2 faixas × 30 = **120 execuções**.
- Custo estimado: as chegadas crescem com o número de fibras; agudo ~30–60 s por execução, total ~30–60 min nos 2 núcleos. Confiança baixa.

## 3. Medidas
- As da replicação: seleção no grave; seleção em fase no agudo; Uints sintonizadas e presas.
- Disparos espontâneos das Uints em silêncio (um trecho sem mundo no fim de cada episódio, 2 s). Na MSO, a mediana é 0,4/s (van der Heijden 2013).
- Upros criadas por episódio (para ver se a atividade espontânea faz a Pcrt criar à toa).
- Diversidade entre Uints: quantas fibras de cada lado cada Uint tem e quais relações cada uma pegou.
- Custo: eventos por segundo simulado.

## 4. Leitura (fixada agora)
- **Passa** se, com atividade espontânea, o grave selecionar em **≥ 24 de 30** **e** o agudo selecionar em fase em **≥ 24 de 30**: segue para o degrau 2 com o mecanismo novo.
- 18–23 em alguma faixa: levar ao responsável com diagnóstico, sem ajustar. ≤ 17: parar e levar.
- A condição sem atividade espontânea é lida por comparação (sem critério).

## 5. Previsões [A]
1. Com atividade espontânea, o limiar duro funciona como a curva expansiva: disparos ocasionais perto do limiar, sem sorteio.
2. As Uints ficam diferentes entre si (cada uma com suas fibras), o que prepara o degrau 2.
3. **Risco:** a atividade espontânea faz a Pcrt criar Upros e ramos por acaso e aumenta as presas no acaso.
4. **Risco:** com só 2 fibras de um lado, algumas Uints recebem pouco e não se sintonizam.
