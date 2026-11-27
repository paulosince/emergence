# Investigação: onde ficam as primeiras células que integram entradas vizinhas (modelo neurobiológico)

**Data:** 27/11/2026. **Pedido do responsável:** ponderação 3/5 (posição da Uint candidata), opção "Pesquisar no modelo NB".
**Marcas:** [L] literatura; [A] proposta ou inferência do assistente.

## O que foi lido

| Fonte | O que foi lido | O que diz |
|---|---|---|
| Rattay et al. 2013, *PLoS ONE* (PMC3832640) | Texto integral, por extração dirigida | As fibras do nervo auditivo vão da cóclea até o núcleo coclear: comprimento médio medido de **15,8 mm no gato** e **32,4 mm no humano**. Condução no processo central (modelo): ~1,1 ms no gato e ~2,3 ms no humano. |
| Cao e Oertel 2010, *J Neurophysiol* (PMC3350034) | Resumo | Em camundongo, as células em arbusto esféricas pequenas recebem **no máximo 3, quase sempre 2** entradas excitatórias do nervo; as globulares, **pelo menos 4, provavelmente 5**. Octopus e estreladas D integram **dezenas** de fibras e respondem à coincidência delas (PMC12818756, trecho). |
| Spirou e colegas, *eLife* 2023 (83393) | Trecho | Muitas células em arbusto globulares ficam na **zona de entrada das fibras do nervo auditivo** no núcleo coclear. Por microscopia eletrônica, 5–12 terminais grandes convergem em cada uma (dissertação de Kersting 2020, resumo). |
| Kandler, Clause e Noh 2009 (já lido) | Texto integral | A convergência respeita a tonotopia desde o início: as entradas de uma célula vêm de fibras de frequências vizinhas. |

**Confiança:**
- Comprimentos do nervo: alta (medidos).
- Tempos de condução: média (modelo).
- Números de convergência: média; variam com a espécie e o método.

## O que isso diz para o Sdom [A]

1. **No cérebro, a primeira integração não fica colada ao receptor:** fica a um nervo de distância (1,6 a 3,2 cm; ~1–2 ms). Mas fica **logo onde as fibras chegam**: as globulares estão na zona de entrada do nervo.
2. **No nosso desenho, a faixa já está na posição do microfone, e o nervo não é modelado.** Na prática, os pontos transdutivos fazem o papel das fibras **chegando** ao Sdom. Então "perto das fontes" (regra de 09/11) corresponde à zona de entrada. A Uint no cubo livre mais próximo é a equivalência mais fiel.
3. **Modelar o nervo como distância seria pior agora.** Sem a Utad (fora da V0.19), tudo anda a 0,3 m/s. Um nervo de 16 mm daria ~53 ms de atraso, contra ~1 ms no cérebro, que tem mielina.
4. **A perda de não ter o nervo é pequena para a coincidência entre vizinhos.** Um atraso aproximadamente comum a fibras vizinhas não muda quem coincide com quem. Declarar: as diferenças de comprimento entre fibras de regiões distantes da cóclea não estão no modelo.
5. **O par como primeira convergência tem base.** As esféricas pequenas do camundongo recebem quase sempre **2** entradas, de frequências vizinhas.

## Opções levadas ao responsável

- **Cubo livre mais próximo**, do lado de dentro, com caminhos o mais iguais possível e desempate determinístico. É a zona de entrada (recomendada).
- **Modelar o nervo** (Uint a ~800 cubos). Atrasos errados sem a Utad: não recomendada.
- **Camada atrás das Ustr** (a 2 cubos da faixa): também é zona de entrada, mas é uma regra de desenho, sem base específica.
