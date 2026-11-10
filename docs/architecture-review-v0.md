# Revisão da arquitetura atual — v0 (em andamento)

Iniciada em 10/11/2026 com o responsável. Passamos unidade por unidade: o que o motor v2 faz hoje (`src/engines/constitutive/engine-v2.js`) e o que o responsável define. Nada implementado ainda.

## 1. Utrd (unidade de transdução)

### Definição do responsável (10/11/2026, 15h52)
- O que se usa aqui é **transdução representacional**, não qualquer transdução física.
- A Utrd faz a intermediação entre **tudo o que está fora do domínio representacional** e o domínio, nos dois sentidos:
  - **aferente:** sinais **exógenos** (de fora do sistema) ou **endógenos** (de dentro do sistema, mas de fora do domínio) → domínio;
  - **eferente:** domínio → dentro do sistema (endógeno). A eferência só chega até dentro do sistema; as consequências no mundo dependem dos atuadores.
- A Utrd promove toda transformação necessária: na aferência, sinais elétricos, mecânicos, de temperatura etc. viram **incidências**; na eferência, incidência vira sinal no **canal atuador adequado**.

### Conferência com a teoria
- CLEAR v43 (trechos lidos pela busca do projeto): a Utrd "realizes the conversion between media"; rotas aferentes exógenas e endógenas até o Sdom (Figura 1). **Compatível.**
- O sentido eferente aparece explícito no preprint v2.1.0 (processo de transdução eferente, Ptef), desatualizado; nos trechos da v43 lidos, a figura mostra só rotas aferentes. A definição acima é do responsável.

### O motor v2 hoje (diferenças)
1. A Utrd não é uma unidade: é só um identificador de canal; a conversão acontece fora do motor.
2. Só existe o sentido aferente; não há Utrd eferente.
3. A conversão é mínima: emite magnitude 1 e efeito 0 quando a medida muda (a decisão de 10/11 é magnitude pela variação).
4. Não há fontes endógenas (interocepção) ainda.

### A confirmar com o responsável
- (a) A Utrd eferente leva só aos atuadores, ou também a outros sistemas internos fora do domínio (por exemplo, o sistema modulador)?
- (b) A ligação Utrd eferente → canal atuador é fixa, dada pelo corpo (como o motoneurônio e o músculo), ou também se forma?
