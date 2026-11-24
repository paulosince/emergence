# V0.19 — O que falta para implementar (conferência de 23/11/2026)

**Pedido do responsável:** listar o que falta discutir antes de implementar, conferindo tudo com calma. **Redação:** assistente (Claude), depois de reler `decisoes-em-construcao.md`, `regra-de-criacao-rascunho.md`, as decisões da V0.18 e os documentos de `docs/`.

**Resposta curta:** **ainda não temos tudo.** Há lacunas que impedem escrever o código (A), lacunas de material de teste (B), e itens que posso propor com base no modelo neurobiológico para o responsável aprovar (C).

## A. Bloqueiam a implementação (decisões científicas do responsável)

1. ~~**Como cresce uma Upro sem destino** e **onde a Ustr cria uma Uint.**~~ **Decidido (24/11):** cresce rumo aos fracassos vivos no registro das Ustr vizinhas, em tempo estrutural simulado entre sessões no ritmo do modelo neurobiológico; a Uint nasce onde Upros com fracassos coincidentes se encontram; o crescimento para ao formar ramo ou quando a janela permissiva fecha. **Vai para o pacote de números:** duração do rastro dos fracassos (precisa cobrir o crescimento entre sessões), passo de crescimento, ramificação durante o crescimento e quantas candidatas por coincidência.
2. ~~**A escala do espaço e a velocidade de propagação.**~~ **Decidido (23–24/11):** espaço em cubos de ~20 µm; velocidade basal de 0,3 m/s; atraso sináptico dentro do tempo de integração da Uint.
3. ~~**A posição 3D da borda** e das glias iniciais.~~ **Decidido (24/11):** faixa desenrolada por frequência e sensibilidade, um ponto por cubo; glias espalhadas por igual ao lado da faixa. Distância entre os ouvidos **confirmada**: ~10 cm, nas posições dos microfones.
4. ~~**Os números da Uint:**~~ **Aprovado no pacote (24/11).** janela de integração (já decidida com componente rápida e lenta, mas sem valores para esta via), limiar, janela de refratariedade e reserva de efeito da Uint. **Inclui agora o tempo mínimo entre a chegada e o disparo**, que responde pelo atraso sináptico (decisão de 24/11).
5. ~~**De onde saem as Upros inibitórias.**~~ **Decidido (24/11):** só Upros que saem de Uints; trocam de sinal ao estabilizar. A saída da Utrd é 100% excitatória (V0.18), então os 20% só podem valer para Upros que saem de Uints. Falta confirmar, e decidir **quando** a troca de sinal acontece.
6. **O calendário das sessões:** duração de cada sessão, quantas apresentações, intervalo entre sessões e o tempo simulado entre elas. As regras aprovadas falam em ~1 h para estabilizar e 1–4 dias para sumir; sem calendário, essas regras não chegam a agir.
7. ~~**O que é a condição "com relações entre Ustr"**~~ **Decidido (24/11):** fracassos da fronteira compartilhados nos cubos sobrepostos; (o que uma Ustr passa à vizinha e como). **Proposta registrada (24/11):** sobreposição leve dos territórios = "com relações"; territórios exclusivos = "sem". Falta o que passa de uma à outra.
8. **O critério de "em sua maioria"** e **como medir** que a reapresentação passou pela malha já vinculada.
9. **O controle de especificidade** (uma obra diferente nas sessões de uso), que ficou sem decisão.
10. **O registro prévio, congelado antes de rodar** (lição da V0.17: pré-experimento não congelado).

## B. Material de teste

11. **As 4 gravações da Gymnopédie n.º 1:** confirmar licenças, baixar (o responsável), e escolher quais 2 para aprendizado e quais 2 para conferência. Só a de Robin Alciatore está no repositório.
12. **A fonte em movimento:** o som sintético ficou sem decisão (o responsável perguntou "por que A?" e a explicação foi dada); faltam os pontos de partida e chegada e a velocidade; e a implementação na cena, em código da V0.19, sem alterar a V0.18.

## C. Posso propor pelo modelo neurobiológico (aprovação do responsável)

13. ~~Forma da regra do ramo~~ **Aprovado no pacote (24/11).** (promoção e punição): janelas e tamanho da mudança por par (Bi e Poo 1998; Feldman 2012).
14. ~~Números da Ustr:~~ **Aprovado no pacote (24/11); capacidade a calibrar no primeiro ensaio.** tamanho do território, capacidade (fracassos por tempo), duração da janela permissiva, tempos da marca à remoção.
15. ~~Números da Utad:~~ **Aprovado no pacote (24/11).** faixa de velocidades, critério de estabilização, duração da janela (Hines et al. 2015: amostragem nas primeiras horas).
16. ~~Os textos das simplificações a declarar:~~ **Rascunho aprovado no pacote (24/11).** construção determinística; atraso sináptico dentro do tempo de integração da Uint (24/11); astrócito e micróglia juntos na Ustr; constante glial do córtex de camundongo; efeito por Upro com ramos iguais; proporção de neurônios aplicada a Upros; mesmo tipo na mesma organização.

## D. Viabilidade (engenharia, a medir antes de codar)

17. **Custo:** a borda gera ~1–2 milhões de incidências por segundo por ouvido em música; uma Gymnopédie de ~3 min dá centenas de milhões por apresentação, antes do Sdom. É preciso medir e talvez decidir trechos mais curtos (decisão do responsável).
18. Instrumentação: marcar cada estrutura com a sessão em que nasceu; interface no GitHub Pages (`v19/index.html`). **Estética pedida (24/11):** fundo azul-marinho escuro, linhas de luz azul elétrica com miolo branco, painéis de interface com contorno fino e cantos chanfrados, anéis holográficos (referência: fotos do responsável; sem personagens nem marcas).

## E. Em reflexão pelo responsável (não bloqueiam o primeiro código, mas entram na regra)

19. A redação do tempo como condição e como conteúdo.
20. O nível de "episódio": entra na V0.19 ou fica para depois?

## Ordem de discussão (pedida pelo responsável em 23/11: primeiro o que pode responder outros)

| Ordem | Item | Destrava |
|---|---|---|
| 1 | 2 — escala do espaço e velocidade de propagação (**decidido 24/11**) | 3, 1, 14, 15 |
| 2 | 3 — posição 3D da borda e das glias iniciais (**decidido 24/11**) | 1, 14 |
| 3 | 1 — crescimento da Upro e criação da Uint (**decidido 24/11**; detalhes numéricos no pacote) | 5, 7, 14 |
| 4 | 4 — números da Uint | 13, 8 |
| 5 | 13 — regra do ramo (promoção e punição) | 6 |
| 6 | 5 — Upros inibitórias: de onde e quando | — |
| 7 | 14 e 15 — números da Ustr e da Utad | 7, 6 |
| 8 | 7 — relações entre Ustr | — |
| 9 | 17 — custo medido | 6, 11 |
| 10 | 6 — calendário das sessões | 8 |
| 11 | 9 — controle com obra diferente | 11 |
| 12 | 11 e 12 — gravações e fonte em movimento | — |
| 13 | 8 e 18 — critério, medida e instrumentação | 10 |
| 14 | 16 — textos das simplificações | 10 |
| 15 | 10 — registro prévio congelado | implementação |
| — | 19 e 20 — em reflexão (a qualquer momento) | — |
