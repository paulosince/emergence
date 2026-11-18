# V0.17 — Investigação: a inibição da MSO para substituir o plano B

**Pedido do responsável (17–18/11):** "Pesquisar e propor": trocar a inibição do plano B (adaptação) pela da MSO, traduzindo a força (condutância e curto-circuito) para o potencial da Uint.
**Contexto:** o diagnóstico mostrou que a inibição do plano B, em janela retangular, derruba o agudo ([resultados](ensaio-minimo/resultados.md), participação e diagnóstico).
**Redação:** assistente (Claude), 18/11/2026.
**Legenda:** [L] literatura; [I] inferência; [A] proposta (a aprovar).

## 1. O que a MSO mostra [L]

| Propriedade | Valor | Fonte e leitura |
|---|---|---|
| Tempo | O IPSP **começa 0,32–0,38 ms antes** do EPSP do mesmo estímulo (faixa 0,15–0,54) | Roberts, Seeman & Golding 2013, texto integral (PDF do responsável), P15–20, 35 °C |
| Origem | Caminho próprio: MNTB (contralateral) e LNTB (ipsilateral), com uma sinapse e uma célula a mais, e mesmo assim chega antes | idem; Roberts et al. 2014 |
| Número de fibras | **2–3 fibras inibitórias** por célula da MSO (2,6 ± 0,6 recrutadas por ponto) | Couchman et al. 2010, texto integral |
| Força por fibra | Condutância **58 nS** (inibitória) contra **37 nS** (excitatória); no total, inibição ~150–180 nS contra excitação ~180–200 nS: **E:I ≈ 1:1 a 1,3:1** em condutância | idem |
| Efeito no potencial | Degraus de 0–100 nS de inibição dão **0–10 mV de hiperpolarização**; EPSPs de teste de 6–8 mV | Roberts 2013, *dynamic clamp* |
| Reversão | −90 mV, com repouso de −60 mV: a inibição puxa 30 mV para baixo; a excitação puxa ~60 mV para cima | Magnusson 2005; Roberts 2013 |
| Curto-circuito (shunt) | A inibição abre condutância, que encurta o EPSP (−18% de largura, só o shunt); a hiperpolarização sozinha alarga o EPSP (+42%); juntas, quase se cancelam (+8%), com ajuda dos canais Kv1 | Roberts 2013 |
| Efeito no disparo | A inibição que chega antes **reduz o pico** do EPSP e a chance de disparo e **estreita, sem deslocar**, a janela de coincidência | Roberts 2013 (resumo e resultados) |
| Duração | IPSP de ~2–4 ms na MSO madura; condutância decai em 1,5–1,8 ms; subida do IPSP ~1 ms (P20) | Roberts 2013 (introdução); Couchman 2010; Myoga et al. 2014; Magnusson 2005 |
| Plasticidade própria | Potenciação de longo prazo **inibitória** na MSO, dependente de disparo e de ativação sináptica; reforça entradas inibitórias **coativas com a excitação binaural**; só nas 2 primeiras semanas de audição | "Glycinergic inhibitory plasticity in binaural neurons", *Neuron* 2018 (trecho do PDF da Cell, lido em busca anterior; autoria **de memória, a conferir**: Winters & Golding) |

## 2. Como o plano B se compara [I]

| | MSO | Plano B |
|---|---|---|
| Tempo | 0,3 ms **antes** | uma janela (0,21 ms) **depois** |
| Duração | 2–4 ms, com subida de ~1 ms | 0,30 ms (exponencial ou retangular) |
| Força | da ordem da excitação; caminho próprio, com 2–3 fibras | −0,5 × a força de **cada ramo** (cópia do ramo) |
| Plasticidade | própria (iLTP com coatividade) | nenhuma; segue o ramo |

## 3. O problema da tradução [I]
- Na janela retangular, a força vale **por inteiro desde a chegada**. Na MSO, o IPSP **sobe devagar** (~1 ms) e dura 2–4 ms. Quando o EPSP (rápido, ~0,5 ms) chega 0,3 ms depois, o IPSP ainda está **subindo**.
- Se pusermos a inibição da MSO como janela retangular, com força igual à da excitação e 0,3 ms antes, **cada chegada excitatória seria anulada pela própria inibição**, e nada dispararia.
- Ou seja, a forma da inibição importa mais que a da excitação. A janela retangular serve bem a um evento curto e rápido (EPSP), mas **não** a um lento (IPSP).

## 4. Opções [A] (decisões do responsável)

**Opção A — inibição como caminho próprio (mais fiel ao NB)**
1. Cada Uint recebe **2–3 fibras inibitórias por lado** (dado, como as excitatórias).
2. Elas disparam com as incidências do **seu lado**, com latência fixa, de modo que chegam **0,3 ms antes** da excitação **direta** daquele lado.
3. Forma: **sobe** em ~1 ms e **dura** 2–4 ms (por exemplo, uma subida e uma descida lineares, ou duas janelas: uma rampa e um platô).
4. Força: própria, inicial da ordem da excitação de uma fibra; o número exige tradução de condutância em potencial.
5. Plasticidade própria (iLTP com coatividade) fica para **depois**: outro mecanismo.

**Ponto aberto da opção A:** os atrasos dos nossos caminhos excitatórios (Upros de 0,5 a 20 ms) são **muito maiores** que os internos da MSO (< 1 ms). "Chegar antes da excitação direta" precisa de uma referência. Proposta: antes da **chegada mais curta** daquele lado (a Upro de menor atraso), que é o análogo do caminho direto.

**Opção B — manter a inibição ligada a cada ramo (mais simples)**
- Mesma estrutura de hoje, trocando tempo (0,3 ms antes), duração (2–4 ms) e forma (subida lenta).
- **Perda declarada:** a inibição não tem caminho nem força próprios, e a cópia de cada ramo não existe na biologia.

**Em qualquer opção:** a força em unidades da Uint precisa de uma tradução. Proposta de partida [I], com confiança baixa:
- uma fibra excitatória da MSO leva ~1/3 do caminho até o limiar (Couchman 2010: 2,5 nA por fibra, ~8 nA para disparar);
- uma fibra inibitória hiperpolariza por volta de 5–6 mV (58 nS, pela relação de 0–100 nS → 0–10 mV de Roberts 2013), comparável ao EPSP de uma fibra (~4–5 mV, se o limiar fica ~15 mV acima do repouso, como em fatia).
- [I] Em unidades da Uint (limiar 1,5): excitação de uma fibra ~0,5, e inibição de uma fibra, no pico, **~0,5**.
- Essa conta mistura preparações e idades diferentes; serve de ponto de partida, a confirmar ou a mapear.

## 5. Fontes
- Roberts, Seeman & Golding 2013, *Neuron* 78:923 — texto integral (PDF enviado pelo responsável).
- Couchman, Grothe & Felmy 2010, *J Neurosci* 30:17111 — texto integral.
- Magnusson et al. 2005; Chirila et al. 2007 — texto integral.
- Myoga et al. 2014, *Nat Commun* 5:3790 — trechos.
- "Glycinergic inhibitory plasticity in binaural neurons", *Neuron* 2018 — trecho (PDF da Cell); autoria a conferir.
