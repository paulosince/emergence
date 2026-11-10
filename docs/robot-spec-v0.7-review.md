# Revisão da especificação "CLEAR Robotics V0.7" (10/11/2026)

Especificação recebida do responsável na conversa de 10/11/2026 (elaboração independente). Esta revisão confere com a CLEAR v43, com as decisões registradas nesta sessão (docs/effects-v0.1.md, docs/engine-v2-design-proposal.md, docs/robot-design-v0.md) e com a neurobiologia.

## Compatível
- Separação S / Utrd / processos constitutivos / Sdom, e começar sem nenhuma representação: v43 L77 ("Utrd and Pcrt can operate before Sdom… the first representation inaugurates Sdom"). O motor v2 já começa sem unidades.
- Sem semântica injetada; identificadores opacos (já praticado nos mundos atuais).
- Reflexos fora do domínio, isoláveis (R-07); proteções independentes (R-09).
- Testes T01–T12 (ablação, inversão, perturbação, persistência, reinicialização).
- 14 atuadores: 2 rodas + 2 ombros + 2 cotovelos + 6 dedos + 2 do pescoço.

## Conflitos com decisões já registradas (qual vale?)
1. Caixa de ~18 cm impressa em 3D × caixa de 25 cm aprovada e materiais de custo zero (pote de sorvete).
2. Incidência: a V0.7 deixa magnitude e efeito em aberto; nesta sessão foi decidido: efeito acrescentado pelas unidades (soma, limitado a −1…+1), magnitude 0–1 multiplicativa, incidências só de transdução ou marca-passos. O motor v2 implementa isso (a incidência em trânsito carrega m e e para que as unidades os modifiquem).
3. "Uint: fontes externas distintas" × decisão: fontes distintas = Upro diferentes, mesmo com origem comum.
4. "Upro: uma incidência por vez" × motor v2: uma Upro pode ter várias incidências em trânsito (linha de atraso).
5. Áudio PCM direto × decisão de uma cóclea (banco de faixas) entre microfone e Utrd. A cóclea é transdução física (decomposição em frequência), não semântica.
6. Movimentos: a V0.7 só tem R1–R4; foi decidido que nesta fase os movimentos vêm de reflexos primitivos e de movimentos espontâneos por marca-passos.
7. Foi decidido que o domínio recebe as incidências dos reflexos; a matriz de transdução (seção 9) não inclui os comandos dos reflexos como fonte.

## Problemas técnicos
1. **Toque em si mesmo:** ombros com um eixo movem os braços só no plano lateral; as pontas dos dedos não alcançam as regiões frontais do tronco. O toque duplo (tocar o próprio corpo) é um sinal importante para o esquema corporal (conhecimento geral sobre desenvolvimento infantil; fonte a buscar).
2. **Pele esparsa:** 10 regiões (dedos e frente) deixam laterais, costas, topo, braços e palmas sem tato; colisões por trás ou pelo lado só apareceriam no IMU. Para limites do corpo, sugerimos mais regiões (pele capacitiva de custo quase zero).
3. **R1 só com velocidade angular:** equilibrar um pêndulo invertido exige também a inclinação (e, na prática, a velocidade das rodas); só com o giroscópio a postura deriva. O reflexo pode usar a inclinação internamente (está em S) sem entregá-la ao domínio.
4. **Visão 320 × 240 a 15–30 Hz:** com uma Utrd por pixel e ruído do sensor, seriam milhões de incidências por segundo. Sugestão: agrupamento físico justificado (média de blocos 4 × 4 → 80 × 60 por olho, como a convergência na retina) e emissão só acima de uma variação mínima.
5. **Áudio a 24 kHz:** passo de ~42 µs; a maior diferença de tempo entre os ouvidos (~0,29 ms com 10 cm) cabe em ~7 passos. Funciona, mas é grosseiro; 48 kHz dá ~21 µs. Exige microfones sincronizados no mesmo conversor.
6. **Tensão dos tendões:** difícil de medir a custo zero; alternativas: corrente do servo ou elástico com potenciômetro.
7. **Simulação (R-02):** precisa de motor de física com contatos e renderização para as câmeras em JavaScript; candidatos a avaliar: Rapier (WASM), cannon-es, three.js. Determinismo a verificar.

## Seção 11 (o que permanece aberto)
Parte do que a V0.7 lista como aberto foi decidido nesta sessão (efeito, magnitude, origem das incidências, Uint com ≥ 2 Upro, surpresa, maturação). Outra parte segue aberta (critérios completos de representação e acesso; via eferente do domínio aos atuadores).
