# V0.19 — Piloto de 10 s do motor mínimo (registro)

**Data:** 27/11/2026. **Trecho:** Gymnopédie n.º 1, Alciatore, 9 a 19 s (o mesmo da página). **Código:** `motor/borda_v18.py` (saída da borda da V0.18, só importada), `motor/sdom.py` (motor), `motor/piloto.py` (execução). Dados em `motor/dados/` (não versionados; regeneráveis).
**Para que serve [R 24/11]:** medir a velocidade, para decidir entre peça inteira e trechos. É piloto, não é o teste: nada aqui é resultado da V0.19.
**Marcas:** [M] medido; [A] leitura do assistente.

## Velocidade [M]

| Etapa | Tempo de máquina | Por segundo de som |
|---|---|---|
| Borda da V0.18 (os dois ouvidos) | 69 s | ~7 s |
| Motor do Sdom, ouvido esquerdo | 40 s | ~4 s |
| Motor do Sdom, ouvido direito | 36 s | ~3,6 s |

- Máquina: 2 núcleos. Com o alcance só local, os ouvidos não interagem, e cada um roda num núcleo.
- **Projeção [A], confiança baixa:** a velocidade pode cair quando a malha crescer e houver mais disparos.
  - Uma Gymnopédie de ~3,5 min: ~25 min de borda (uma vez só, reaproveitada) + ~15 min de Sdom.
  - O desenho todo (4 gravações da Gymnopédie + a Chaconne de 12,5 min, ~27 min de som): ~3 h de borda + ~1h45 de Sdom.
- **Disco:** a saída da borda ocupa ~32 MB por segundo de som (317 MB em 10 s). Uma gravação inteira daria ~6 GB e o desenho todo ~50 GB, e há 30 GB livres. Para a peça inteira, a borda precisa ser gravada comprimida ou em blocos, consumidos e apagados.

## O que o motor constituiu em 10 s [M] (ouvido esquerdo; o direito é parecido)

| | 1 s | 2 s | 4 s | 6 s | 10 s |
|---|---|---|---|---|---|
| Uints | 6.061 | 11.721 | 18.332 | 19.859 | 20.853 |
| Ramos que já funcionam | 17.665 | 43.596 | 66.352 | 105.390 | 140.505 |

- Contagem total: 11,0 milhões de incidências; 8,4 milhões de coincidências; 24.087 pares; 20.853 Uints; 183.039 ramos (140.505 já funcionando, dos quais ~135 mil são variantes).
- **A formação é rápida e satura cedo:** quase todos os pares que coincidem ganham Uint nos primeiros ~5 s, e depois o número de Uints quase para.
- **A exuberância é alta:** quase todo par tem diferença de chegada variável (a janela de 0,3 ms equivale a ~4,5 cubos), então nascem perto do teto de variantes. Comprimentos dos ramos: de 1 a 7 cubos.
- **Quase nada integra:** só **360 Uints dispararam** (1,7%), num total de **1.210 disparos**. **99,95%** das incidências continuam fracassando.
  - Causa [A]: a chegada vale força do ramo (0,15) × magnitude (~0,3–1), contra um limiar de 1,5. Um par nunca chega lá; só disparam as Uints onde muitos ramos convergem (variantes e Uints reutilizadas).
- **A regra do ramo é "chamada":** 22.099 promoções e 56.039 punições. Como há mais punições, a força cai (mínima de 0,06; máxima de 0,31).
- **Segundo nível:** nenhum ramo saiu de uma Uint ainda.

## Escolhas provisórias do piloto (não decididas; levar ao responsável) [A]

| Escolha | No piloto |
|---|---|
| Janela de coincidência da Ustr | 0,3 ms (a componente rápida) |
| Forma da janela de integração | a chegada vale 1 até 0,3 ms e 0,5 de 0,3 a 0,9 ms |
| Força inicial do ramo | 0,15 (V0.17) |
| Chegada na Uint | força do ramo × magnitude da incidência |
| Ganho por participação | +0,0065 (V0.17) |
| Fração da punição | 1/60 da própria força por chegada tardia |
| Cubo escolhido já ocupado por outra Uint | reutiliza a mesma Uint (convergência) |
| Variantes | alonga o ramo do emissor que chega antes, em j cubos (j inteiro na faixa observada); teto de 8 por par |
| Eliminação após 1.000 disparos sem participar | só contada, sem remover |

**As duas que mais pesam [A]:** a força inicial e a composição da chegada. Elas decidem se as Uints conseguem disparar. Hoje, quase nenhuma dispara, então quase nada é integrado nem selecionado. É o mesmo tipo de impasse do agudo na V0.17 (soma a ~80% do limiar).
