# Guia de continuidade do EMERGENCE (para qualquer assistente)

Leia **inteiro** antes de mudar qualquer coisa. Atualizado em 09/11/2026.

## 1. Regras inegociáveis
1. **Metodologia** ([docs/program-methodology.md](docs/program-methodology.md)):
   - o modelo é o neurobiológico (não só humano);
   - divergir dele só com simplificação agnóstica de substrato **justificada**: mecanismo entendido, equivalência proposta e perdas declaradas e testáveis.
2. **Decisões científicas são do responsável** (mecanismo, critérios, limiares, equivalências). Proponha com recomendação, mas **não decida**. Registre em [docs/decisions-log.md](docs/decisions-log.md).
3. **Nunca invente fontes nem números.** Diga se leu o resumo ou o texto integral e a confiança de cada número. Se não achar, diga e peça ao responsável.
4. **Nomes, não códigos** ([docs/nomenclature.md](docs/nomenclature.md)). Indique se cada regra vem da literatura ou é proposta ou inferência nossa.
5. **Não alterar o repositório TEMPO** (paulosince/temporotopological-relations); a cópia em `vendor/tempo` é só leitura.
6. **Não marcar item do roteiro como concluído** sem teste, evidência registrada e validação do responsável.
7. **Separação observador × motor:** nada calculado pelo pesquisador (disposições 3D, agrupamentos, métricas) entra no motor.
8. **Nenhum critério do pré-registro é avaliado no motor candidato** antes da aprovação do pré-registro revisado.
9. **Segurança** (o protocolo PPC/ADCIF está pausado, mas o envelope vale):
   - nada de corpo, variável regulada ou modulação por valor antes das fases previstas;
   - detectores de self, Orientação e valia levam a **parada que falha fechada**.
10. A cada proposta ou precedente novo, atualizar [docs/innovation-tracking.md](docs/innovation-tracking.md).
11. Git: trabalhar no ramo `claude/zealous-hawking-sdw2w8`; commit e push a cada passo; não abrir pull request sem pedido.

## 2. Como verificar o estado
- `npm test` (251 testes passando em 09/11/2026). Node ≥ 20, sem dependências.
- Roteiro e progresso: [docs/roadmap.md](docs/roadmap.md), etapa 11 (32 itens).
- Diário do motor: [docs/constitutive-engine-v0.md](docs/constitutive-engine-v0.md).

## 3. Onde estamos
- **8 de 32 itens concluídos** (fase de preparação, exceto o pré-registro).
- **Pré-registro** ([docs/preregistration-v1.md](docs/preregistration-v1.md)): calibrado ([docs/calibration-v1.md](docs/calibration-v1.md)). Critérios de engrama validados. **Precisa ser revisado** com as decisões de 09/11 (recrutamento, estabilidade em cascata, portão modulador, separação substrato × envelope, série de escala) e **aprovado** pelo responsável.
- **Primitivas do motor (em andamento):**
  - prontos e testados: difusão (`src/space/diffusion.js`); espaço constitutivo (`src/space/constitutive-space.js`); relógio do tipo Goodwin (`src/rhythm/clock.js`); marca-passo (`src/rhythm/pacemaker.js`); motor, incremento 1 (`src/engines/constitutive/engine.js`).
  - **Achado do incremento 1:** sem portão e sem poda, a mesa gera cerca de 1.700 unidades por segundo. Os mecanismos do incremento 2 são necessários.

## 4. Próximos passos, em ordem
1. **Incremento 2:** estabilidade em cascata ([docs/consolidation-decay-v0.1.md](docs/consolidation-decay-v0.1.md)) e portão modulador de três fatores. Inclui:
   - fontes de novidade e de incerteza esperada como **marca-passos** que liberam no campo de difusão;
   - receptores por tipo e nível, com dessensibilização e regulação lenta;
   - capacidade por elemento.

   **Sucesso:** a taxa de criação na mesa dentro do envelope, sem perder as unidades das quedas.
2. **Incremento 3:** inibição lateral; níveis predefinidos sem conteúdo, com a recursão livre como variante.
3. **Incremento 4:** ciclo imposto (relógio → marca-passos do relógio → interruptor de estado); sono com reativação, renormalização e decaimento regulado.
4. Revisar o pré-registro e **pedir aprovação**.
5. Contrato de checkpoint; monitor; alertas; campanha (com a série de escala de 1.000, 10.000 e 100.000 elementos).

## 5. Documentos de desenho (ler antes de implementar)
- [docs/decisions-log.md](docs/decisions-log.md): tudo o que foi aprovado.
- [docs/mesh-rules-v0.1.md](docs/mesh-rules-v0.1.md): inventário de regras.
- [docs/neurobiological-divergence-review-v0.1.md](docs/neurobiological-divergence-review-v0.1.md): divergências e equivalências.
- [docs/neuromodulation-v0.1.md](docs/neuromodulation-v0.1.md) e [docs/modulatory-units-v0.1.md](docs/modulatory-units-v0.1.md): neuromodulação.
- [docs/spatial-diffusion-v0.1.md](docs/spatial-diffusion-v0.1.md): difusão, com os parâmetros medidos e suas fontes.
- [docs/pacemakers-v0.1.md](docs/pacemakers-v0.1.md): marca-passos e relógio.
- [docs/engram-criteria-v0.1.md](docs/engram-criteria-v0.1.md): critérios.
- [docs/research-design-v0.1.md](docs/research-design-v0.1.md): desenho geral, detectores e riscos.

## 6. Armadilhas já encontradas
- **Latência dos instrumentos imita estrutura do mundo.** Sempre usar o controle de latências igualadas e embaralhadas.
- **Fluxos aleatórios** (mundo, sensores, controles) precisam de sementes independentes.
- **Contar unidades não mede formação**; necessidade sem conteúdo não é representação.
- **Obstáculos convexos dão tortuosidade de no máximo cerca de 1,225**, e não 1,6.
- **Disposição 3D:** hubs aparecem no centro por construção; testar só em medidas topológicas com nulos.
- **Fontes:** muitas foram lidas só por resumo; confira antes de alegar.
