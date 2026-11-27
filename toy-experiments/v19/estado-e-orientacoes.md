# V0.19 — Estado condensado e orientações

**Data:** 27/11/2026. **Escrito por:** Claude, a pedido do responsável (Paulo Rogério da Silva).
**Para que serve:** quem continuar a V0.19 (outra sessão ou outro assistente) lê este arquivo primeiro. Ele reúne só o que **vale agora**. O histórico completo, com as datas e as revisões, está em `decisoes-em-construcao.md`.

Repositório `paulosince/emergence`, ramo `claude/v19`. Marcas: [R] responsável; [L] literatura; [A] proposta do assistente; [M] medido; [V17]/[V18] vem das versões anteriores.

---

## 1. Objetivo e escopo

- **Objetivo [R, 20/11]:** transdução representacional fundamentada. As incidências da borda da V0.18 viram temporotopologia, de modo que a reapresentação do mesmo estímulo seja percorrida, **em sua maioria**, pela temporotopologia já vinculada àquele sinal.
- **Escopo [R, 24/11]:** "ciência se faz aos poucos". A V0.19 acrescenta à V0.18 **apenas a formação das primeiras malhas, sem processos posteriores**. Pergunta única: **sons diferentes formam malhas diferentes, e a volta do som reutiliza a malha?**

## 2. O que vem pronto da V0.18 (nada muda)

- **A Utrd** de cada ouvido: microfone + cóclea, 64 faixas, 21.731 pontos transdutivos, emissão e reserva da borda. Ressalvas em `v18/encerramento-transducao.md`.
- **As propriedades de toda Upro:** janela de refratariedade de 0,39 ms ± 50%; reserva de efeito com carregamento de 25 ms e dispersão de 2 s.
- **O Cpro existe quando a faixa tem Upro.**
- **A janela de propagação**, que era "igual para todas", passa a ser distância ÷ velocidade, como a própria V0.18 previu.
- **Sem atividade espontânea:** nada nasce no silêncio.
- A V0.19 só **dá coordenadas** ao que a V0.18 tem; não altera comportamento.

## 3. O que existe no instante zero

- **Existe:** as duas faixas da borda (V0.18) e as **Ustr**, espalhadas por igual ao lado de cada faixa, uma a cada ~4 pontos transdutivos vizinhos (~5.430 por ouvido) [R].
- **Não existe:** nenhuma Upro, ramo, Uint ou Cpro.
- **Conferência obrigatória antes de rodar:** contar as unidades no instante zero. Qualquer unidade representacional presente é violação; foi esse o erro que encerrou a V0.17.

## 4. Decisões vigentes

### 4.1 Princípios
- **Determinístico em tudo** [R]. A variação vem só do mundo, ou seja, de gravações diferentes (Mainen e Sejnowski 1995, texto integral).
- **Armadilha do determinismo:** reapresentar o mesmo arquivo passa por construção. Por isso, a "volta" é **outra gravação da mesma obra**.
- **Glias em vez de processo central** [R]: um processo central de testes de convergência fica inviável. As regras da Pcrt são executadas **localmente pela Ustr**, no próprio território: o "cubo mágico" é local, e o espaço faz o giro.
- **Neurotransmissor não entra como entidade** [R, mantém a V0.18].

### 4.2 Espaço e tempo de condução
- **O Sdom é 3D, com coordenadas** [R, 09/11 e 22/11]. O espaço é dividido em **cubos de ~20 µm**, e o cubo é a unidade de distância [R, 23–24/11].
- **Velocidade basal: 0,3 m/s**, a de uma Upro sem mielina; dá ≈ 67 µs por cubo [R].
- **Atraso de uma incidência = percurso ÷ velocidade.** O atraso sináptico não é somado: fica dentro do **tempo de integração da Uint, que não é instantânea** [R, 24/11; revê a variante de 09/11].
- **A posição da borda:** cada ouvido tem uma faixa desenrolada e compacta, com as bandas na ordem de frequência e, dentro de cada banda, a ordem de sensibilidade, do lado pilar ao lado do modíolo. Um ponto por cubo [R].
- **As faixas ficam nas posições dos microfones,** a ~10 cm uma da outra (~5.000 cubos) [R, regra de 09/11: posicionamento pela anatomia do corpo ou do sensor].
- **Na implementação, o espaço é guardado de forma esparsa.**

### 4.3 Criação (o que a Ustr faz na V0.19)
- **Fracasso** = incidência que expirou sem integrar. No começo, tudo é fracasso.
- **Coincidência:** dois fracassos coincidem quando caem na **janela de integração da Uint** (0,3 ms rápida; 0,9 ms lenta). A Ustr compara só dentro dessa janela [R, 24/11].
- **Onde nasce a Uint:** onde Upros com fracassos coincidentes se encontram. No mesmo ouvido, isso fica perto da faixa; entre os ouvidos, no caminho entre eles [R].
- **Toda Upro nasce num ponto transdutivo** (as da borda) **ou numa Uint**, ligada a uma Uint candidata (exuberância da V0.17).
- **Crescimento por coincidência [R, 27/11; revê "nasce com o comprimento" de 24/11]:** a Upro cresce rumo à Uint, **1 cubo a cada ~12 coincidências do par**, e só funciona quando chega (a latência é o próprio crescimento).
- **Exuberância pela incerteza [R, 27/11]:** diferença de chegada do par estável → 1 candidata; variável → candidatas espalhadas pela faixa observada (≥1 cubo entre elas); integrou → o par para de ganhar candidatas (Munz et al. 2014).
- **"Em sua maioria" [R, 27/11]:** o resultado não é limpo; erros, ruído representado e sons irrelevantes ganhando peso são esperados. O genérico (constitutivo, generalizável, abstraível) deve ser compartilhado e reutilizado em relações novas; a Chaconne deve reutilizar o genérico da Gymnopédie. A medida diz o que foi reutilizado (genérico ou específico) e o que nasceu novo. O motor segue determinístico.
- **Alcance só local [R, 27/11]:** a primeira camada é local e tonotópica, como as primeiras estações do cérebro (`investigacao-alcance-inicial.md`). O encontro dos ouvidos e as bandas distantes ficam para quando houver crescimento de longo alcance. A medida precisa mostrar quanto da reutilização vai além do espectro.
- **Candidatas por coincidência: 3**, com atrasos −10%, igual e +10% [R, pacote].
- **A Ustr se multiplica pela carga,** medida em fracassos registrados por hora. O teto será calibrado no primeiro ensaio [R].
- **O rastro de um fracasso dura até a sessão seguinte** [R].
- **Relações entre Ustr, em duas condições:**
  - **"Com relações":** territórios levemente sobrepostos, e nos cubos compartilhados cada Ustr vê os fracassos da vizinha.
  - **"Sem relações":** territórios exclusivos [R].
- **Tipo e nível:**
  - O tipo sai do que convergiu.
  - Muda-se de nível quando muda o tipo de convergência.
  - O mesmo tipo pertence à mesma organização, e isso cria laços.
  - Os níveis "não são marcos em pedra" [R].
  - Não há fórmula estrita de nível (a fórmula "1 + maior nível das entradas" foi sugestão do assistente, não decisão).

### 4.4 Uint e regra do ramo (pacote aprovado em 24/11)
- **Uint**, um só conjunto de parâmetros para todas:
  - janela rápida de 0,3 ms e lenta de 0,9 ms;
  - limiar de 1,5;
  - 0,6 ms da chegada ao disparo;
  - refratariedade de 0,5 ms;
  - as Upros que saem dela usam a reserva da V0.18.
- **Detector de coincidência no ramo** [R, 23/11]: o ramo guarda um rastro curto da última chegada; o disparo da Uint volta aos ramos; a comparação é local.
- **Promoção:** quem chega dentro da janela de integração do disparo participa e ganha força.
- **Punição:** quem chega depois do disparo perde uma fração da própria força, até ~34 ms depois (Bi e Poo 1998).
- **60 pares; eliminação após 1.000 disparos sem participar.**
- **Na V0.19, a regra do ramo fica implementada na estrutura, e observamos se ela é "chamada"** [R]: contar quantas vezes a promoção e a punição disparam.

### 4.5 Efeito
- **O efeito fica na incidência,** e quem o põe é a Upro. Cada Upro tem o seu; todos os ramos dela entregam o mesmo [R].
- **20% das Upros que saem de Uints nascem destinadas a inibir** [R]. A borda é 100% excitatória.
- **Na V0.19, essa troca de sinal não acontece:** tudo excita. A marca de "destinada" já existe, para as versões seguintes.

### 4.6 Teste
| Sessão | Som | O que medimos |
|---|---|---|
| 1 | Gymnopédie n.º 1, gravação A | Formação da malha |
| 2 | Gymnopédie n.º 1, gravação B | Formação da malha |
| 3 | Gymnopédie n.º 1, gravação C | Quanto a volta percorre a malha existente |
| 4 | Gymnopédie n.º 1, gravação D | Quanto a volta percorre a malha existente |
| 5 | Chaconne de Bach (violino), **no mesmo Sdom** | Quanto ela reutiliza e quanto cria de malha nova |

- **A criação continua ligada nas sessões de uso** [R, 21/11].
- **A divisão entre as gravações que formam e as que voltam** será decidida pelo responsável depois de ouvir as quatro.
- **Cuidado [A]:** as duas obras usam as mesmas faixas. A medida precisa separar o que é genérico e compartilhado, perto da borda, do que é específico de cada obra.

### 4.7 Estímulos (`estimulos/README.md`)
| Gravação | Licença | Situação |
|---|---|---|
| Alciatore, 3 min 4 s | Domínio público | Aqui |
| Coleman, Piano Society, 3 min 16 s | Não confirmada; uso interno | Aqui |
| Pfaul, Piano Society, 3 min 58 s | Não confirmada; uso interno | Aqui |
| Baiocchi, 3 min 11 s | CC0 (IMSLP) | Aqui (27/11) |
| Kolodin, 3 min 48 s | CC BY-SA 4.0 (arquivo do IMSLP) | Aqui (27/11) |
| Chaconne, Goldstein, 12 min 30 s | CC BY-SA 3.0 | Aqui |

Os arquivos de áudio não vão para o repositório (`.gitignore`). Neste ambiente, o Wikimedia recusa downloads e o IMSLP bloqueia a leitura das páginas de arquivo.

### 4.8 Custo (`custo-estimado.md`)
- **Volume [M]:** ~2,5 milhões de incidências por segundo por ouvido; ~900 milhões por apresentação de 3 min nos dois ouvidos.
- **Borda:** a saída de cada gravação é calculada uma vez e reaproveitada.
- **Duração [R]:** peça inteira ou trechos se decide **depois de um piloto de 10 s** do motor.
- **Máquina:** 2 núcleos e 7 GB de memória, então o motor lê em blocos.

### 4.9 Interface (GitHub Pages, `v19/index.html` na `main`)
- **Estética [R]:** futurista em azul, com fundo escuro e linhas de luz; só cor e estilo, sem personagens nem marcas.
- **Cena [R]:** a cabeça do robô vista de cima, manipulável em 3D, com zoom "entrando no cérebro".
- **Cores [R]:**
  - **amarelo:** o som chegando;
  - **verde neon:** incidência excitatória;
  - **vermelho:** inibitória;
  - **roxo:** nova constituição;
  - **azul:** acesso a uma constituição existente;
  - **ciano:** modificação do que existe.
- **A interface só exibe:** não alimenta o motor (separação de 09/11).
- **Princípio [R, 27/11]:** "o visualizador deve revelar o que o motor constitui, jamais constituir aquilo que pretende revelar". Ondas, microfone e fios são **demonstração do robô** (Utrd completa em ambiente virtual simulado), com legenda; o voo dos fótons fica até a criação ser implementada.
- **Estética atual [R, 27/11]:** "por dentro do Sdom" (referência *The Inner Life of the Cell*): unidades como bolas menores que o cubo, grade dos cubos de perto, incidências como fótons; cóclea reta; sinal elétrico em branco (cor provisória).

## 5. Decidido, mas fora da V0.19 (fica para as versões seguintes, com as regras já aprovadas)

- **Poda pela Ustr:** janela permissiva, marca e remoção em 1–4 dias, a atividade protege.
- **Utad:** excesso inicial, estabilização pelo uso, janela que fecha; de 0,3 até ~25 m/s.
- **Troca de sinal das inibitórias,** ao estabilizar.
- **Crescimento lento** rumo aos fracassos vivos (contagem por cubo), em tempo estrutural (~35 µm/h).
- **Fonte sintética em movimento.**
- **Ciclo de 24 h com sono, vigília e neuromoduladores:** proposto e desfeito em 24/11.
- **Neuromoduladores,** com os ganchos já reservados: posições 3D e a força das regras como parâmetro.

## 6. Revisões que já aconteceram (para não repetir erros)

- **Fórmula de nível:** foi atribuída ao responsável por engano; ele aprovou a proposição, não a fórmula.
- **"Segundo Sdom":** termo abandonado. As glias são parte do Sdom, a menos que haja uma Utrd entre elas e as unidades.
- **Gatilho da inibição:** "chegar fora de tempo troca o sinal" foi substituído pelo modelo neurobiológico, em que chegar depois do disparo enfraquece.
- **Janela de promoção:** era de 20 ms, como no córtex, e virou a janela de integração (aviso da V0.17: não há curva medida no tronco auditivo).
- **Atraso sináptico:** deixou de ser somado e foi para o tempo de integração da Uint.
- **Distância entre os ouvidos:** já estava decidida pela regra de 09/11. Consultar o histórico antes de perguntar.

## 7. O que falta, nesta ordem

1. **A escolha** de 4 entre as 5 gravações da Gymnopédie (Alciatore, Coleman, Pfaul, Baiocchi, Kolodin) e de quais formam e quais voltam (responsável, depois de ouvir).
2. ~~**Decisões para o motor mínimo**~~ (todas tomadas em 27/11): alcance só local; crescimento por coincidência (1 cubo a cada ~12); Uint candidata no cubo livre mais próximo; variantes de ±10% só se diferirem ≥1 cubo; largura de 16 cubos (confirmada); filha da Ustr rumo ao centro da carga. Ver `decisoes-em-construcao.md` (27/11).
3. **Implementar o motor mínimo e rodar o piloto de 10 s,** para medir a velocidade. O instante zero já está feito (27/11): `motor/instante_zero.py`, contagem conferida e página publicada.
4. **O calendário,** que agora é só a ordem das sessões e o número de apresentações por sessão, dependendo do piloto.
5. **O critério de "em sua maioria" e a medida,** separando o genérico do específico. O limiar é decisão do responsável.
6. **A instrumentação:** marcar cada estrutura com a sessão em que nasceu; contadores da regra do ramo; a interface.
7. **Os textos das simplificações a declarar,** em rascunho no `pacote-de-numeros.md`, seção 5. Na V0.19 valem:
   - construção determinística;
   - atraso sináptico no tempo de integração;
   - astrócito e micróglia juntos na Ustr;
   - a constante glial;
   - efeito por Upro;
   - 20% aplicado a Upros;
   - mesmo tipo, mesma organização;
   - faixa desenrolada;
   - glias já espalhadas no instante zero;
   - Sdom nascendo vazio;
   - candidata que nasce com o comprimento;
   - um só conjunto de parâmetros por Uint.
8. **O registro prévio congelado,** antes de rodar o teste de verdade.
9. **Em reflexão com o responsável,** sem bloquear nada: o tempo como condição × como conteúdo; o nível de episódio.

## 8. Orientações para quem continuar

- **Ler antes:** `CONTINUITY.md`, `CLAUDE.md`, `docs/program-methodology.md`, `docs/nomenclature.md`, este arquivo e `decisoes-em-construcao.md`.
- **Método:** o modelo é o neurobiológico. Divergir só com uma simplificação agnóstica justificada: mecanismo entendido, equivalência proposta, perdas declaradas.
- **Quem decide:** as decisões científicas (mecanismo, critérios, limiares, equivalências, nomes) são do responsável. O assistente propõe com recomendação e registra. Não marcar itens como concluídos sem a validação dele.
- **Nomes:** nunca criar termos. Os oficiais incluem Sdom, Utrd, Upro, Uint, Cpro, ramo, incidência, ponto transdutivo, Pcrt, janela de refratariedade, reserva de efeito, **Ustr (Unidade estrutural)**, **Utad (Unidade de ajuste temporal)** e glia, como nome da família.
- **Fontes:** nunca inventar. Dizer se leu o resumo ou o texto integral, e a confiança de cada número. Se não achar, dizer que não achou.
- **Conversa com o responsável:**
  - em português, simples e gentil; responder às piadas antes de voltar ao assunto;
  - **perguntas estruturadas, com opções**, até 5 de uma vez (acima de 5, uma por uma);
  - não inferir: perguntar;
  - ao pedir download, dar a referência completa.
- **Antes de perguntar,** consultar o histórico (`decisoes-em-construcao.md`, `docs/decisions-log.md`, as V0.17 e V0.18): várias respostas já existem.
- **Repositórios:** não alterar o repositório TEMPO (`paulosince/temporotopological-relations`); só leitura. Tudo da versão fica em `toy-experiments/v19/`. A interface vai para o GitHub Pages, não para um artefato.
- **Inovação:** a cada proposta, precedente ou evidência nova, atualizar `docs/innovation-tracking.md` (seções 26–30 são da V0.19).
- **Commits:** registrar cada decisão e enviar com `git -c push.negotiate=true push -q origin claude/v19`. As mensagens terminam com as linhas de coautoria da sessão.

## 9. Mapa dos arquivos da V0.19

| Arquivo | Conteúdo |
|---|---|
| `estado-e-orientacoes.md` | Este resumo (vale sobre o `continuidade-v19.md`, que ficou desatualizado) |
| `decisoes-em-construcao.md` | Histórico completo das decisões, com datas e revisões |
| `regra-de-criacao-rascunho.md` | Rascunho da regra de criação (partes de poda e Utad fora da V0.19) |
| `o-que-falta-para-implementar.md` | Lista auditada de 23/11, com o que já foi decidido riscado |
| `pacote-de-numeros.md` | Números aprovados, com fontes e confiança |
| `custo-estimado.md` | Contas de custo e o risco do rastro longo |
| `investigacao-*.md` | Pesquisas no modelo neurobiológico: escala e velocidade, densidade glial, glias, glias iniciais e distância, crescimento e alvos |
| `reflexao-neurotransmissores-e-neuromoduladores.md` | Por que eles ficaram fora agora |
| `estimulos/README.md` | Gravações, licenças e onde baixar |
