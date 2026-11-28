# V0.19 — Pré-registro técnico: folha fixa (A) × profundidade local (B)

**Estado:** rascunho para supervisão. **Não é o "pra valer"** [R, 28/11: "não inicie o experimento ainda. Quero supervisionar tudo antes"].
**Origem:**
- recomendação da Clara (ChatGPT), em `parecer-metodologico-volume-e-divergencia.md`;
- definições do responsável (Paulo Rogério da Silva), em 28/11.

**Papéis [R, 28/11]:** Paulo supervisiona, orienta e decide. A ciência é dos três. A Clara guarda o método e cuida, com Paulo, da auditoria e do artigo. A Claudia (Claude) cuida da programação, da engenharia e da página.
**Marcas:** [R] responsável; [C] Clara; [E] escolha de engenharia da Claudia (a validar); [M] medido.

## 1. Pergunta [C, R]

Quando as oportunidades de entrada são as mesmas, a liberdade de constituir Uints em profundidade muda **quem consegue convergir e integrar**?

## 2. Condições [R]

| | A — folha fixa (novo controle, estritamente planar) | B — profundidade local |
|---|---|---|
| Folha | Em cada ouvido, o primeiro plano de cubos imediatamente atrás das pontas das Upros de entrada, rumo ao centro da cabeça. A coordenada é fixa durante todo o ensaio, inclusive para as Uints de gerações posteriores | a mesma |
| Caixa de busca da Uint candidata | Referência: o ponto médio dos dois emissores. Em cada eixo, de piso(ponto médio) − 3 a teto(ponto médio) + 3, inclusive | a mesma |
| Filtro de profundidade | só cubos da caixa **na folha** | cubos da caixa **na folha ou mais para dentro da cabeça**. A caixa acompanha cada novo par, então gerações sucessivas podem passar de 3 cubos de profundidade total |
| Sem cubo admissível | registra e encerra a tentativa, sem criar Uint | o mesmo |

**Iguais nas duas condições [R]:**
- a mesma projeção de entrada, com um ponto de chegada por Upro;
- as mesmas regras de território da Ustr, ocupação, reutilização de Uint, pontuação e desempate. O território da Ustr define quais incidências podem ser comparadas; a caixa define onde a Uint candidata pode ficar;
- nervo de **790 cubos**, ganho aditivo de **0,0065** por participação e redução de **1/60** da força corrente por chegada tardia elegível;
- o mesmo estímulo, o mesmo estado inicial e a mesma regra de crescimento das Upros.

**Diferença em relação ao ensaio histórico:** o ensaio histórico avançava de 1 a 3 cubos a partir do par emissor. A condição A é um controle novo.

## 3. Medidas

1. **Em B, três contagens separadas [R]:**
   - buscas que admitiram ao menos um cubo fora da folha (disponibilidade);
   - buscas que escolheram um cubo fora dela (escolha de posição);
   - Uints distintas constituídas fora da folha que chegaram a integrar, isto é, a disparar (consequência funcional).
   - Também se registram as buscas sem cubo admissível, nas duas condições.
2. **Origem dos encontros [C, item 2 do parecer]:** o motor guarda cada par (os dois emissores, a Uint e o instante de criação). Com isso, dá para separar:
   - os pares que já podiam se encontrar pela projeção inicial (dois pontos de entrada);
   - os que só passaram a poder se encontrar por meio de Uints constituídas (um ou dois membros são Uints).
   - Nos casos que diferirem entre A e B, a análise acompanha posição, parceiros, diferença de chegada, ramos e integração. **A análise é a definir** com a Clara.
3. **"Em sua maioria" [R]:** passagens por ramos que já existiam antes da apresentação, com o limiar de 2/3. Vale para o ensaio completo, não para este teste.
4. **Previsões:** a definir (Paulo e Clara). A Claudia não propõe previsões científicas.

## 4. Implementação [E] (para conferir)

- **Código:** `motor/sdom_ab.py` (motor) e `motor/teste_ab.py` (execução). O motor planar `sdom.py` não foi alterado.
- **Coordenada da folha:** x = ±(2.500 − 790 − 1) = ±1.709 cubos. As pontas das Upros estão em ±1.710.
- **Fato a declarar [E]:** as Ustr da zona de entrada ficam nesse mesmo plano, uma a cada bloco de 2 × 2 (cubos de y e z ímpares). Por isso, **1/4 dos cubos da folha estão ocupados por Ustr** nas duas condições, e nenhuma Uint pode ficar neles.
- **Território de uma Uint nova:** a Ustr mais próxima pelo bloco (y, z), como no ensaio histórico. Em B, uma Uint mais funda pertence à Ustr da mesma coluna (y, z). É a mesma regra nas duas condições.
- **Desempate:** a menor pontuação (|d₁ − d₂| × 1.000 + d₁ + d₂). No empate, vale o primeiro cubo na ordem x, y, z crescente (igual ao ensaio histórico).
- **Contadores novos:** "busca sem cubo admissível (sem Uint)", "busca com cubo admissível fora da folha" e "Uint escolhida fora da folha". O instante de criação de cada par fica em `p_t`.

## 5. Teste observável [R]

- **Pedido:** "Quero ver essas 'pontes' saindo de uma 'margem' indo de encontro à outra. Pode aumentar o teste para 1 min, 1,5."
- **Feito:** Alciatore de 0 a **90 s**, **ouvido esquerdo**, condições A e B.
- **Registros:** cada passo de crescimento dos ramos, o nascimento das Uints, a chegada dos ramos, os disparos e o crescimento das Upros do nervo.
- **Página:** mostra as duas condições lado a lado no tempo, com o mesmo tempo, os mesmos controles e a troca A/B.
- **Lembrete [E] sobre o ritmo do crescimento:** a regra vigente é **1 cubo a cada ~12 coincidências do par** (ramos) e **1 cubo a cada ~12 reacessos do ponto** (Upro do nervo). É a escolha de 27/11, a partir da teoria do responsável de 1 por coincidência e de Kwon e Sabatini 2011. Um ramo de 20 cubos precisa de ~240 coincidências, não de 20. Se o responsável quiser 1 por 1, isso é uma mudança de decisão, a registrar antes do "pra valer".

## 6. Ustr na V0.19 e questão de passagem à V0.20 [R, 28/11]

**Rede das glias:** "Glias formam redes. Não podem ser 'flutuantes'. Como elas se conectam?"

- **Histórico:** em 24/11 foram decididas duas condições.
  - **"Com relações":** territórios levemente sobrepostos, e nos cubos compartilhados cada Ustr vê os registros da vizinha (como as junções comunicantes).
  - **"Sem relações":** territórios exclusivos.
- **Hoje:** o motor da V0.19 só roda **"sem relações"**. Nenhuma ligação física entre as Ustr foi modelada ou desenhada.
- **Decisão para A e B.** Manter as Ustr com territórios exclusivos e sem comunicação entre si. Cada Ustr registra e compara incidências locais que expiraram sem integrar, permitindo a constituição de candidatas. A condução usa velocidade basal fixa, sem atuação da Utad. A comparação mantém constante a organização glial para isolar a liberdade espacial de constituição das Uints.
- **Perda e limite de inferência.** Uma Ustr não pode usar o registro de uma vizinha. A fronteira pode impedir a comparação de incidências espacial e temporalmente próximas. Uma mudança de carga ou de história de outra Ustr também não pode atuar por essa via. A dinâmica de ajuste temporal por Utad fica fora do ensaio. Os resultados valem sob essas restrições. A necessidade de uma rede glial ou de uma Ustr como unidade separada continua por testar.
- **Pauta de abertura da V0.20.** Paulo, Clara e Claudia retomarão a justificativa e as perdas acima. Distinguir observação comum na fronteira de comunicação efetiva entre Ustr. Formular qual operação em A poderia alterar B, qual grandeza atravessaria o contato e qual comparação distinguiria as hipóteses. A eventual classificação como Upro ou incidência permanece aberta.
