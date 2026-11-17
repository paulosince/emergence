# V0.17 — Registro prévio: passos 2 + 3 juntos — 8 fibras por ouvido, alcance de 2 a 4 e atividade espontânea por fibra

**Estado:** **RASCUNHO** — aguarda aprovação do responsável.
**Redação:** assistente (Claude), 17/11/2026.
**Base:**
- decisões do responsável de 17/11:
  - passos 2 e 3 juntos; a atividade espontânea fica;
  - 8 fibras por ouvido; alcance de 2–4 por lado; 60/s fixo;
  - a força por fibra fica para depois, com pesquisa;
- resultados dos passos 1 e 2;
- [investigação das duas fontes](../investigacao-duas-fontes.md); [ruído na MSO](../investigacao-ruido-mso.md).
- Substitui o rascunho [fibras-espontaneas.md](fibras-espontaneas.md).

**Ponto de partida:** o passo 1 (limiar duro; janela retangular L_E = L_I = 0,30 ms), conjunto B, inibição I1, fila por cursor.
**Legenda:** [R] decisão do responsável; [A] proposta do assistente (a aprovar); [L] literatura.

## 1. O que muda
1. **Fibras [R]:** **8 por ouvido**. O mundo (ritmo e relação Δ) é o mesmo para todas as fibras de um ouvido; cada fibra tem **tremor próprio** (0,02 ms).
2. **Atividade espontânea [R]:** **60/s por fibra**, Poisson, independente entre fibras e do mundo; 2 s de silêncio no fim de cada episódio (como no passo 2).
3. **Alcance [R: 2–4; A: forma]:** cada Uint alcança de **2 a 4 fibras de cada ouvido** (sorteio uniforme, sem repetir, uma vez, por semente). É um dado anatômico.
4. **Upros [A]:**
   - pertencem a **uma fibra**: 6 Upros iniciais por fibra, de 0,5 a 20 ms, como hoje, só que por fibra;
   - os ramos vão só às Uints que a fibra alcança;
   - a Pcrt cria a Upro nova (±10%) na **mesma fibra** da Upro que teve o quase-acerto.
5. [A] A Uint continua comparando **ouvidos** (lado A × lado B), seja qual for a fibra. O estoque (correção 1) e a eliminação competitiva (correção 2) continuam **por lado** da Uint, agora disputados por ramos de várias fibras.
6. **Nada mais muda.** A força por ramo continua podendo chegar a 1,0, que é a pendência de pesquisa decidida hoje.

## 2. Verificação de engenharia (feita)
- Motor novo: `motor_fibras.py`. Com 1 fibra por ouvido, ele reproduz **exatamente** o motor atual nas três configurações (referência, passo 1, passo 2), em grave e agudo, semente 131.
- **Declaração:** um teste de funcionamento curto (semente 1, 2 s, agudo, fora do conjunto) com 8 fibras rodou sem erro. Terminou em **colapso** com zero disparos. A eliminação competitiva retirou a maioria dos ~290 ramos iniciais logo no segundo episódio.

## 3. Mundo, sementes, condições
- Degrau 1 (Δ = 0,458 ms), grave e agudo, notas. **Sementes 191–220** (30, novas).
- **Condições:**
  - (a) **passos 2 + 3** (julgada);
  - (b) 8 fibras **sem** espontânea;
  - (c) passo 2 (1 fibra com espontânea);
  - (d) passo 1 (1 fibra, sem espontânea).
- As condições (b), (c) e (d) servem para separar os efeitos; não têm critério.
- Total: 4 × 2 × 30 = **240 execuções**, ~20–40 min nos 2 núcleos. Confiança baixa.

## 4. Medidas
- Seleção no grave; seleção em fase no agudo; colapsos; disparos.
- Disparo no silêncio por Uint (MSO: 0,4/s).
- Ramos, Upros novas, eliminados; quantas fibras cada Uint alcança e qual relação pegou.

## 5. Leitura (fixada agora)
- **Passa** se (a) der grave **≥ 24/30 e** agudo em fase **≥ 24/30**: o mecanismo fica e seguimos para o degrau 2 (duas relações) com ele.
- 18–23 em alguma faixa: levar ao responsável com diagnóstico, sem ajustar. ≤ 17: parar e levar.

## 6. Previsões [A]
1. Com fibras individuais, cada incidência espontânea pesa menos em relação a uma coincidência do mundo, que chega por 2–4 fibras de cada lado ao mesmo tempo. O disparo no silêncio cai.
2. **Risco (visto no teste curto):** mais ramos por lado de cada Uint disputam o mesmo estoque, e a eliminação competitiva (força < 0,5 × a mais forte do lado) pode cortar quase todos cedo e levar ao colapso.
3. **Risco:** como uma fibra ainda pode chegar a força 1,0, um par de fibras fortes basta para disparar, e as outras ficam redundantes.
