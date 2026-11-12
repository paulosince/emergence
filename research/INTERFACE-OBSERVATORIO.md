# Interface de observação — decisões da terceira geração

**Versão:** 11/11/2026. **Estatuto:** consolidação documental; decisões do responsável separadas de propostas de engenharia. Fonte histórica: [observatório v0](../docs/observatory-interface-v0.md).

## Princípio inegociável

**[D] O experimento roda ininterruptamente na máquina do responsável; a interface consulta e reproduz a gravação.** A interface não é o motor e não decide o que acontece no Sdom. A existência de botão de pausa da reprodução **não** pausa o experimento.

## Decisões do responsável

- [D] Central de múltiplas câmeras, com visões simultâneas ou selecionáveis.
- [D] Câmeras: dois cantos altos, vista superior, olhos esquerdo e direito do robô, câmera acompanhando o robô.
- [D] Navegação por data e hora; play, pausa da reprodução, avançar e retroceder.
- [D] Trilhas sincronizadas, semelhantes a editor de vídeo: áudio, modalidades sensoriais, métricas, logs, eventos, legendas, alterações estruturais.
- [D] Mapa **tridimensional** do Sdom com zoom, posições reais das unidades, atividade/incidências em propagação, surgimento, modificação e eliminação de Uint/Upro e outras unidades.
- [D] Mostrar dispersão espacial de **cada um dos cinco neuromoduladores**, com seleção e escala legível.
- [D] Distinguir nós novos, persistentes e podados; relações por espessura/peso e atrasos, sem confundir peso visual com propriedade teórica não aprovada.
- [D] O observador não injeta categorias representacionais no motor; Utrd identificadas por canais opacos internamente.

## Propostas técnicas a validar

- [P] Registrar **estados e eventos**, não vídeos fixos: poses, ambiente, estado da malha, liberações e incidências, para reconstruir perspectivas.
- [P] Checkpoints completos + eventos ordenados com relógio científico; reprodução reversa por checkpoint anterior e reaplicação de eventos.
- [P] Trilhas de fontes sonoras e/ou saídas da cóclea; síntese apenas na reprodução.
- [P] Interface pode usar armazenamento local/servidor do computador; formato, acesso remoto e autenticação ainda abertos.
- [P] Medidas de compressão, retenção, indexação, integridade, custo diário e velocidade de busca dependem de benchmarks.

## Garantias científicas

- A reprodução deve mostrar o estado histórico **como registrado**, não recomputar com uma versão nova do motor sem indicação.
- Toda imagem/métrica precisa apontar para instante, versão, sessão e origem dos dados.
- Logs devem permitir perguntar **por que** determinada Uint/Upro surgiu, não apenas mostrar que surgiu.
- Exibir separadamente evento bruto, métrica derivada e interpretação científica.
- A renderização não interfere no relógio da simulação; lacunas de gravação precisam ficar visíveis.
- Não transformar layouts 3D ou agrupamentos de interface em evidência de topologia neurobiológica.

## Em aberto

Formato e volume de gravação, taxa de checkpoints, política de retenção, sincronização áudio/vídeo/malha, filtros, exportação CSV, comparação entre sessões, níveis de detalhe, auditoria de causalidade e eventual acesso remoto.

**Não migrar** arquivos do observatório antigo; esta é a especificação de referência para arquivos novos.
