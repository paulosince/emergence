# Investigação: disposição inicial das glias e distância entre os ouvidos (V0.19)

Data: 24/11/2026. Item 2 da ordem de "o-que-falta-para-implementar.md", perguntas 4 e 5 (o responsável pediu pesquisa).

## 1. Como as glias se distribuem [L]

| Achado | Fonte | O que foi lido | Confiança |
|---|---|---|---|
| Ladrilhamento ("tiling"): depois de especificadas, as células migram, ficam espalhadas por igual e formam domínios que não se sobrepõem aos das vizinhas | Revisão, Front Cell Neurosci 2022, doi:10.3389/fncel.2021.803057 | resumo e trechos | alta |
| No córtex e no hipocampo, os astrócitos migram, proliferam e definem os domínios **retirando aos poucos a sobreposição**; os domínios ficam levemente sobrepostos, o que permite controle exclusivo de "ilhas sinápticas" e comunicação entre astrócitos | Revisão, PMC8766310 | resumo | alta |
| Astrócitos do furão compartilham, em média, metade do território com outros; uma classe ("kissing") se sobrepõe bem menos | PMC5113791 | resumo | alta |
| Astrócitos imaturos estendem prolongamentos que se sobrepõem aos dos vizinhos e depois se refinam até domínios sem sobreposição, nas primeiras 4 semanas pós-natais (rato) | Bushong et al. 2002, J Neurosci 22(1):183–192, e revisão PMC9376008 | resumo e trechos | alta |
| Micróglia adulta em mosaico regular; no desenvolvimento, a distribuição passa de agrupada a aleatória; o número cresce com o cérebro até o mosaico se estabelecer | Cell Reports 42:112425 (2023) | resumo | alta |

## 2. Glias na via auditiva em desenvolvimento (camundongo) [L]

Fonte: Dinh, Koppel, Korn e Cramer (2014), Neuroscience 278:237–252, PMC4172487. **O que foi lido:** a página do artigo, resumida pela ferramenta de leitura; a ordem e as idades são confiáveis, e o artigo não traz contagens por idade.

| Glia | Quando aparece | Onde |
|---|---|---|
| Astrócitos (ALDH1L1) | Já abundantes ao nascer (P0) no núcleo coclear ventral | Mais fortes na borda ventral |
| Astrócitos (GFAP) | Esparsos ao nascer; sobem na 2.ª semana | Corpos fora dos núcleos; prolongamentos entram pela margem ventral |
| Oligodendrócitos (OLIG2) | Presentes desde o nascimento | Parte ventral do núcleo coclear e nervo auditivo; depois, por todo o núcleo |
| Micróglia (IBA1) | Esparsa ao nascer; muitas por volta de P14 | Mais densa na borda ventral do tronco em P0–P6 |

- Por volta do início da audição (~P14), todas as populações estão presentes.
- Revisão de Cramer e Rubel (2016, Front Neural Circuits 10:83; resumo): fatores de astrócitos que aparecem tarde promovem a formação de sinapses e a maturação dos dendritos; a micróglia surge cedo no tronco.

**Leitura [A]:** no modelo neurobiológico, as glias não começam espalhadas por igual. Elas entram pelas bordas da região e se espalham até ladrilhar. E a parte que cria (astrócitos) chega antes da parte que poda (micróglia, que tem pico perto do início da audição). Como a Ustr junta as duas, isso toca o calendário (item 10): a remoção começaria mais tarde que a criação.

## 3. Distância entre os ouvidos [L e A]

| Achado | Fonte | O que foi lido | Confiança |
|---|---|---|---|
| Tronco humano: ponte com ~15–24 mm de diâmetro anteroposterior; bulbo na junção pontobulbar ~13,5 mm (anteroposterior) | Morfometria por ressonância (Folia Morphol; AJNR 1985) | resumos | alta para os números; **não são a largura transversal** |
| Latência de condução dos axônios das células globulares até o núcleo do corpo trapezoide do outro lado (gerbo): a maioria abaixo de ~1,4 ms | PNAS 2017, 114(24):E4851, legenda da Fig. 1 | legenda | média (leitura indireta: "dois pontos fora acima de 1,4 ms") |
| MSO humana com extensão rostrocaudal de 3,8 a 6,4 mm | Resumo de apresentação (SUNY 2025; Farid et al. 2025, Brain Struct Funct) | resumo | média |

**Não encontrei** a distância transversal entre os dois núcleos cocleares humanos, nem a largura transversal do tronco nesse nível. Não invento o número.

**Conta da cena do robô [A]:** cabeça de 10 cm de diâmetro (V0.18, `cena.py`); pela fórmula de Woodworth, a maior diferença de tempo entre os ouvidos é (0,05 ÷ 343) × (π/2 + 1) ≈ 0,37 ms (na pessoa, ~0,6–0,7 ms, conhecimento padrão). Com 67 µs por cubo, 0,37 ms equivale a ~5–6 cubos de diferença de percurso. Confiança alta na conta.

**Consequência [A]:** a diferença de tempo que o Sdom precisa resolver é pequena perto de qualquer distância do tamanho de um tronco. A distância entre as faixas decide sobretudo o atraso absoluto de quem cruza e **se as Upros chegam a se encontrar**, o que depende da regra de crescimento (item 3). Ancorar a distância pelo tempo de cruzamento do gerbo contrariaria a decisão de 23/11 (os intervalos servem para conferir, não para calibrar).
