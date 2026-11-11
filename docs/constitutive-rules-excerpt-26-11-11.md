# Regras constitutivas do EMERGENCE: excerto do que foi discutido e definido (até 11/11/2026, 16h41)

**Para que serve:** evitar que se quebre o que já avançou. Este excerto reúne, num só lugar, as regras de constituição (como surgem e mudam Upro, Uint e relações) decididas pelo responsável, com a origem de cada uma.

**Legenda:**
- **[D]** = decidido pelo responsável (data e hora). O desenho está definido, mas a **suficiência não está demonstrada**: isso cabe à simulação.
- **[V]** = variante registrada para comparação.
- **[A]** = em aberto.
- Origem: **(lit.)** apoio na literatura; **(nosso)** proposta ou inferência nossa aprovada; **(resp.)** formulação do próprio responsável.

Fonte de tudo: os documentos do repositório, em especial [revisão da arquitetura], [novidade e surpresa], [liberação de moduladores], [glias e adenosina], [aprendizado diferido] e [nomenclatura].

---

## 1. Princípios de base
1. **[D] (resp., 10/11, 17h00)** Sem nenhuma representação não há Sdom. Há **sistema**, com **predisposição** (Pcrt): as regras e os processos criadores já existem.
2. **[D] (resp., 10/11, 17h10)** O sistema agnóstico **não herda arquitetura pronta**, ao contrário dos seres darwinianos.
   - Justificativa da simplificação (nosso): na biologia, as fibras aferentes existem antes da experiência; aqui, as Upro surgem das transduções pela Pcrt.
   - Perdas declaradas: a organização inicial pronta (por exemplo, tonotópica) e o ganho de tempo que ela dá.
   - **[V]** Upro preexistentes, aleatórias ou ordenadas.
3. **[D] (guia do responsável, 10/11, 16h45)** A fronteira do Sdom é **funcional e constitutiva** (a tríade). Nada é incluído nem excluído por antecipação. **Existirem unidades não é existir Sdom**: antes da tríade há só organização precursora.
4. **[D] (resp., 10/11)** **Incidências só surgem de transdução.** Marca-passos e sensores químicos do corpo são **Utrd endógenas**: são borda, mesmo estando "dentro".

## 2. Entrada: Utrd → Upro → Uint
5. **[D] (resp., 10/11, 15h52 e 17h00)** As Utrd fazem a transdução representacional nos dois sentidos e **são parte da fronteira**, nem dentro nem fora.
6. **[D] (resp., 10/11, 17h04–17h08)** Sequência: **transdução → propagação → integração.** A Utrd é especializada, mas **não sabe de antemão** que sinais receberá. Por isso **as Upro se criam conforme as transduções acontecem**, segundo as regras da Pcrt.
7. **[D] (resp., 10/11, 17h24)**
   - **Uma Upro só existe se já tem destino**; sem destino, ela está sendo criada naquele momento.
   - Se a incidência encontra uma Upro, já há caminho. Se não encontra, é criação nova, e a Upro **tem de convergir numa Uint**.
   - A Utrd pode ter várias saídas; as que caem dentro de um limiar de tempo integram no mesmo ponto.
   - A regra de linhas e colunas na Utrd visual foi dada como **exemplo** de "outro tipo de regra". **[A]** Não está decidida no registro. A síntese do ChatGPT diz "não adotada como regra principal; variante" (ver seção 11).

## 3. Forma da regra de formação
8. **[D] (10/11, 17h39) (lit. + nosso)** A **forma da regra é comum (Hebbiana)**. A **especialização** fica na Utrd (o que transduz, resolução, taxa) e nos **parâmetros da janela**.
   - Apoio: o córtex auditivo "reconectado" à retina forma módulos visuais (Sharma, Angelucci & Sur 2000).
   - Perda: as especializações locais do tecido.
   - **[V]** Regras diferentes por sentido.
9. **[D] (10/11, 17h43; refinado às 17h51–17h54) Dois caminhos de formação** ("com absoluta certeza"):
   - **(i) Com terceiro fator** (novidade ou surpresa, pelos moduladores): ainda exige **algumas repetições**, menos que sem ele. O terceiro fator encurta o caminho, não o elimina (opção B).
   - **(ii) Sem terceiro fator, por recorrência espaçada:** a marca dura até ~3 h; uma repetição só soma depois do **refratário de 30–60 min**; ~3 repetições espaçadas fecham.
     - (lit.) Frey & Morris 1997 por fontes secundárias; Kramár et al. 2012; Seese et al. 2014.
   - **Medida comum: a quantidade acumulada na marca.** Cada coincidência soma um pouco; a formação fecha ao atingir um **limiar**.
     - No caminho (i), fecha com **10% do limiar**, e cada coincidência soma menos de 10%, de modo que ainda sejam necessárias algumas.
     - Valores a calibrar.
     - Proposta nossa, a confirmar na implementação: as contribuições de uma mesma sessão somam até ~1/3 do limiar.
10. **[D] (10/11, 17h47–17h48)** A **janela do terceiro fator** depende do **modulador** e do **local**. O local é definido pela relação com o **canal**, não por mapa pronto. Faixas na literatura (Gerstner et al. 2018, revisão; confiança média-alta):
    - noradrenalina: ~5 s;
    - serotonina: ~2,5 s;
    - dopamina: ~1 s no estriado e até ~1 min no hipocampo.
11. **[A]** Janela de coincidência Hebbiana: pré antes do pós por ~0–20 ms (Feldman 2012; confiança média). O valor vai para a calibração.

## 4. Upro (especificação fechada em 10/11, 20h45; acréscimo em 11/11)
12. **[D] Existência:** só com destino. Nasce das transduções, junto com a Uint.
13. **[D] Sinal na Upro:** excitatória ou inibitória (perda declarada: princípio de Dale).
14. **[D] Upro inibitórias nascem**:
    - na **concepção**, onde a inibição já deve existir;
    - pela **experiência**, quando uma relação aprendida se mostra errada.
    - **A correção é construtiva:** cria-se a representação correta, e a errada decai até a poda pelas convergências futuras (resp., 10/11).
15. **[D] Direção:** de origem para destino. É a **ordem**.
16. **[D] Tempo de propagação:** distância ÷ **velocidade de propagação**. Parte de um basal e aumenta devagar com o uso; teto de ~100 ms. A implementação (C1) está pendente.
17. **[D] Ganho plástico.**
    - **Excitatórias:** fortalecem por **confirmação**.
      - **Acréscimo de 11/11, 11h01 (resp., o caso João):** se a Upro entrega a incidência e o destino **favorecido não dispara**, o decaimento natural dá uma **leve acelerada** naquele momento ("uma lapidada a mais"). (lit.) Artola, Bröcher & Singer 1990.
    - **Inibitórias:** fortalecem por coatividade em ~10 ms, em **qualquer ordem**, **sem** termo de enfraquecimento próprio. "Ela fez o papel dela, inibiu." (lit.) Vogels et al. 2011.
    - **Todas** decaem pelo nível de consolidação e são **podadas por desuso**.
18. **[D] Campos:** marca de consolidação (intensidade e momento, ~3 h); nível de consolidação; velocidade de propagação; **ação sob modulação** (perfil por classe: transmissão; plasticidade, com portão, janela e polaridade).
19. **[A]** Ganho inicial (U2) e ganho máximo abaixo de 0,9, a fixar com o número de aferências.

## 5. Uint (especificação fechada em 10/11, 22h19)
20. **[D] Nascimento:** convergência de **≥2 incidências**, pela regra comum. **Recruta por excitabilidade.**
21. **[D] Integração:** soma com sinal (magnitude × efeito), comparada ao limiar, dentro da **janela de integração**. A janela é intrínseca, com componentes rápida e lenta, e encurta com a atividade de fundo. Tem três camadas:
    1. basal, igual em todo o domínio;
    2. ação sob modulação, nos dois sentidos;
    3. plasticidade homeostática: potenciação encurta, depressão alonga.
22. **[D] Supressão após disparar** em três escalas: ~10 ms, ~50–100 ms e segundos. A lenta cresce com os disparos recentes e é modulável.
23. **[D] Constante de tempo** cresce com a **distância hierárquica desde as Utrd** (espectro de ms a horas).
24. **[D] Nível de consolidação próprio** da Uint.
25. **[D] Adenosina** como subproduto de todas as Uint: freio rápido local mais pressão lenta.

## 6. O que a experiência faz na malha (novidade e surpresa, fechado em 11/11)
26. **[D] (11/11, 10h15)** Novidade e surpresa são **dois eixos independentes**:
    - **novidade** = não existe representação para a combinação (estrutura);
    - **surpresa** = expectativa violada: dispara uma Uint fora do rol esperado (dinâmica).
    - A expectativa é o estado produzido pela preparação do campo.
27. **[D] (11/11, 10h37)** A **novidade forma Uint**. Ela aparece como **amplitude**, que vem da **atividade de formação**: recrutamento, nascimento e afinamento.
    - Exemplo da xícara (resp.): o copo acessa o que existe; a alça forma.
    - **[V]** Inibição plástica do familiar (Schulz et al. 2021).
28. **[D] (11/11, 11h01)** A **surpresa forma Upro** entre Uint existentes que dispararam juntas sem relação, e acelera levemente o decaimento das excitatórias que não se confirmaram (item 17).
29. **[D] (11/11, 10h42–10h46)**
    - A Uint criada **não** é moduladora.
    - As moduladoras são acionadas pela convergência ampla das existentes e das recrutadas.
    - O novo deixa **dois registros**: a Upro para a moduladora e a **marca mais forte**.
    - A **habituação** vem da queda da amplitude. Se o novo passa a importar, surge uma segunda entrada e a resposta volta.
30. **[A] H-N3:** o grau de novidade (comum ou distinta) pela sobreposição. Hipótese a observar.

## 7. Consolidação
31. **[D]** A **marca de consolidação** com limiar equivale ao "synaptic caching" (Li & van Rossum 2020): guardar barato e consolidar de vez em quando.
32. **[D] (11/11, 13h55) Reserva local** (H-G1):
    - a consolidação **consome** a reserva da Uint;
    - a reposição é lenta, mais rápida no repouso e no sono;
    - sem reserva, as marcas esperam ou caducam, e daí surge **competição entre marcas sem seletor central**;
    - a adenosina é o subproduto do gasto; a reserva é o suprimento.
    - (lit.) Suzuki et al. 2011; Plaçais & Preat 2013.
    - **[A]** O acoplamento ao estado do corpo ainda vai ser discutido.
33. **[D] (10/11, noite) Aprendizado diferido:**
    - a **mesma regra**, com fonte interna de coatividade (reexecução);
    - o refratário vale para as reativações, que ocorrem no repouso e no sono;
    - H5: a compressão surge do encadeamento; os intervalos ficam guardados nas relações.
    - Uma malha com dois ritmos; observar se surge uma região de plasticidade rápida.
34. **[D] Controle do andamento** por fila competitiva: pré-ativação em paralelo, supressão após disparar, portão temporizado. A competição vem de **Upro inibitórias formadas pela experiência**.

## 8. Moduladores na constituição
35. **[D] (11/11)**
    - **Cinco moduladores:** acetilcolina, noradrenalina, dopamina, serotonina e adenosina.
    - **Um por Uint moduladora**, com a exceção noradrenalina + dopamina.
    - **Sítios** perto da fronteira, do lado das Utrd endógenas, sem conteúdo. As moduladoras **nascem nos sítios pela regra comum**, e as entradas e saídas também se formam pela regra comum.
    - **Partida em duas fases:** primeiro a formação ocorre sem terceiro fator; a modulação entra à medida que as moduladoras nascem.
    - **Tônico e fásico** emergem das entradas.
    - **[V]** Moduladoras presentes desde t0; emergência por convergência; fontes locais esparsas de acetilcolina.

## 9. Decisões de 09–10/11 (antes do redesenho) que seguem valendo até revisão
Estão no CONTINUITY.md, seção 3, e não foram reabertas no redesenho. **[A] Convém reconferir uma a uma com o responsável.**
36. **Efeito:** excitação e inibição acrescentadas à incidência pelas unidades (todas podem, nenhuma precisa). A soma é limitada a −1…+1; a magnitude vai de 0 a 1 e é multiplicativa.
37. **Uint:** pelo menos duas aferências; "fontes distintas" = Upro diferentes (a mesma origem vale). A **confirmação fortalece.**
38. **Ajustar antes de criar** (v43, L81–82).
39. Definição operacional anterior de "esperada": favorecida a ≥0,2 do limiar, contando as contribuições em trânsito e a propagação do esperado. É coerente com a expectativa de 11/11; o valor fica para a calibração.

## 10. Em aberto que toca a constituição
- **H-G2: fechamento do período crítico.** Contraexemplo do NB: o fechamento é **ativo e reversível**; astrócitos imaturos reabrem a plasticidade (Ribot et al. 2021). Recomendação: **variante**, acionada se a saturação constitutiva não bastar.
- **Período crítico da ligação domínio → Utrd eferente:** recomendação de 10/11 de **não impor** e deixar emergir.
- **Critério de primeiro conteúdo** (teste operacional da tríade).
- Calibrações: ganhos, limiares, janelas, número de coincidências por marca.
- Implementação no motor novo.

## 11. O que a síntese do ChatGPT (11/11, tarde) traz e o registro não tem
Só a síntese foi lida, não a conversa inteira.

| Item da síntese | Situação no registro |
|---|---|
| Proximidade entre canais e dentro do canal como **favorecimento**, não determinação (regra de Peters) | **não registrado**; confirmar se é decisão |
| Linhas e colunas pré-fixadas **não adotadas** como regra principal; ficam como variante | no registro foi só um exemplo (17h24); confirmar |
| **Competição entre conexões** como "candidato não consolidado" | parcialmente coberta: competição entre marcas (reserva local, 13h55) e Upro inibitórias formadas pela experiência. **Em aberto:** a competição entre projeções por território (Triplett et al. 2011) |
| Plasticidade **heterossináptica** e normalização | não registrada; a "lapidada" é **homossináptica** (só a Upro que entregou) |
| Vizinhos comuns (Perin, Berger & Markram 2011) | não registrado; a síntese mesma alerta que é regularidade descritiva, não mecanismo |
| Variantes A–D (Hebb mínimo; + topografia; + competição/estabilização; + ambas) | coerentes com o método, como **comparações sobre a base decidida** |
| "Saturação constitutiva" em vez de H-G2 | coerente com a novidade como amplitude (item 27). Ver o contraexemplo de Ribot na seção 10 |
| Os dois caminhos de formação "aprovados para investigação" | no registro estão **aprovados como desenho** (item 9) |


## 12. Atualização de 11/11/2026, 17h36–18h35 (transdução e propriedades da Upro; [transdução](transduction-mapping-v0.md))
40. **[D] (17h50)** A **intensidade** vira o **número de Upro recrutadas**. Os limiares ficam **na Utrd**, então as Upro já saem normalizadas. O conjunto é aninhado: o forte inclui o fraco. (lit.) Fracionamento da intensidade por sinapses heterogêneas na cóclea (Özçete & Moser 2024); faixa de 20–40 dB por fibra (Wen et al. 2009).
41. **[D] (18h11)** **Na fronteira, a magnitude é fixa**, o equivalente do tudo ou nada (Adrian & Zotterman 1926).
42. **[D] (18h23)** **O ganho sai.** A **confiança** (o peso) é a propriedade da relação, e a magnitude da incidência ao passar pela Upro = **confiança × modulação**. **Isso substitui o item 17** quanto ao "ganho".
43. **[D] (18h33–18h35)** **Estabilidade** é a segunda propriedade, **independente** da confiança.
    - O **decaimento da confiança vem da estabilidade**.
    - A **consolidação** é estado: confiança × estabilidade, em três degraus (efêmera, estável, consolidada).
    - **Isso substitui o "nível de consolidação"** dos itens 18 e 24, este último na Uint, a conferir.
44. **[D] (18h23)** A Upro nasce com **confiança baixíssima**, portanto efêmera.
45. **[D] (18h27)** A **Uint jovem tem limiar mais baixo**, que sobe com a maturação.
46. **[A]** A **marca de consolidação** governa a **subida de degrau**, não o nascimento: refratário, captura em ~3 h, intensidade conforme os moduladores e consumo da reserva. A explicação foi dada às 18h27, e o responsável respondeu com a proposta da estabilidade. Confirmar que a marca é o que sobe a estabilidade.
47. **[A]** Frequência física: lugar como regra (qual Utrd), com travamento de fase nas faixas baixas. **Topologia:** identificadores opacos com vizinhança emergente, ou proximidade favorecendo? **Adaptação:** Utrd de adaptação rápida e lenta? (Perguntas 2–4 da [transdução](transduction-mapping-v0.md).)
