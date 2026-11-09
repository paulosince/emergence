# Leituras enviadas pelo responsável (09/11/2026)

Textos integrais obtidos pelo responsável e lidos por mim, com o que cada um muda no programa.

## Philippides, Husbands, Smith e O'Shea (2005). Flexible couplings: diffusing neuromodulators and adaptive robotics. *Artificial Life* 11(1–2), 139–160
- Retoma a modelagem física do óxido nítrico pelo grupo: equação de difusão modificada com produção, sumidouros e inativação, resolvida por diferenças finitas em grade fina, a partir de fontes 3D realistas.
- **Modelo de plexo:** concentração **uniforme** dentro de um raio (metade do pico do original), com o centro da nuvem podendo ficar **longe** do nó de origem (duas coordenadas a mais).
- **Modelo de receptores:** um só gás. Cada nó tem uma de três quantidades (zero, média, máxima) de cada um de N receptores. A modulação é proporcional ao produto da **concentração no nó** pela **quantidade do receptor**. Ações testadas: aumentar ganho; diminuir ganho; aumentar a fração de ativação retida (constante de tempo do integrador); acima de um limiar, trocar a função de transferência por um período longo. As duas primeiras são rápidas e curtas; as duas últimas, lentas.
- **Resultados** (40 execuções por variante, gerações até sucesso consistente; mediana): original 1.201; plexo 512; **receptores 47**.
- **Limites:** nós num plano 2D; difusão abstrata (exponencial ou uniforme); **todos os parâmetros, inclusive os receptores, são definidos pela evolução**; não há aprendizado durante a vida.
- **Consequência:** o **perfil receptor por unidade** que propusemos **tem precedente direto** (o modelo de receptores). O que não está lá: difusão física com parâmetros medidos em 3D; receptores atribuídos por **tipo e nível** dentro de um sistema que **constitui** suas unidades; dessensibilização e regulação lenta (homeostase); modulação **da plasticidade** (terceiro fator), não só da função de transferência.

## Gerstner, Kempter, van Hemmen e Wagner (1996). A neuronal learning rule for sub-millisecond temporal coding. *Nature* 383, 76–78
- Neurônio do núcleo laminar da coruja com 600 sinapses de **atrasos amplamente distribuídos** (2,5 ± 0,3 ms). Uma regra hebbiana com janela assimétrica seleciona as sinapses cujos atrasos diferem por múltiplos do período do som. Sobrevivem 105 (2 kHz) ou 154 (5 kHz) sinapses; **sinapses com eficácia nula são removidas**.
- Um termo constante de reforço por disparo pré-sináptico, com a janela, produz **normalização competitiva** da força total.
- Os autores situam o processo no **desenvolvimento** (ajuste "durante a ontogênese").
- **Consequência:** é a fonte primária do modo de **seleção de atrasos** do TEMPO e da **poda por eficácia nula**. A normalização competitiva é uma forma de homeostase com precedente.

## Curto e Itskov (2008). Cell groups reveal structure of stimulus space. *PLoS Computational Biology* 4(10), e1000205
- Com células de lugar como modelo, mostram que **saber apenas quais grupos de células disparam juntos** revela a topologia do ambiente e permite reconstruir o espaço até um fator de escala, **sem conhecer os campos receptivos**. Os autores sugerem que isso "may enable the brain to construct its own internal representations".
- **Consequências:**
  1. Ferramenta para o **marco da topologia dos sensores**: verificar se as coativações das unidades recuperam a topologia do mundo (por exemplo, a disposição da retina da mesa) sem informação do observador.
  2. Apoia a **autonomia constitutiva**: a estrutura pode vir da coatividade.
  3. A análise de coativação é do **lado do pesquisador**; o motor não a recebe.

## Buonomano e Maass (2009). State-dependent computations: spatiotemporal processing in cortical networks. *Nature Reviews Neuroscience* 10, 113–125
- O processamento espaço-temporal emergiria da interação entre a entrada e o **estado dinâmico interno** da rede, incluindo estados "ocultos" como a plasticidade sináptica de curto prazo.
- **Consequência: hipótese concorrente.** O TEMPO e o motor constitutivo representam o tempo por **atrasos constitutivos** (linhas de atraso); aqui o tempo estaria no **estado** da rede. Registrar como alternativa e, quando houver comparadores, incluir uma rede dependente de estado (por exemplo, com plasticidade de curto prazo).

## Berner, Gross, Kuehn, Kurths e Yanchuk (2023). Adaptive dynamical networks. *Physics Reports* (versão de pré-publicação lida)
- Revisão de redes cuja conectividade muda conforme o estado dinâmico, com plasticidade sináptica entre as aplicações principais.
- **Consequência:** o TEMPO e o motor constitutivo pertencem a essa classe. O texto serve de **referência de enquadramento** e de métodos matemáticos (separação de escalas de tempo, estabilidade) para a parte teórica dos artigos.

## Rakic (1972). Mode of cell migration to the superficial layers of fetal monkey neocortex. *Journal of Comparative Neurology* 145, 61–83
- Células recém-geradas migram cerca de 3.500 μm junto a **fibras gliais radiais** que atravessam toda a parede cerebral. Várias gerações migram ao longo da **mesma fibra**, o que permitiria as **colunas verticais** do neocórtex adulto.
- **Consequência:** dá base à variante de posicionamento "crescer a partir de uma região de origem". Fibras-guia predefinidas produzem **colunas por linhagem**, em contraste com a regra aprovada (nascer perto das fontes aferentes, por economia de fiação). As duas podem ser comparadas como variantes.
