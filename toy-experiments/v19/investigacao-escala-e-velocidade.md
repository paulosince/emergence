# Investigação: tamanho do cubo, velocidade basal e atraso sináptico (V0.19)

Data: 23/11/2026. Item 1 da ordem de "o-que-falta-para-implementar.md".

Decidido pelo responsável [R 23/11]: o espaço do Sdom é dividido em cubos iguais; a velocidade basal é a da Upro sem mielina, antes da Utad, em cubos por unidade de tempo, escolhida para aproximar o modelo neurobiológico. Este documento reúne o que o modelo neurobiológico oferece para escolher o tamanho real do cubo e a velocidade basal.

## 1. Velocidade em axônios sem mielina [L]

| Achado | Fonte | O que foi lido | Confiança |
|---|---|---|---|
| Fibras musgosas, colaterais de Schaffer e fibras do estrato oriente: 0,36–0,38 m/s; álveo 1,20 m/s; via perfurante medial 0,32 ± 0,02 m/s, lateral 1,36 ± 0,14 m/s (fatias, in vitro) | Exp Brain Res, doi:10.1007/BF00236913 (**autores e ano a conferir**) | resumo | alta para os números do resumo |
| Compilação no hipocampo: 0,48 ± 0,10 (Miles et al. 1988); 0,3–0,4 (Meeks e Mennerick 2007); 0,54 ± 0,14 (Jensen 2008); 0,31 ± 0,08 m/s (Kibler e Durand 2011) | J Neurosci 2014, 34(4):1409–1419, doi:10.1523/JNEUROSCI.3877-13.2014, Tabela 3 | a tabela | alta para a tabela; fontes primárias não lidas |
| Colaterais de Schaffer: latência cresce 4,16 ± 0,06 ms por mm, a 22–25 °C (equivale a ~0,24 m/s) | Soleng, Raastad e Andersen (2003), registro no scite | trecho do resumo | média (a conversão para m/s é nossa; temperatura ambiente) |
| "Nos axônios sem mielina do hipocampo, a velocidade é de 0,25 m/s" | Gerstner et al., *Neuronal Dynamics*, cap. 3.3 (livro-texto) | trecho | média (fonte secundária, sem a primária indicada) |
| Segmentos finos entre botões, diâmetro médio de 0,17 µm | citado em Soleng et al. 2004 (Shepherd e Harris 1998) | trecho | média |
| Nos axônios sem mielina, a velocidade depende crucialmente do diâmetro, que varia ao longo do mesmo axônio | PMC5307438 (2017) | resumo | alta |

**Ressalvas:**
1. São axônios do hipocampo, não da via auditiva. Na via auditiva madura, as fibras são mielinizadas. A velocidade sem mielina representa o estado antes da Utad (como no desenvolvimento), o que combina com a decisão.
2. Parte das medidas é in vitro à temperatura ambiente. A ~0,24 m/s de Soleng é a 22–25 °C; à temperatura do corpo, a velocidade tende a ser maior.

**Faixa defensável para a velocidade basal:** ~0,25 a ~0,5 m/s, com ~0,3–0,4 m/s no centro das medidas em fatias [A].

## 2. Escalas naturais para o cubo [L]

| Achado | Fonte | O que foi lido | Confiança |
|---|---|---|---|
| Soma dos neurônios do núcleo coclear anteroventral (camundongo): ~18–25 µm | BioNumbers 111420, citando estudo de neuroglobina | trecho (secundária) | média |
| Córtex do camundongo: 9,2 × 10⁴ neurônios por mm³ e 7,2 × 10⁸ sinapses por mm³; corpos celulares de neurônios e glias ocupam 12% do volume | Schüz e Palm (1989), J Comp Neurol 286(4):442–455, doi:10.1002/cne.902860404 | resumo | alta |
| Mesma ordem: ~9 × 10⁴ neurônios e 4 km de "fiação" local sem mielina por mm³ (diâmetro médio 0,3 µm) | BioNumbers 109245 (secundária) | trecho | média |

**Conta nossa [A]:** 1 mm³ ÷ 92.000 neurônios ≈ 10.900 µm³ por neurônio; a aresta de um cubo com esse volume é de ≈ 22 µm. Ou seja, a distância média entre neurônios vizinhos é da mesma ordem do diâmetro do soma (~20 µm). Confiança: alta na conta; média na transposição do córtex do camundongo para o nosso caso (não há contagem do núcleo coclear nesta pesquisa).

## 3. Atraso sináptico [L]

| Achado | Fonte | O que foi lido | Confiança |
|---|---|---|---|
| Cálice de Held (rato, fatia): atraso sináptico mínimo ~0,4 ms a 36 °C e 0,9 ms a 23–24 °C | J Physiol, PMC1156851 (Borst, Helmchen e Sakmann 1995; **autoria a conferir**) | resumo | alta para os números |
| Em atividade sustentada, o atraso das sinapses químicas cresce na faixa de centenas de microssegundos | PNAS 2017, 114(24):E4851, doi:10.1073/pnas.1702290114 | resumo | alta |
| Em gerbos, nos axônios rápidos das frequências graves, o atraso sináptico fica constante com a atividade; em camundongos, varia | idem | resumo e legenda da Fig. 1 | alta |

O atraso sináptico não depende da mielina: é o tempo entre a chegada do disparo ao terminal e a resposta da unidade que recebe.

## 4. Opções para o tamanho do cubo [A]

| Opção | Cubo | Tempo por cubo a 0,3 m/s | O que ganha | O que perde |
|---|---|---|---|---|
| a | ~20 µm (um soma ou a distância média entre vizinhos) | ~67 µs | Uma unidade ocupa ~1 cubo; território, vizinhança e "perto" ficam naturais; custo contido | Percursos de Upro em degraus de 20 µm |
| b | ~1–2 µm (escala de dendritos e botões) | ~3–7 µs | Percursos e ramos detalhados | Uma unidade ocupa milhares de cubos; custo muito maior |
| c | ~100 µm (escala de grupos ou colunas) | ~330 µs | Muito barato | "Perto" perde o sentido local; várias unidades por cubo |

Conta de conferência [A]: atravessar 1 mm sem mielina a 0,3 m/s leva ~3,3 ms. É mais do que o intervalo humano entre estações (~2 ms, incluindo sinapse), o que é esperado sem a Utad. A conferência com as ondas do potencial evocado de tronco encefálico só faz sentido depois da Utad.
