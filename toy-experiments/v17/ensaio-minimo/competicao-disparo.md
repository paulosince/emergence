# V0.17 — Registro prévio (adendo): competição ligada ao disparo

**Estado:** RASCUNHO para aprovação do responsável. Nada de código antes da aprovação.
**Redação:** assistente (Claude), 17/11/2026. **Base:** [investigação da competição](../investigacao-competicao.md); decisão do responsável de 17/11: "ligada ao disparo".
**Relação com o registro anterior:** acrescenta uma regra ao [motor por eventos](pcrt-incidencias.md); todo o resto fica igual (Pcrt restrita às incidências, quase-acerto na Uint, broto condicionado a acerto recente).
**Legenda:** [R] decisão do responsável; [A] proposta do assistente (a aprovar); [L] literatura.

## 1. A regra

**Origem [L]:** Song, Miller e Abbott 2000: chegada antes do disparo fortalece; depois, enfraquece; enfraquecimento = 1,05 × fortalecimento; a regra não fortalece nada se o neurônio não dispara.

1. **Quando a Uint dispara** (soma ≥ 1,5) no instante T, cada ramo cuja chegada caiu **antes**, em [T − 1,5 ms, T], ganha DF × exp(−(T − x)/τ); cada ramo cuja chegada cai **depois**, em (T, T + 1,5 ms], perde 1,05 × DF × exp(−(x − T)/τ). [R: forma; A: janela de 1,5 ms = 5 constantes de tempo da Uint]
2. **Enquanto a Uint não dispara**, o reforço no favorecimento continua como hoje (fase não hebbiana). [R] **"Não dispara"** = nenhum disparo nos últimos **X** segundos. [A: X a mapear]
3. Depois que a Uint volta a disparar, o reforço no favorecimento **para** e só vale a regra 1. O enfraquecimento por sincronia continua. [A]
4. **Valor de DF** igual ao atual (0,0065). [A]

## 2. Números a mapear [A]
- **τ** da janela: **0,30 ms** (a constante de tempo da própria Uint) e **1,0 ms**. Em Song 2000 a janela é de 20 ms, num neurônio de córtex; para o som, a escala deve ser bem menor, mas não achei o valor (Gerstner 1996 lido só no resumo).
- **X:** **10 s** e **60 s**.
- Fixos, porque não mudaram nada na etapa A: quase-acerto 0,75, janela do acerto recente 60 s, sem enfraquecimento do isolado.

## 3. Previsões (escritas antes de rodar) [A]
1. Os vizinhos colados param de empatar: o que chega primeiro antes do disparo ganha, e os de trás perdem. Esperado: **menos ramos na região** e **força máxima maior** que na etapa A (~0,25).
2. As **cópias** em atrasos diferentes podem continuar divididas, porque chegam a milissegundos de distância, fora da janela do disparo.
3. **Risco:** se a Uint deixar de disparar logo após o brotamento (como na etapa A), a regra 1 quase não age, e o resultado fica parecido com a etapa A.

## 4. Ensaio
**Grade:** grave e agudo; notas; I1; 10 sementes; τ (0,30; 1,0 ms) × X (10; 60 s) = 4 combinações × 2 faixas × 10 = **80 execuções**.
**Medidas:** classe, crédito, **parte da força na região** e número de ramos nela, força máxima, disparos, estabilizações, insumo da Pcrt, tempo.
**Regras de leitura (fixadas agora):**
- No grave, alguma combinação com seleção em **≥ 8 de 10**: ela segue para a etapa B do registro anterior (confirmação completa).
- **4–7 de 10:** levar ao responsável com o diagnóstico (força, disparo), sem ajustar nada.
- **≤ 3 de 10:** parar e levar ao responsável.
- O agudo é lido à parte, como achado.
- **Parada:** execução acima de 30 min é interrompida e registrada.
