# Análise da hipótese "Orientação exploratória transitória evocada por reflexos motores" (OET) — v0

Data: 10/11/2026. Hipótese recebida do responsável (elaboração independente). **Só análise; nada implementado**, conforme pedido no texto da hipótese.

## 1. Compatibilidade com o que já foi decidido
- **Regra de origem** (incidências só de transdução ou marca-passos): a OET não pode criar incidências; só pode **modular** (limiares, ganhos, magnitudes) o que já ocorre. A "atividade motora adicional" precisa vir de uma das fontes existentes: movimentos espontâneos do corpo (marca-passos em S), reflexos ou o domínio pela via inversa.
- **Origem da exploração** (decisão de 10/11/2026): exploração "da relação criada entre algo que acontece e a consequência; quando a dinâmica interna gera novos candidatos a acesso". A OET é compatível se for entendida como modulação que **aumenta temporariamente a chance de acesso** desses candidatos; é incompatível se injetar movimentos ao acaso dentro do domínio (descartado na mesma decisão).
- **R-10/R-11** (sem recompensa, sem modelos externos como solução): a OET evocada por evento, sem avaliação de sucesso, respeita isso.
- **Mecanismo já existente:** o motor v2 tem uma fonte moduladora (salva fásica, concentração, receptor, portão) disparada por novidade e surpresa. A OET pode ser uma **segunda via de evocação do mesmo sistema modulador** (evento reflexo → liberação), agindo também sobre a excitabilidade motora. Isso atende ao requisito "sem módulo central dedicado".

## 2. Paralelos na literatura (resumos lidos)
- **Sistema locus coeruleus–noradrenalina, teoria do ganho adaptativo** (Aston-Jones e Cohen 2005, *Annu. Rev. Neurosci.* 28, 403–450): modo fásico favorece a resposta em curso; modo tônico associado a desengajamento e busca de alternativas (exploração). Diferença crítica: na teoria, a mudança é guiada pela **utilidade** da tarefa (avaliação de resultado), o que a OET exclui.
- **Variabilidade motora injetada por um circuito específico** (Ölveczky, Andalman e Fee 2005, *PLoS Biol.* 3, e153): em aves canoras jovens, o núcleo LMAN injeta variabilidade no canto; silenciá-lo reduz a variabilidade de forma rápida e reversível. Paralelo direto da "exploração" como modulação da via motora, separada do aprendizado.
- **Espasmos no sono** (já registrados em docs/efferent-path-v0.md) e **teoria ideomotora**: fornecem a outra metade (consequências que viram representações e depois guiam o movimento).

## 3. Onde a OET poderia agir na arquitetura (alternativas)
| Ponto de ação | O que muda | Consequência |
|---|---|---|
| A. Corpo (S): taxa dos movimentos espontâneos | mais movimentos depois de um reflexo | aprendizagem por mais dados; mecanismo fora do domínio |
| B. Via final comum: ganho do comando vindo do domínio | movimentos produzidos pelo domínio ficam mais amplos | depende de já existir via inversa |
| C. Domínio: limiar das Uint ligadas a movimento | mais acessos de representações motoras | "candidatos a acesso" mais prováveis; mais próximo da decisão de 10/11 |
| D. Domínio: taxa de plasticidade (já existe) | mais constituição durante a janela | é o que o modulador já faz; não gera movimento |
Difusa × localizada: "localizada" pode ser obtida sem rótulos externos se a modulação for **espacial** (o campo de difusão já implementado em `src/space/diffusion.js`: liberação perto das unidades ativas pelo reflexo; o efeito cai com a distância constitutiva). Isso dá localização por propriedade operacional real, como a hipótese exige.

## 4. Riscos de circularidade
1. **H3** (evocação por relações constituídas) usa aquilo que o experimento quer medir; só pode ser testada depois que relações existirem, e a evocação não pode entrar nos critérios de constituição.
2. Se a OET for disparada também por surpresa ou novidade, confunde-se com o modulador existente; é preciso poder ligá-las separadamente.
3. **Quantidade de movimento:** qualquer vantagem pode vir só de "mais movimento". Exige controle pareado (abaixo).
4. **Localizada via relações** (E2 por "relações efetivamente constituídas") tem o mesmo problema de H3.
5. **Nome:** "Orientação" já nomeia a fase 3 do roteiro antigo (detecção de Orientação); sugerimos outro nome para evitar confusão.

## 5. Desenho experimental sugerido
- **E0** reflexos; **E1** OET difusa; **E2** OET localizada (espacial); **E1-pareado** e **E2-pareado**: a mesma quantidade e distribuição temporal de modulação, mas **sem contingência** com os reflexos (desfasada no tempo ou reproduzida de outra execução). Isso separa "contingência com o reflexo" de "mais atividade".
- **H1 × H2:** H1 = evocação pelo comando do reflexo (incidência eferente); H2 = evocação pelas consequências (incidências aferentes após o movimento). Discriminável porque o comando precede as consequências em dezenas de milissegundos e pode ser bloqueado separadamente (ablação do canal do comando × ablação das consequências por imobilização simulada).
- **Medidas:** diversidade de movimentos e de consequências (entropia por articulação e por região de pele); relações constituídas e sua persistência pelos critérios de engrama; **teste ideomotor**: depois da aprendizagem, ativar a representação de uma consequência e verificar se o movimento correspondente ocorre pela via inversa; dependência da OET (desligar depois de aprender); estereotipias e instabilidade (sinais agonista × antagonista nos tendões).
- **Ordem:** só é testável depois dos passos 4 (reflexos de preensão, retirada e orientação; movimentos espontâneos) e 6 (via inversa e Utrd motora).

## 6. Pontos que precisam do responsável
1. ANCHOR: não temos o texto de ANCHOR; a correspondência funcional precisa das suas definições.
2. A OET é capacidade inicial fornecida (como os reflexos), declarada como tal? A hipótese admite isso.
3. Ponto de ação preferido (A, B, C) ou testar todos.
