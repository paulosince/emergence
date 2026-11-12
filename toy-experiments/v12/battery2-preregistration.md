# V0.12 — Bateria 2: pré-registro operacional

**Status: congelar antes da primeira execução.** Bateria exploratória posterior ao PDF candidato. O mecanismo de `src/model.js` não será alterado.

## Pergunta e alternativas
Uma história de incidências altera a propagação de maneira espacialmente específica, formando percursos operacionalmente diferenciados, ou apenas muda uma difusão geral?
- **H0:** diferenças aprendidas não excedem o que controles pareados e permutados explicam; nenhuma Upro identificada.
- **H1:** diferenciação espacial e dependência de intervenções seletivas surgem, sem que isso isoladamente demonstre Upro constituída.
- **H2:** diferenças dependem de escala/limiar de leitura e desaparecem sob sondas robustas.
- **H3:** o meio propaga, mas não individualiza percursos com o critério operacional abaixo.

## Critério de Upro — exigência, não rótulo pré-programado
Uma Upro candidata deve apresentar: (i) transmissão realizada por sucessão de interações locais com latência; (ii) organização de dependências distribuídas que individualize um percurso frente a alternativas; (iii) dependência da história de incidências; (iv) intervenção que discrimine esse percurso de controles de igual custo/posição; (v) continuidade e possibilidade de transformação. A identificação é **externa** e posterior à dinâmica. Não concluir Upro a partir de uma única resposta remota, da seleção geométrica de um alvo ou de uma diferença de g.

## Experimento
- A (plasticidade), C (g fixo), D (plasticidade com g permutado), B (g inicial .001), geometrias originais e transladadas; mesmos 480 ticks de treino e 120 de repouso da primeira execução.
- Sondas independentes A e B, 72 ticks, limiares de observação 1e-6, 1e-5, 1e-4; plasticidade congelada.
- Medir em **todas** as células: latência e resposta; não escolher destino de acordo com o resultado.
- Comparar A–C e A–D por erro L1 normalizado das respostas espaciais; registrar também a distância de D a C. Controle B como teste de limite de transmissão, não comparador equivalente de plasticidade.
- Intervenções: ablar cada célula interna (excluindo fontes), repetir sonda, registrar mudança espacial total; confrontar distribuição de impactos com controle C e D. Ablação não é prova de percurso.
- Sementes 11,41,73 para D; A/B/C determinísticos e não devem contar como três replicações.
- Testar resposta à fonte A e B separadamente; ausência de não linearidade não decide Upro.

## Regras de decisão
Diferenciação espacial se sustenta somente se A diferir de C e de D em medidas distribuídas e intervenções, com robustez a limiares e geometrias. Mesmo nesse caso, **Upro permanece candidata** até que individualização e dependência histórica não possam ser explicadas por simples difusão anisotrópica. Se diferenças forem pequenas ou não discriminantes, reportar resultado negativo/inconclusivo, sem ajustar parâmetros retroativamente.

## Limitações declaradas
Topologia potencial preexistente; g modifica difusão local; fonte e alvo são observacionais; não há criação topológica, Uint ou representação. Não há novos mecanismos nesta bateria. Registrar código, dados, falhas e interpretação separadamente.
