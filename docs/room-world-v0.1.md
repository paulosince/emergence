# EMERGENCE — Sala Experimental naturalística, modelo v0.1

**Estatuto:** cenário ambiental implementado e validado em condições delimitadas, sem sistema representacional. O mundo é um instrumento de pesquisa e não uma reconstrução física exaustiva de uma sala real.

## Objetivo funcional

Permitir que processos ambientais **continuem ocorrendo independentemente da presença, dos sensores e das decisões do sistema investigado**. O pesquisador controla condições iniciais e ambientais, não a sequência de incidências do futuro domínio.

O antigo atuador que levantava a esfera continua como experimento específico de validação em \`body.html\`; não comanda a sala.

## Geometria física declarada

Sala estática de 6 × 4 × 2,8 m (leste–oeste, norte–sul e altura). Janela de 2 m de largura na parede norte, com peitoril de 0,9 m, abertura vertical de 1,3 m e transmitância idealizada de 0,7. Porta de 0,9 m na parede oeste, **fechada**. Existe uma caixa opaca estacionária dentro da sala, para examinar a sombra que se desloca conforme a posição solar.

As projeções são calculadas em coordenadas métricas. A área de sol no piso decorre da interseção geométrica entre raios solares e janela. A sombra da caixa decorre de **interseção raio–caixa 3D**, recortada à área iluminada que entrou pela janela; a aparência das figuras SVG não participa das equações nem é usada pelo motor de transdução.

A porta atualmente é geometria delimitadora estática, **sem** dinâmica de abertura, passagem de objetos, vento ou som.

## Sol e relógio

Posição solar aproximada a partir de data, latitude, longitude, offset UTC e hora civil local. O cenário padrão usa 21/06/2026, latitude −23,45°, longitude −46,52° e UTC−3 (referência próxima a Guarulhos). O modelo inclui declinação solar e aproximação da equação de tempo, mas **não** refração atmosférica, perfil do horizonte, sombras de edifícios externos ou efemérides de precisão.

O relógio experimental percorre um dia civil de 24 h. A velocidade de reprodução no navegador só modifica a visualização, nunca a dinâmica calculada.

## Luz, sombras e acionamento da lâmpada

A irradiação externa é estimada por componentes direta e difusa dependentes da altura solar e nebulosidade. A energia transmitida pela janela resulta da área, transmitância e direção de chegada da luz. Há aproximação de reflexão interna difusa; não há transporte radiativo completo nem calibração fotométrica em lux.

No piso, a irradiância direta só existe se o raio, rastreado do ponto até o Sol, atravessar a janela **sem interceptar a caixa opaca**. Valores de iluminação do piso são calculados em W/m² e não dependem das preferências de visualização.

A lâmpada é controlada por **fotocélula exterior** com histerese: ligar quando a irradiação externa cair ao limiar baixo e desligar quando alcançar o limiar alto. Os eventos resultam dos cruzamentos físicos desses limiares, não de ordens temporais “às 18h”. A intensidade elétrica e a contribuição luminosa são limitadas por parâmetros declarados.

Essa regra é um automatismo previamente programado do **ambiente externo**. O sistema investigado não o escolhe e não recebe o rótulo de seu acontecimento.

## Temperatura e meteorologia

São disponíveis dois perfis **sintéticos** de clima, predominantemente limpo e encoberto, que variam temperatura externa e nebulosidade. Nenhum deles é previsão atual nem observação obtida da internet.

O laboratório também admite séries meteorológicas importadas abrangendo o dia inteiro, com origem/proveniência explícita, registros temporalmente ordenados e interpolação definida. A aquisição externa de séries meteorológicas, sua verificação e transformação em pacotes reproduzíveis ainda não estão automatizadas.

A temperatura interna é calculada por um balanço energético de zona térmica única:

\[
C\frac{dT_i}{dt}=UA(T_e-T_i)+P_{\mathrm{solar\,absorvido}}+P_{\mathrm{lâmpada}}.
\]

O solver usa células de 60 s e integração analítica por célula sob forçamento aproximado constante. A reconstrução de qualquer instante usa a mesma grade temporal, **independentemente da ordem das consultas ou frequência dos sensores**.

Não modelamos camadas de parede, diferentes temperaturas por posição, infiltração de ar, umidade, convecção espacial, evaporação, chuva, comportamento do vento nem acústica.

## Acoplamentos sensoriais

Os transdutores disponíveis amostram grandezas **causalmente produzidas pelo mundo**:

| Tipo de sensor | Grandeza operacional |
| --- | --- |
| Radiômetros em dois pontos do piso | Irradiância calculada conforme janela e sombra |
| Radiômetro exterior | Irradiância solar externa |
| Termômetro interior | Tensão ideal proporcional à temperatura absoluta do interior |
| Termômetro exterior | Tensão ideal proporcional à temperatura absoluta exterior |
| Medidor do circuito da lâmpada | Corrente elétrica idealizada a partir da potência da lâmpada |

Cada transdutor possui período, atraso e resolução próprios. Os resultados que chegam ao motor são incidências numéricas com identificador de canal e tempos de observação/chegada. **Os nomes de Sol, chuva, janela, lâmpada, caixa, clima ou causa física não chegam como entrada ao motor diagnóstico.**

Ablações sensoriais não alteram a história física. O motor diagnóstico tem zero unidades e zero relações constituídas. Nenhum resultado desta etapa demonstra aprendizagem ou representação.

## Controles de validação e contraexemplos

A suíte testa a orientação solar, a projeção através da janela, a exclusão de luz noturna direta, a ausência de propagação direta em pontos bloqueados, a sombra da caixa por interseção raio–objeto, cruzamentos de limiar da fotocélula, diferença de cenários climáticos, dinâmica térmica e separação entre verdade física e incidências.

Também testa a manutenção do mundo sem sensores, alterações de período de amostragem, repetição determinística e rejeição de parâmetros inválidos e meteorologia sem proveniência.

Esses são testes de **consistência interna e adversariais**. Não constituem comprovação de fidelidade em medições de campo, de generalidade causal de modelos de consciência ou de formação autônoma de estruturas.

## Inspeção e reprodução

A página principal em GitHub Pages apresenta uma cena geométrica isométrica com incidência luminosa, movimento de sombra, estado da lâmpada, temperatura, curva de irradiância e incidências realmente entregues. O ambiente corporal permanece em \`body.html\`. Há também um inspetor independente em planta 2D em \`room.html\`, útil para examinar projeções.

~~~sh
npm test
npm run experiment:room
npm run experiment:room:json > quarto.json
npm run experiment:room:csv > incidencias.csv
npm run experiment:room:overcast
npm run experiment:room:none
~~~

As exportações atuais contêm a história de um experimento; checkpoints retomáveis, IndexedDB, integridade de pacotes ZIP e replay após importação pertencem à **etapa 7**.

## Limites da próxima ampliação

Antes de inserir ruídos de chuva, “sons da janela” ou objetos móveis, devemos definir um mecanismo físico para geração/propagação/captação que possa ser validado separadamente. Não adicionaremos relações de origem comum como metadados entregues aos sensores nem movimentos corporais prontos ao sistema investigado.

O TEMPO original permanece congelado e sem alterações.
