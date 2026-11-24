# V0.19 — Pacote de números para aprovação em bloco

Data: 24/11/2026. Redação: assistente (Claude). Pedido do responsável (24/11): números da Uint, regra do ramo, Ustr, Utad e textos das simplificações num pacote só.

**Como ler:** [L] literatura (grau de leitura e confiança indicados); [A] proposta do assistente; [V17]/[V18] número já usado ou decidido nas versões anteriores (a V0.18 não muda; da V0.17 passam só parâmetros). Nada aqui está aprovado.

## 1. Uint

| Parâmetro | Proposta | Base | Confiança |
|---|---|---|---|
| Janela de integração, componente rápida | **0,3 ms** | [V17] janela retangular de 0,30 ms (MSO); [L] correntes excitatórias nas células em arbusto com meia-largura de ~0,5 ms (estreladas e polvo: 0,8–0,9 ms) (PMC3350034, resumo); decaimento das correntes miniatura 0,35–0,40 ms (PMC6782765, resumo) | média |
| Janela de integração, componente lenta | **0,9 ms** (o triplo da rápida) | [L] neurônios jovens com janela de soma ~2× mais longa (Scott, Mathews e Golding 2005, citado no encerramento da V0.17); estreladas e polvo 0,8–0,9 ms | baixa (a forma "rápida + lenta" é decisão anterior; o valor da lenta é proposta) |
| Limiar | **1,5** (em unidades de força) | [V17]; [L] no jovem são precisas ~4,6 fibras juntas (Kladisios, Fischer e Felmy 2020, citado na V0.17) | média |
| Tempo mínimo entre a chegada e o disparo (inclui o atraso sináptico) | **0,6 ms** | [L] atraso sináptico mínimo ~0,4 ms a 36 °C (cálice de Held); [A] + ~0,2 ms de subida até o limiar | média para os 0,4 ms; baixa para a soma |
| Janela de refratariedade | **0,5 ms** | [V18] Upro com 0,39 ms ± 50% (humano); [A] para a Uint, não achei medida direta de refratariedade de neurônio do núcleo coclear nesta busca | baixa |
| Reserva de efeito das Upros que saem de Uints | **a mesma da V18** (começa em 1; ~35–40% de queda a 100/s; carregamento ~25 ms, dispersão ~2 s) | [V18] (bulbo de Held, camundongo adulto) | alta (já decidido para Upro) |
| Parâmetros iguais para todas as Uints? | **Sim, um conjunto só** na V0.19 | [A] o tipo emerge do que converge; variar parâmetros por tipo exigiria saber o tipo antes | — (decisão sua) |

## 2. Regra do ramo (promoção e punição)

| Parâmetro | Proposta | Base | Confiança |
|---|---|---|---|
| **Promoção** | o ramo cuja chegada cai na janela de integração do disparo da Uint **participa** e ganha força | [V17] regra de participação (aprovada em 17/11); [L] sincronia com o disparo da célula decide (junção neuromuscular, cerebelo; ver V0.17) | média |
| **Punição** | o ramo que chega **depois** do disparo perde uma **fração da própria força** | [V17] forma biológica que não mata o sistema (medido); [L] Bi e Poo 1998: depressão quando o disparo pós precede a chegada, proporcional à força | alta para a forma |
| Janelas no tempo | **promoção: até 0,9 ms antes do disparo** (a janela de integração); **punição: até ~34 ms depois** | [L] Bi e Poo 1998 (hipocampo em cultura): janelas de ~17 ± 9 ms (potenciação) e ~34 ± 13 ms (depressão) | ver conflito abaixo |
| Pares necessários | **60** | [L] 60–100 pares (Feldman 2012; Bi e Poo 1998: 60 pares a 1 Hz) | média |
| Eliminação por não participar | **após N = 1.000 disparos da Uint** sem participar | [V17] N ∈ {100, 1000}; N não tem número na literatura lida | baixa |

**Conflito que precisa da sua decisão:** em 23/11 adotamos as janelas de Bi e Poo (~20 ms antes, 20–100 ms depois). A investigação da V0.17 (`investigacao-divisao-forca.md`) avisou: **não há curva de plasticidade dependente do tempo medida no tronco auditivo**, e as janelas corticais (~20 ms) são 60 vezes maiores que a janela de integração dessas células (0,3 ms). Com uma janela de promoção de 20 ms, quase toda chegada do mesmo ciclo seria promovida. A proposta acima usa a janela de integração para promover (como na V0.17) e mantém a de Bi e Poo só para punir.

## 3. Ustr

| Parâmetro | Proposta | Base | Confiança |
|---|---|---|---|
| Território | os cubos mais próximos dela (partição por proximidade); ~4 pontos transdutivos no início | [R 22–23/11] ~1 por 4 pontos; [L] Halassa et al. 2007: um astrócito envolve ~4 somas; CA1: ~14 neurônios piramidais por domínio, amígdala ~5 (PMC7612014, resumo) | média |
| Sobreposição | **zero** na condição "sem relações"; **leve** (os cubos da fronteira são compartilhados) na condição "com relações" | [R 24/11, proposta registrada]; [L] domínios levemente sobrepostos | — |
| Duração do rastro de um fracasso | **até a sessão seguinte** (decai ao longo do intervalo entre sessões) | [A] exigência da decisão de 24/11: guiar o crescimento entre sessões. Sem medida na literatura lida | baixa (decisão sua) |
| Passo de crescimento | **1 cubo a cada ~34 min** de tempo estrutural (35 µm/h) | [L] 35 ± 19 µm/h (média; picos de 200 µm/h) | média |
| Candidatas por coincidência | **3** (atrasos −10%, igual, +10%) | [V17] cópias com atraso 10% maior ou menor | baixa |
| Capacidade antes de se dividir | **fracassos registrados por hora** acima de um teto a calibrar no primeiro ensaio | [A] sem número na literatura | baixa |
| Janela permissiva | os **primeiros dias simulados** do calendário; duração a fixar no calendário (item 10) | [L] período crítico do córtex auditivo de rato em P11–P13 (de Villers-Sidani et al. 2007, citado nesta versão) | baixa para a transposição |
| Da marca à remoção | **1–4 dias** de tempo estrutural | [R 23/11] regra aprovada | — |

## 4. Utad

| Parâmetro | Proposta | Base | Confiança |
|---|---|---|---|
| Faixa de velocidade | **de 0,3 m/s (basal) até ~25 m/s** | [R 24/11] basal; [L] nervo auditivo do gato ~25 m/s, medido e calculado pelo diâmetro (JASA 1962, 34(1):99, resumo) | média |
| Regra | excesso inicial; estabiliza nas Upros usadas; a janela fecha | [R 23/11] (Hines et al. 2015, texto integral) | — |
| Ganho por uso | a velocidade sobe em degraus nas Upros que participam, até o teto | [A] | baixa |
| Duração da janela | a mesma janela permissiva da Ustr | [A] | baixa |

## 5. Textos das simplificações a declarar (rascunho)

1. **Construção determinística:** a única fonte de variação é o mundo (Mainen e Sejnowski 1995).
2. **Atraso sináptico dentro do tempo de integração da Uint** (24/11): perde o aumento do atraso com a atividade sustentada.
3. **Astrócito e micróglia juntos na Ustr:** no cérebro, quem cria (astrócitos) chega antes de quem poda (micróglia).
4. **Constante glial do córtex de camundongo** (~1 por 4 somas) aplicada à via auditiva.
5. **Efeito por Upro, com todos os ramos iguais.**
6. **Proporção de neurônios inibitórios (20%) aplicada a Upros.**
7. **Mesmo tipo, mesma organização** (laços em vez de níveis repetidos).
8. **Faixa desenrolada:** perde a vizinhança entre voltas da espiral.
9. **Glias já espalhadas no instante zero:** no cérebro, elas entram pelas bordas e se espalham.
10. **Sdom nasce vazio:** no cérebro, o primeiro esqueleto tonotópico é montado por pistas moleculares, antes do som; aqui, a vizinhança vem da borda ordenada e do crescimento por proximidade.
11. **Crescimento em tempo estrutural simulado** entre sessões.
12. **Um só conjunto de parâmetros para todas as Uints** (se aprovado).
