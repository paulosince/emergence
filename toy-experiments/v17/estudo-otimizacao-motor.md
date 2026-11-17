# V0.17 — Estudo: otimizar o motor rumo ao tempo real

**Pedido do responsável (17/11/2026):** otimizar o motor o máximo possível, rumo ao "tempo real", porque a exigência vai aumentar muito (384 vias, Bach, outros sentidos).
**Redação:** assistente (Claude). **Estatuto:** estudo de engenharia. Nenhuma mudança de regra; toda otimização deve reproduzir os resultados **exatamente** (mesma semente → mesma saída), salvo quando o responsável aprovar outra coisa.
**Legenda:** [C] medido; [A] estimativa ou proposta (com confiança).

## 1. Onde estamos [C]
Motor `motor_correcoes.py`, conjunto B, um par de fibras com 8 Uints, 5 episódios de 10 s (50 s de som simulado), 1 núcleo:

| Faixa | Tempo | Em relação ao tempo real | Incidências por segundo | Custo por incidência |
|---|---|---|---|---|
| grave | 0,42 s | **119× mais rápido** | 439 | ~19 µs |
| agudo | 5,42 s | **9× mais rápido** | 2.658 | ~41 µs |

Um par de fibras já roda mais rápido que o tempo real.

## 2. Para onde vai com 384 vias [A, confiança baixa]
- Cada fibra participa de ~29 pares (vizinhança ±2), então tem ~29 vezes mais ramos que no par de vias: da ordem de **1.500 ramos por fibra**.
- Com ~500 incidências por segundo por via (entre o grave e o agudo do ensaio; a taxa real com a gravação **não foi medida**), seriam ~**3 × 10⁸ chegadas por segundo de som**.
- Ao custo atual (~0,8 µs por chegada), **~200× mais lento que o tempo real** num núcleo (faixa plausível: 30× a 1.000×).
- **Conclusão:** chegar ao tempo real exige ganhar de **~200×**, combinando (a) motor mais eficiente, (b) muitos núcleos e (c) menos trabalho por mecanismos que a biologia tem e nós ainda não.

## 3. Desperdícios identificados no código atual [C: leitura do código]
1. **Laços sobre todos os ramos a cada incidência:** decaimento das forças, duas varreduras da eliminação competitiva e a busca dos ramos da fibra que recebeu a incidência percorrem **todos** os ramos (das duas fibras), a cada incidência de A. São ~4 varreduras para ~50 chegadas úteis.
2. **Verificação de "acerto recente" (quase-acerto):** percorre todos os ramos a cada contribuinte.
3. **Fila de eventos em heap binário:** custo logarítmico por evento; como os atrasos são limitados (≤ ~21 ms), uma fila por **baldes de tempo** faz o mesmo em custo constante.
4. **Inibição como evento separado:** cada chegada gera dois eventos na fila (excitação e inibição).
5. **Tudo num só núcleo:** os pares de fibras de canais distantes quase não interagem, mas rodam em série.

## 4. Plano de otimização, em fases (cada fase com prova de igualdade)

### Fase 1 — eficiência sem mudar nada (ganho estimado 3–10×) [A]
- **Decaimento preguiçoso:** guardar o instante da última atualização de cada ramo e aplicar o decaimento só quando o ramo for lido. Elimina a varredura por incidência.
- **Listas de ramos por fibra e por (Uint, lado):** a incidência percorre só os ramos da sua fibra; a eliminação e o "acerto recente" olham só o lado da Uint em questão.
- **Eliminação por temporizador:** verificar a eliminação num ritmo fixo (por exemplo, a cada 1 ms simulado) em vez de a cada incidência. **Atenção:** isso pode mudar o instante exato da eliminação; se mudar a saída, é decisão do responsável.
- **Fila por baldes de tempo** no lugar do heap.
- **Prova:** reproduzir exatamente as saídas de `confirmacao-correcoes-saida.csv` e `maturacao-saida.csv` (mesmas sementes).

### Fase 2 — paralelismo (ganho ≈ número de núcleos, para 384 vias) [A]
- A vizinhança anatômica divide a malha em pedaços com pouca troca (cada Uint recebe de poucas fibras). Proposta: dividir por **faixas de frequência sobrepostas** e rodar cada pedaço num núcleo, sincronizando a cada janela de tempo maior que o maior atraso mínimo entre pedaços.
- Na nuvem ou numa máquina com muitos núcleos (por exemplo, 32–64), isso sozinho dá dezenas de vezes.
- **Prova:** igualdade exata com a versão de um núcleo.

### Fase 3 — reescrever o núcleo quente (ganho 1,5–3×) [A]
- Ou em Rust (ganho modesto sobre o numba; ambos usam LLVM), ou numa **placa de vídeo (GPU)**. Existem simuladores de neurônios em GPU (de memória, por exemplo GeNN e NEST GPU — **não verifiquei agora**); o nosso caso tem eventos irregulares e estruturas que crescem, o que é mais difícil em GPU. Avaliar só depois das fases 1 e 2.

### Fase 4 — menos trabalho pelos mecanismos que faltam (ganho potencial grande; **muda o modelo**) [A]
- **Adaptação ao repetido** (adaptação específica ao estímulo; ver [investigação de tempo real](investigacao-tempo-real-e-tracos.md)): incidências previsíveis geram menos chegadas.
- **Atividade esparsa** e **rastros com prazo** mais estritos.
- Isso é **ciência**, não engenharia: cada item exige o método (mecanismo NB, mínimo, abstração) e a decisão do responsável.

## 5. Medida de custo (na fila, aprovada em 17/11) [A]
Antes e depois de cada fase: custo por segundo de som simulado **ao longo do aprendizado** (deve cair quando a Pcrt para) e com **1, 2 e 4 canais** (pares de fibras), para trocar a estimativa da seção 2 por números.

## 6. Ordem proposta
1. Replicação do conjunto B com 30 sementes (já na fila; ciência).
2. **Fase 1** + medida de custo (engenharia; prova de igualdade).
3. Fase 2 quando formos para várias faixas (degrau 4).
4. Fases 3 e 4 conforme a necessidade medida.
