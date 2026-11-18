# V0.17 — Registro prévio: retirar a inibição do plano B (adaptação), antes da inibição da MSO

**Estado:** **APROVADO** pelo responsável em 18/11/2026 ("Aprovo, pode rodar").
**Redação:** assistente (Claude), 18/11/2026.
**Base:**
- diagnóstico de 17/11 ([resultados](resultados.md), participação): o colapso do agudo vem da inibição do plano B em janela retangular; sem inibição, o agudo não colapsou (sementes 221–222, diagnóstico);
- decisão de 18/11: substituir o plano B pela inibição da MSO (caminho próprio). Ela depende de um mecanismo que ainda falta, o cansaço das sinapses em frequência alta (depressão de curto prazo), que ainda precisa de pesquisa.

**Ideia:** um mecanismo por vez. Primeiro **tirar a adaptação** (plano B) e medir o modelo **sem inibição**. Depois **pôr a inibição da MSO**, com o cansaço.

**Modelo atual (ponto de partida):** passo 1 (limiar duro; janela retangular de 0,30 ms) + atividade espontânea (60/s) + relógio corrigido + eliminação por participação (N = 100), conjunto B. Motor `motor_fibras.py`, 1 fibra por ouvido.
**Legenda:** [R] decisão do responsável; [A] proposta do assistente (a aprovar).

## 1. O que muda [A]
- **Sai a inibição do plano B.** O modelo fica **sem inibição** até a da MSO entrar.
- **Perda declarada:** a MSO tem inibição; sem ela, perde-se o estreitamento da janela de coincidência, que na MSO é feito pela inibição que chega antes (Roberts 2013).
- Nada mais muda.

## 2. Mundo, sementes, condições
- Degrau 1 (Δ = 0,458 ms), grave e agudo. **Sementes 251–280** (30, novas).
- Condições: (a) **sem inibição** (julgada); (b) com o plano B (o modelo atual), para comparação.
- Total: 2 × 2 × 30 = **120 execuções**, ~10 min.

## 3. Medidas
Seleção (grave), seleção em fase (agudo), colapsos, disparos, ramos, eliminados, disparo no silêncio, força ganha e perdida por episódio.

## 4. Leitura (fixada agora)
- **Passa** se (a) der grave **≥ 24/30 e** agudo em fase **≥ 24/30**: o modelo sem plano B vira o ponto de partida da inibição da MSO.
- Não passa: levar ao responsável com diagnóstico, sem ajustar.

## 5. Previsões [A]
1. O agudo **não colapsa** (diagnóstico de 2 sementes).
2. **Risco:** sem inibição, a janela de coincidência efetiva fica mais larga; podem aparecer mais Uints presas no acaso ou sintonia menos precisa.
3. **Risco:** no silêncio, a atividade espontânea dispara mais as Uints, porque nada a contém.
