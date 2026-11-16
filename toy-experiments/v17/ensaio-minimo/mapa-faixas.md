# Mapa de sensibilidade — faixas e classificação, registradas ANTES de rodar

**Data:** 16/11/2026. **Decisão do responsável:** opção (c), faixas pela literatura e mapa dentro delas. **Estatuto:** controle de engenharia, antes do congelamento da V0.17. Este arquivo foi versionado antes de qualquer execução do mapa.

## 1. O que a literatura indica (resumos e trechos; Song et al. lido no PDF por extração)

1. **Ganho por pareamento é pequeno.** No modelo clássico de plasticidade dependente do tempo, cada pareamento muda o peso em 0,5% do máximo (A+ = 0,005), e o enfraquecimento é um pouco maior que o fortalecimento: A−/A+ = 1,05. Os autores afirmam que o enfraquecimento dominar o fortalecimento "is critical for stability" (Song, Miller e Abbott, 2000, *Nat. Neurosci.* 3:919–926). Com 60–100 pareamentos típicos (Feldman, 2012), isso dá a ordem de 1% por pareamento. A faixa aceita pelo responsável (10–100 acertos) corresponde a +0,0065 a +0,065.
2. **O enfraquecimento clássico depende do tempo em relação à resposta da célula**, não da simples falta de coincidência: entrada que chega **depois** da resposta enfraquece (Bi e Poo, 1998; van Rossum et al., 2000). É a mesma ideia da regra de sincronia do Sdom ("enfraquecer quando a incidência chega depois do disparo do nó seguinte").
3. **Há também enfraquecimento só pelo padrão da entrada**, sem atividade da célula que recebe, no desenvolvimento do córtex (p-LTD; estudo PMC3542421, trechos). Magnitude não levantada.
4. **Sinapses novas costumam nascer "silenciosas"**: só com receptores NMDA, sem transmissão em repouso, e são "ligadas" quando a entrada coincide com despolarização (revisão de Kerchner e Nicoll, 2008, e estudos citados; trechos). Ou seja, nascem quase sem força, mas já capazes de detectar coincidência.
5. **Espinhas novas vivem horas a dias** (rodadas anteriores); a meia-vida de 30 s é compressão forte.

## 2. Faixas varridas

| Parâmetro | Valores | Origem |
|---|---|---|
| Ganho por acerto (DF) | 0,0065; 0,02; 0,065 | 100, ~30 e 10 acertos (faixa aceita; item 1) |
| Modo de enfraquecimento | (S) sincronia: −1,05 × DF quando a chegada vem 1 a 3 janelas depois de um momento favorecido da Uint e não é acerto; (C1) por chegada sem coincidência: −0,05 × DF; (C2) por chegada sem coincidência: −0,154 × DF (a proporção da D20) | itens 1–3; S é proposta do assistente para operacionalizar a regra de sincronia do Sdom |
| Força inicial (f₀) | 0,10; 0,15 | D3 e D3′ |
| Meia-vida dos instáveis | 30 s; 300 s | D20; item 5 |
| Força mínima para brotar | f₀; 0,30 | D23 e alternativa |

Fixos: janela 0,21 ms; constante 0,30 ms; favorecimento ≥ 0,3; inibição pré-alimentada −0,5 uma janela depois; total 1,0 por Upro; brotar após 5 quase-acertos, ±10%; estável = acertos espaçados ≥ 2 min e força ≥ 0,5; some após 10 min sem acerto.
Total: 3 × 3 × 2 × 2 × 2 = **72 combinações**, cada uma em **duas condições**: período fixo de 5 ms e período mudando a cada 250 ms (como notas). 5 episódios de 10 s, um a cada 3 min. Semente 1.

## 3. Classificação (fixada antes de rodar)

Medida no último episódio:
- **Colapso:** nenhum acerto.
- **Explosão:** mais de 100 ramos no total (A + B) ou mais de 200 relações diferentes acertando.
- **Seleção:** crédito na relação verdadeira ≥ 0,6 **e** o ramo mais forte de A com o mais forte de B formam a relação verdadeira (a menos de uma janela de 0,458 ms).
- **Difuso:** todo o resto.

O mapa **não escolhe** valores: mostra onde cada classe aparece. A escolha é do responsável.

## 4. Confirmação com 10 sementes (registrada antes de rodar, 16/11/2026)

Conjunto candidato: ganho 0,0065; meia-vida 300 s; força inicial 0,15; enfraquecimento por sincronia (S); portão de broto **0,30** e, como variante, **0,15**. Condições: fixo e notas. Sementes 1 a 10. Mesma classificação da seção 3.
**Critério de confirmação:** seleção em pelo menos **8 de 10** sementes na condição de notas (a mais parecida com música). A condição fixa é relatada, sem critério.
