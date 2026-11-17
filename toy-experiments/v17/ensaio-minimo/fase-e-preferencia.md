# V0.17 — Registro prévio: critério do agudo (equivalentes de fase) e controle da preferência da estrutura

**Estado:** **APROVADO** pelo responsável em 17/11/2026. **Redação:** assistente (Claude), 17/11/2026.
**Base:** [confirmação das correções e diagnóstico](resultados.md) (17/11); decisões do responsável: rever o critério do agudo; medir a preferência da estrutura. Motor: `motor_correcoes.py` com os conjuntos A, B e C, sem outra mudança de regra.
**Legenda:** [R] decisão do responsável; [A] proposta do assistente; [L] literatura.

## 1. Agudo: critério revisto [R: rever; A: forma]
- **Equivalentes de fase** de Δ num canal com períodos entre 0,6 e 0,9 ms: Δ ± k·T, k = 1 e 2, para qualquer T dessa faixa, com a mesma janela de 0,21 ms.
- **Uint sintonizada em fase:** ≥ 100 disparos no último episódio e ≥ 60% dos acertos em Δ **ou** nos seus equivalentes. **Presa no acaso:** ≥ 100 disparos e < 20% nesse conjunto.
- **Seleção em fase (agudo):** ≥ 1 Uint sintonizada em fase e nenhuma presa no acaso.
- **Novidade honesta:** os dados da confirmação já vistos (sementes 1–10) serão **reclassificados** por esse critério, mas isso é **exploratório** (o critério foi escrito depois de ver os dados). A leitura que conta usa **sementes novas (11 a 20)**.
- **Leitura (fixada agora):** um conjunto passa no agudo se a seleção em fase for **≥ 8 de 10** nas sementes novas. O grave continua com o critério de antes (a relação Δ, não os equivalentes).

## 2. Controle da preferência da estrutura [R: medir; A: forma]
- **Ideia:** deslocar a relação verdadeira do mundo. Se, com notas, o sistema acompanhar o deslocamento, quem escolheu foi o **mundo**. Se, com período fixo, ele continuar preferindo diferenças pequenas, essa é a **preferência da estrutura**.
- **Condições:** Δ ∈ {0,458 (referência); 1,5; 3,0 ms} (engenharia: valores fora da cabeça real, só para o controle); grave; notas e período fixo (5 ms); I1; conjuntos A, B e C; 10 sementes = **180 execuções**.
- **Medidas:** a mesma classe do grave, com Δ do mundo; a **diferença preferida (mediana)** das Uints sintonizadas; a fração dos acertos em Δ, em Δ − 5 ms e em Δ + 5 ms (equivalentes do período fixo).
- **Previsões:** (1) com notas, a diferença preferida acompanha Δ (0,46; 1,5; 3,0) e a seleção fica ≥ 8 de 10 nos três valores; (2) com período fixo, a escolha entre Δ e Δ ± 5 ms depende dos atrasos disponíveis e **não** acompanha Δ de forma consistente.
- **Leitura (fixada agora):** se a previsão 1 falhar (seleção < 8 de 10 em algum Δ com notas), o resultado do grave fica sob suspeita de vir da estrutura, e se leva ao responsável antes de qualquer passo. A previsão 2 é descritiva (mede a preferência), sem critério de passagem.

## 3. Tamanho
180 (controle) + 30 (agudo, sementes novas, 3 conjuntos) = **210 execuções**; estimativa de alguns minutos (confiança média).
