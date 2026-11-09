# Efeitos (excitação e inibição) e magnitude da incidência — proposta v0.1

Situação: **proposta, aguardando aprovação do responsável** (09/11/2026). Nada implementado.

## 1. O que o responsável definiu (registro de 09/11/2026)
- Excitação e inibição se chamam **efeito** na CLEAR.
- O efeito é acrescentado às propriedades da incidência **pelas unidades**; todas podem (Utrd, Upro, Uint de origem e de destino), nenhuma precisa.
- O efeito é uma **soma** com sinal ("quanto inibe, quanto excita").
- As unidades também podem agir sobre a **magnitude** da incidência, que vai de 0 a 1.
- Contribuição na Uint = magnitude × efeito (exemplo confirmado: 0,8 × (−0,8) = −0,64).

## 2. Conferência com a CLEAR v43 (texto extraído, lido nos trechos citados)
- Linha 68: as contribuições precisam se tornar "jointly effective". **Compatível.**
- Linha 70: incidências em momentos diferentes participam "if their effects remain available within the relevant interval". **Compatível**, e exige que a contribuição tenha curso temporal (já existe no motor só para a parte excitatória).
- Linha 130: "effective contributions satisfy its threshold". **Compatível** com somar contribuições com sinal e comparar ao limiar.
- A v43 não diz como sinal e magnitude se compõem. A regra acima **não contradiz** a v43; é especificação do responsável, não texto da teoria.

## 3. Conferência com a neurobiologia (de memória; fontes a reler antes do pré-registro)
| Regra | Correspondente biológico | Bate? |
|---|---|---|
| Efeito como soma com sinal | Transmissor e receptor juntos dão o sinal; uma célula pode ter receptores excitatórios e inibitórios para o mesmo transmissor (acetilcolina: nicotínico e muscarínico), e há neurônios que coliberam glutamato e GABA; a resposta líquida é a soma | Sim |
| Contribuição = magnitude × efeito | Corrente pós-sináptica ≈ quantidade liberada × eficácia do receptor | Sim |
| Soma das contribuições contra o limiar | Somação linear de potenciais pós-sinápticos pequenos (modelo "baseado em corrente") | Sim, com perdas (abaixo) |
| Unidade age sobre a magnitude **somando** (com limite 0–1) | Inibição pré-sináptica, depressão e facilitação de curto prazo e neuromodulação **multiplicam** a liberação; nenhuma cria liberação sem impulso | **Não** |

## 4. Divergência encontrada e sugestão
**Problema da soma na magnitude:** uma unidade que soma +0,3 transformaria uma incidência de magnitude 0 (nada chegou) em 0,3, isto é, criaria incidência a partir de nenhuma. Isso não tem correspondente biológico e quebra a distinção da v43 entre propagar (Upro) e integrar (Uint).

**Sugestão (proposta nossa):** a ação sobre a magnitude é **multiplicativa com saturação**: m' = min(1, m × g), com g ≥ 0.
- g < 1 atenua (inibição pré-sináptica, depressão); g > 1 amplia (facilitação, neuromodulação); g = 1 é a unidade que não age.
- Magnitude 0 continua 0: nenhuma unidade cria incidência.
- Mantém o intervalo 0–1 definido pelo responsável.

O efeito continua aditivo, como definido. Se o efeito tem limite (por exemplo −1 a +1) está **em aberto**.

## 5. Perdas declaradas da soma linear na Uint
1. **Inibição por desvio de corrente** (shunting): na biologia a inibição perto da reversão age dividindo a excitação, não só subtraindo.
2. **Dependência de voltagem** (por exemplo, receptores NMDA): a mesma incidência contribui diferente conforme o estado da Uint.
3. **Cursos temporais diferentes por sinal:** na biologia a inibição costuma durar mais que a excitação rápida (GABA-A dezenas de ms; GABA-B centenas de ms; confiança moderada nos valores). Sugestão: constante de disponibilidade por unidade, sem impor diferença por sinal até haver motivo.

Se alguma dessas perdas se mostrar necessária, entra como termo adicional, registrado como desvio.
