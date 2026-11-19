# V0.18 — Régua humana para a extensão dos testes

**Data:** 19/11/2026. **Decisão do responsável (19/11):** ler as referências humanas antes de medir. Aqui fica o que foi lido, como foi lido e o que ainda falta.

**Grau de leitura:**
- **integral:** o assistente leu o texto inteiro;
- **extração automática:** o texto integral passou por uma ferramenta que respondeu às perguntas do assistente; os números vêm do texto, mas o assistente não leu tudo;
- **resumo:** só o resumo, ou trechos vistos em busca;
- **secundária:** o número vem de outro artigo que cita a fonte.

## O que já está lido

| Medida | Valor humano | Fonte | Grau de leitura | Confiança |
|---|---|---|---|---|
| Intensidade (tons) | fração de Weber 10·log(ΔI/I) de −1,5 a −11,6 dB, ou seja **ΔL ≈ 0,3 a 2,3 dB**, típico ~0,5–1,2 dB. Melhora com o nível ("near-miss" à lei de Weber; inclinações de 0,81 a 0,92); 30, 50 e 70 dB SL; 250, 1.000, 4.000 e 7.000 Hz; 2 ouvintes | Schacknow e Raab (1973), *Perception & Psychophysics* 14(3), 449–450 | extração automática | média (2 ouvintes; ΔL convertido pelo assistente: ΔL = 10·log(1 + ΔI/I)) |
| Intensidade (ruído largo) | segue a lei de Weber (fração constante) | resumos (ex.: estudo de discriminação monaural e interaural, UMN) | resumo | média |
| Direção (meio) | **~1°** no meio; ~10° nas laterais; diferença de chegada perceptível de 10–20 µs (Domnitz e Colburn, citados) | Smith e Price (2014), *PLoS ONE* 9(2), e89033 | extração automática | alta para o ~1° (valor clássico) |
| Diferença de chegada em tons | mínimo **~10 µs** perto de 1.000 Hz; impossível acima de ~1,4–1,5 kHz | Brughera, Dunai e Hartmann (2013), *J. Acoust. Soc. Am.* 133(5), 2839–2855 | resumo e introdução | alta |
| Separação de fontes só pela direção | a diferença de chegada **sozinha** separa mal o **conteúdo** das fontes; com 333 µs para lados opostos, os ouvintes ouviam **duas** fontes em 89,5% das vezes (contra 12,5% no mesmo lugar), mas quase não identificavam o que cada uma continha. Início comum e harmonicidade pesam mais | Schwartz, McDermott e Shinn-Cunningham (2012), *J. Acoust. Soc. Am.* 132(1), 357–368 | extração automática | alta |
| Não simultaneidade | dois cliques, um em cada ouvido, separados por **2–3 ms** já soam não simultâneos | Arstila e colegas (2020), *PLoS ONE* 15(8), e0226122 (citando Elliott e Giersch 2016) | secundária | média |
| Ordem dos inícios | **~20 ms** com treino (Hirsh 1959; Hirsh e Sherrick 1961); até 60 ms sem treino; **~10 ms** para tons de frequências diferentes (Fink e colegas 2005) | Arstila e colegas (2020), citando as fontes | secundária | média |
| Pausa em ruído largo | **2–3 ms** | resumos (Plomp 1964; Green 1985) | secundária | média |

## O que falta ler (PDFs a pedir ao responsável)

| Referência | Por quê |
|---|---|
| Wier, C. C., Jesteadt, W., e Green, D. M. (1977). Frequency discrimination as a function of frequency and sensation level. *J. Acoust. Soc. Am.* 61(1), 178–184. PubMed 833369 | frequência (os valores atuais são de memória) |
| Jesteadt, W., Wier, C. C., e Green, D. M. (1977). Intensity discrimination as a function of frequency and sensation level. *J. Acoust. Soc. Am.* 61(1), 169–177. https://doi.org/10.1121/1.381278 | intensidade (mais ouvintes e níveis) |
| Hirsh, I. J. (1959). Auditory perception of temporal order. *J. Acoust. Soc. Am.* 31, 759–767 | ordem dos inícios (fonte original) |
| Estudo de assincronia entre um tom de 250 Hz e um tom agudo (1, 2, 4 ou 6 kHz): https://pmc.ncbi.nlm.nih.gov/articles/PMC3574076 (autores a confirmar ao abrir) | limiar de assincronia entre frequências distantes |
| Darwin, C. J. (2008). Listening to speech in the presence of other sounds. *Phil. Trans. R. Soc. B* 363(1493), 1011–1021. https://doi.org/10.1098/rstb.2007.2156 (PMC2606793) | pistas de separação (frequência fundamental, início, direção) |
| Artigo de 2012 que modela o limiar de frequência por frequência, duração e nível: https://pmc.ncbi.nlm.nih.gov/articles/PMC3455123 (autores a confirmar ao abrir) | frequência |

O servidor do PubMed Central pede uma verificação de navegador que a ferramenta do assistente não passa; por isso os artigos de lá precisam vir em PDF.
