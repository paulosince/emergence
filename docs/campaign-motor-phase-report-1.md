# Campanha da fase do motor: primeira rodada (09/11/2026)

**Escopo:** motor constitutivo com os **parâmetros pré-registrados**, substrato de 10.000 elementos, 10 sementes. Comparador: rede que cresce quando necessário. O controle TEMPO já foi calibrado antes. **Resultado confirmatório: negativo** nos critérios avaliados. A série de escala e as ablações ainda não foram rodadas.

## 1. Resultados confirmatórios (conforme pré-registrado)
| Critério | Motor constitutivo | Rede que cresce quando necessário | Dados |
|---|---|---|---|
| Ancoragem na altura | **falha** (1/10; ρ de −0,13 a 0,77) | — | [anchoring-constitutive-10k.json](campaign/anchoring-constitutive-10k.json) |
| Salvaguarda da altura fixa | falha (7/10) | — | idem |
| Reativação específica | **falha** (0/10; acerto ≈ acaso) | falha (mesmo nó sempre) | [engram-constitutive-gwr-10k.json](campaign/engram-constitutive-gwr-10k.json) |
| Perda de função específica | não aplicável (reativação falhou) | não testável | idem |
| Persistência e retorno | falha (0/10) | falha | idem |
| Maturação | **falha** (0/10) | — | [maturation-constitutive-10k.json](campaign/maturation-constitutive-10k.json) |
| Vantagem sobre comparadores | falha (depende da ancoragem) | — | — |

**Pelo pré-registro:** a hipótese de ancoragem está **refutada** para esta versão do motor neste mundo. A hipótese de formação ainda depende da mesa. A do papel interno não é aplicável. A de continuidade está refutada. A de maturação está refutada.

## 2. Diagnóstico (exploratório; não altera o resultado confirmatório)
**a) Sintonia de altura** (`experiments/exploratory-height-tuning.js`, [dados](campaign/exploratory-height-tuning.json)). Para cada unidade que dispara em ≥ 5 quedas, compara-se a dispersão das alturas dessas quedas com um nulo de quedas sorteadas (percentil 1).
- **Existem unidades sintonizadas à altura em todas as sementes:** entre 6 e 19 por semente, de 12 a 41 testadas.
- Mas a **primeira unidade a disparar** em cada queda raramente é uma delas (ver tabela no JSON).
- **Leitura:** o motor forma unidades da altura, mas a definição pré-registrada de "unidade que responde" (a primeira do episódio) capta unidades de outros pares, sem relação com a altura. Isso **não** muda o resultado confirmatório. Qualquer outra definição seria um desvio que precisa de aprovação, com calibração.

**b) Maturação.** No mundo de altura fixa, a surpresa fica em ~0,64 do começo ao fim, porque as relações **não se fortalecem**. O fortalecimento (subir de nível) exige o portão modulador aberto, e o portão só abre com novidade. Num mundo **familiar** não há novidade, então não há consolidação. Por isso o mundo aleatório termina com surpresa **menor** (~0,45) que o fixo: a ordem prevista se inverte.
- **Leitura:** acoplar o fortalecimento da relação **somente** ao portão de novidade impede o amadurecimento pelo uso repetido.
- No cérebro, a repetição também fortalece. A consolidação tardia depende de moduladores, mas a potenciação inicial por coatividade não depende. A relação entre as duas é um ponto de **mecanismo** que precisa de decisão do responsável.

## 3. Decisões do responsável
1. **Definição de "unidade que responde":** manter a pré-registrada (o resultado fica negativo), ou registrar um desvio para uma definição neutra quanto ao conteúdo e calibrá-la com os controles. Opções:
   - a unidade **mais preparada** que dispara no episódio (coerente com a preparação do campo);
   - **todas** as unidades que disparam, com reativação medida no conjunto.
2. **Fortalecimento pelo uso:** permitir que a relação se fortaleça com a coatividade repetida, mesmo com o portão fechado (potenciação inicial), e reservar o portão para a consolidação duradoura (subir de nível na cascata). É uma mudança de mecanismo, a fundamentar na literatura antes.
3. **Série de escala e ablações:** rodar agora com a versão atual (resultado negativo informativo) ou depois das decisões 1 e 2.
