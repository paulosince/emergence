# Investigação: como os axônios crescem e encontram alvos (V0.19, item 1)

Data: 24/11/2026. Base para a regra de crescimento da Upro sem destino e de criação da Uint.

## 1. Na via auditiva, o primeiro mapa vem antes da atividade [L]

| Achado | Fonte | O que foi lido | Confiança |
|---|---|---|---|
| Projeções da cóclea basal ao núcleo coclear já tonotópicas em recém-nascidos (gato), dias antes da audição e antes da atividade espontânea do nervo | PMC2386504 | resumo | alta |
| Circuitos auditivos primários do tronco montados com alta precisão tonotópica cedo, com pouca evidência de refinamento depois; a organização existe antes da atividade sináptica | PMC2780022 (revisão) | trechos | alta |
| Mapa coclear projetado nos núcleos antes da diferenciação das células ciliadas e dos neurônios do núcleo; projeções discretas pelo menos 2 semanas antes da audição e 1 semana antes da atividade aferente, indicando pistas moleculares | Elliott et al. 2017 (PMC5389974) | resumo | alta |
| Mesmo sem as células-alvo diferenciadas, há segregação e alguma organização base–ápice; a ordem de chegada no tempo, somada a pistas, pode gerar um mapa grosseiro | idem, Front Neural Circuits 2017 | resumo e introdução | alta |
| Axônios do gânglio coclear organizados topograficamente no tronco já em E15.5 (camundongo), com o núcleo coclear ainda imaturo | Koundakjian et al. 2007, J Neurosci 27(51):14078 | resumo | alta |
| A maioria dos neurônios do núcleo coclear nasce entre E10.5 e E13.5 (pico em E12.5), ou seja, **antes** de os axônios chegarem; segunda onda no núcleo dorsal (E14.5–E18.5) | PMC7137671 | resumo | alta |
| **Neurônios novos nascem no núcleo coclear no período crítico pós-natal**, e os progenitores dependem da entrada aferente (a remoção da cóclea os reduz) | PNAS 2013, 110(35):14456 | resumo | alta |

## 2. Atividade: regula ramificação e poda, não o trajeto inicial [L]

| Achado | Fonte | O que foi lido | Confiança |
|---|---|---|---|
| A atividade espontânea é crítica para ramificar e podar **depois** que os cones de crescimento chegam à posição topográfica certa; a trajetória pode ser mudada sem atividade | PMC3831575 | resumo | alta |
| Crescimento do eixo e das ramificações são regulados separadamente; transientes locais de cálcio regulam a competição entre axônios e ramos | PMC2474798 | resumo | alta |
| Bursts de atividade elétrica fazem o cone de crescimento parar (entrada de cálcio) | J Neurosci 2007, 27(29):7684 | resumo | alta |
| Silenciar só um neurônio causa erros de trajeto; silenciar todos, não: regra de **competição** por atividade | Plazas et al. 2013, PNAS 110(4):1524 | resumo | alta |

## 3. Velocidade de crescimento [L]

| Achado | Fonte | O que foi lido | Confiança |
|---|---|---|---|
| Cones de crescimento embrionários: média de 35 ± 19 µm/h | BMC Neurosci 2010, 11:140, Tabela 1 | tabela | média (condição e espécie não conferidas) |
| Picos de 200 µm/h ou mais, alternando com pausas | PMC6564855 | resumo | alta |
| O crescimento alterna avanço, pausa e retração | J Neurosci 2000, 20(10):3650, Tabela 2 | título da tabela | média |

**Conta [A]:** a 35 µm/h, 5 cm (meio caminho entre os ouvidos) levariam ~1.430 h, cerca de 60 dias. As sessões de escuta duram minutos.

## 4. Leitura para o Sdom [A]

1. **Divergência central:** no modelo neurobiológico, o primeiro esqueleto (nervo → núcleo coclear, tonotópico) é montado por pistas moleculares e ordem de chegada, com os alvos já nascidos, antes de qualquer som; a atividade refina. No programa, o Sdom nasce vazio e a construção vem dos fracassos de incidência (decisão do programa; violação da V0.17 se houver unidades no instante zero). Isso é uma divergência a declarar, não a desfazer.
2. **Equivalência possível:** a borda já é ordenada no espaço (24/11) e as unidades nascem perto das fontes (09/11). Crescimento por proximidade a partir de uma borda ordenada preserva a vizinhança, que é o que as pistas moleculares e a ordem de chegada garantem no cérebro. Perde-se a precisão pré-programada.
3. **Precedente parcial:** neurogênese no núcleo coclear dependente da entrada aferente no período crítico (PNAS 2013).
4. **Atividade:** no cérebro, a atividade decide ramificar e podar, e a competição entre vizinhos conta; isso combina com a Ustr (marca e remove) e com a regra do ramo.
5. **Tempo:** crescer até o meio leva semanas no ritmo biológico. O crescimento precisa de um tempo estrutural próprio (simulado entre sessões) ou de uma compressão declarada.
