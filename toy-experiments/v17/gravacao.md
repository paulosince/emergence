# V0.17 — a gravação usada (caracterização pelo observador)

**Estatuto:** caracterização do estímulo, feita **fora do sistema**, antes de qualquer execução (lição da V0.16: verificar que as relações chegam às Utrd). Nenhum número daqui entra no motor.

## Proveniência
- **Arquivo:** `Toccata_et_Fugue_BWV565.ogg`, enviado pelo responsável em 16/11/2026 (baixado por ele do Wikimedia Commons; download direto daqui foi recusado pelo servidor com "too many requests").
- **Intérprete:** Ashtar Moïra, segundo a legenda do artigo da Wikipédia (8 min 45 s na legenda; o arquivo tem 8 min 33,6 s — diferença não explicada).
- **Licença:** **não verificada.** O arquivo **não** foi colocado no repositório; só depois de confirmada a licença.
- **SHA-256:** `12bfa09ff64f6c59267302f37b3d74de55af2e01f8cf6ce1e8b33742846630b8`
- **Formato:** Ogg Vorbis, 44,1 kHz, estéreo, ~96 kbit/s (com perdas), 513,56 s.

## Medidas ([script](analise/caracterizar_gravacao.py))
| Medida | Valor | Leitura |
|---|---|---|
| Correlação entre os canais | 0,48 | Estéreo real, bem diferente de mono; o "eco" entre alto-falantes será parcial |
| Diferença de tempo entre canais | pico em 0 ms (correlação normalizada 0,48) | Sem atraso fixo entre os canais |
| Energia 50–8.000 Hz | ~98% | As 64 faixas aprovadas cobrem quase tudo |
| Energia 50–150 Hz | 11,4% | Os graves abaixo da faixa da V0.15 importam |
| Energia 2,4–8 kHz | 11,3% | Há agudos para a diferença de nível entre os ouvidos |
| Nível em janelas de 0,5 s | mediana −11,9 dB; só 1,2% abaixo de −30 dB | Os "vazios" são relativos: quase nunca há silêncio |
| Decaimento após o último acorde | ~10 dB por segundo | Reverberação longa, da ordem de 6 s até −60 dB (estimativa do assistente, confiança média) |
