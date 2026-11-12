# V0.12 — Adendo operacional à Etapa II (antes da execução)

**12/11/2026.** O PDF da Etapa I permanece inalterado e candidato; este adendo explicita escolhas de engenharia não congeladas naquele PDF. **Classificação de qualquer execução subsequente: exploratória, não confirmação pré-registrada integral.** Não promover resultados a validação da hipótese principal.

## Desenho inicial
Malha 8×6×4; 24 vizinhos ortogonais potenciais por célula no máximo 6; nenhuma Uint/Upro, destino, origem ou classe de coincidência na dinâmica. Atividade escalar v≥0; interações por fluxo local g(v_i-v_j); dissipação 0.97/tick. Fontes em [1,1,1] e [1,4,2], pulsos de amplitude 1 nos ticks múltiplos de 12 durante treinamento. Cada braço recebe o mesmo calendário de incidências. Tempo medido por passos de propagação, não por atraso programado. Parâmetros são **escolhas instrumentais**, sem equivalência NB alegada.

A: todas as adjacências ortogonais inicialmente g=.06; plasticidade local g←clip(g+0.0009(|flux|−0.002),.001,.14). B: mesmas adjacências *potenciais*, inicialmente g=.001; habilitação progressiva pela mesma regra, sem criar nova adjacência física. B é desbloqueio de espaço potencial codificado, não criação topológica autônoma. C: mesmas adjacências de A, g fixo. D: treinamento como A e permutação determinística dos g finais entre arestas antes de sondagem; preserva distribuição e rompe posicionamento, não pareia todos os efeitos espaciais.

Treino: 480 ticks; repouso: 120 ticks sem incidências; sonda: uma única fonte, 72 ticks, plasticidade congelada durante a sonda para separar transporte de aprendizagem. Sementes [11,41,73], geometrias fonte original e transladada. Controles de ablação intermediária e controle distante definidos a partir de geometria, sem escolha posterior de aresta reforçada. Medidas: g médio e dispersão, diferenças de resposta e tempos de chegada por limiar observacional 0.00001; tais limiares não existem no mecanismo. Análise de Uint/Upro exige testes adicionais de individualização e dependência coletiva, não inferir do observável de limiar.

**Parada interpretativa:** resultado de B não testa constituição de nova adjacência; A/B não equivalem a NB; não usar não aditividade isolada para identificar Uint; não atribuir representação. Código e execução documentados na Etapa II; dados e conclusões somente na Etapa III.
