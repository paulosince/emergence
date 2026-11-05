# EMERGENCE — Corpo mínimo, ação e interocepção física (v0.1)

**Status:** implementação e testes de um instrumento experimental idealizado, sem aprendizagem e sem ação autônoma.

## Por que o corpo é parte do mundo físico?

A introdução de interocepção não pode ser um gerador independente de números chamados "estados internos". Este modelo conecta quatro tipos de grandezas ao **mesmo processo físico**, por mecanismos operacionais:

1. Movimento externo da esfera, produzido pelo atuador e, depois da soltura, pela gravidade.
2. Estado de posição e velocidade do atuador (*propriocepção*).
3. Energia elétrica armazenada e corrente consumida pelo motor (*interocepção*).
4. Calor produzido pelo trabalho ineficiente e a mudança da temperatura interna (*interocepção*).

O pesquisador configura o movimento pretendido e o momento da intervenção; o modo de regra fixa pode inibir a elevação com base na tensão física. Não existe política autônoma. A esfera não recebe um nome de objeto, nem o motor recebe rótulos físicos, no fluxo de incidências entregue ao domínio.

## Modelo físico delimitado

O sistema é uma esfera rígida acima de um plano horizontal, um único atuador vertical e um reservatório de energia modelado como **capacitor ideal**. A movimentação tem apenas um grau de liberdade. Não há braços articulados reais, eletrônica de potência, atrito do atuador, deformações, ondas acústicas ou metabolismo.

- Altura inicial da esfera acima do plano: 1 m.
- Deslocamento imposto pelo atuador: 0,2 m.
- Início do comando: 100 ms.
- Duração da elevação: 800 ms.
- Soltura: 900 ms.
- Gravidade: 9,81 m/s².
- Massa da esfera: 1 kg; raio: 0,05 m.
- Restituição da colisão após a soltura: 0,5.
- Eficiência motora idealizada: 0,8.
- Energia inicial armazenada no capacitor: 100 J; capacitância: 2 F.
- Temperatura interna inicial: 295 K; capacidade térmica: 20 J/K.
- Horizonte de observação: 1.700 ms, anterior à segunda colisão não modelada.

Os limites de parâmetros são verificados. Por exemplo, rejeitamos movimentos em que um atuador que só pode empurrar necessitaria de força negativa e ações que excedem a energia disponível.

### Cinemática operacional

Para u=(t-início)/duração, com 0<=u<=1, a extensão do atuador é uma curva cúbica:

x(u)=H(3u²-2u³).

A velocidade é dx/dt e a aceleração é d²x/dt². Ambas respeitam velocidade nula no início e na soltura; a aceleração pode ter saltos finitos nos limites. A reação do atuador durante o movimento é F=m(g+a). Para manter um contato de empurrar unilateral sem tensão, o domínio é restringido a g>=6H/T². Antes do comando, uma trava passiva sustenta o corpo; após a soltura, o atuador permanece travado e não sustenta a esfera.

A trajetória de queda após a soltura é produzida pelo modelo analítico de uma colisão. A interposição de um objeto externo não é roteirizada como um evento sensorial independente.

### Trabalho, armazenamento e aquecimento

A potência mecânica instantânea é Pm=F*v. Na faixa permitida, Pm>=0; não há frenagem regenerativa. O trabalho acumulado desde o início é:

Wm = m*g*x + (1/2)*m*v².

O consumo elétrico acumulado é We=Wm/eficiência. A energia do capacitor é E=E0-We e sua tensão satisfaz E=(1/2)*C*V². A fração não convertida em trabalho mecânico constitui calor interno Q=We-Wm, elevando a temperatura em Q/capacidade térmica.

A corrente calculada no instante é I=(Pm/eficiência)/V. Um controlador ideal mantém a trajetória comandada enquanto existe energia suficiente. O controlador não é modelado eletronicamente e é **externo** à arquitetura em investigação.

Esse esquema conserva energia dentro de suas condições declaradas, mas NÃO demonstra que essas equações descrevam a fisiologia de um animal, um motor real ou uma bateria química.

## Duas origens de ação experimentalmente distinguíveis

**Intervenção do pesquisador:** o comando de elevação ocorre em um horário estabelecido externamente; o registro físico identifica o pesquisador como origem.

**Regra fixa programada:** um controlador não-aprendiz mede a **tensão inicial do capacitor** por uma função do estado físico antes do comando. Se a medição for igual ou superior a um limiar explícito, ele autoriza o levantamento previamente especificado; caso contrário, a esfera permanece sustentada até o horário de soltura. O controlador determina efetivamente qual dinâmica será executada e registra sua avaliação. Não é somente uma descrição textual da ação.

O controlador pode impedir um movimento para o qual a energia seria insuficiente. Caso o limiar permita uma ação que ainda exceda o limite de energia do modelo, a construção é rejeitada em vez de produzir uma trajetória fisicamente inconsistente.

As opções iniciais da interface são 9,95 V (permite elevar com 10 V iniciais) ou 10,05 V (inibe elevação com 10 V iniciais), além das duas ações impostas pelo pesquisador. As regras são impostas pelo programador e **não constituídas autonomamente** pelo sistema experimental. Não existe ainda um mecanismo representacional capaz de selecionar ações, e não chamamos a regra fixa de autonomia.

## Acoplamentos e leituras

| Canal | Modalidade | Medição implementada | Limitação |
| --- | --- | --- | --- |
| s0, s1 | Exterocepção óptica | Obstrução geométrica de barreiras colimadas em 0,7 e 0,3 m | Não é visão ou uma imagem |
| s2 | Exterocepção mecânica | Impulso de contato integrado por janela | Não representa um sensor tátil incorporado ao corpo |
| s3 | Propriocepção | Potenciômetro ideal: tensão proporcional à extensão do atuador | Não representa um sistema musculoesquelético |
| s4 | Interocepção | Voltímetro ideal de alta impedância ligado ao capacitor | Não é leitura direta de energia com rótulo |
| s5 | Interocepção | Transdutor ideal de tensão proporcional à temperatura interna | Não modela um termistor real nem sua calibração eletrônica |
| s6 | Interocepção | Amperímetro ideal em série com o motor | Não representa o circuito eletromagnético completo |

Os sensores produzem valores numéricos, em unidades físicas, em diferentes períodos de amostragem e latências. Os rótulos de modalidade pertencem ao manifesto do pesquisador, **não à incidência** entregue ao motor experimental.

A física continua existindo se todos os sensores estiverem desligados. A disponibilidade de modalidades é um controle independente das equações do mundo.

## Ensaios e validações

O corpo foi submetido a:

- Controle sem elevação, mantendo o mesmo momento de soltura e toda a física da esfera.
- Alteração isolada do instante do comando externo.
- Ablações de cada uma das quatro famílias sensoriais e de todas simultaneamente.
- Mudanças de amostragem e atraso sem alteração de energia, calor ou colisão.
- Verificação da integral de F.v por integração numérica independente da fórmula de trabalho acumulado.
- Verificação da transferência de energia: capacitor -> trabalho + calor.
- Conferência independente do primeiro impacto por integrador numérico.
- Testes com energia insuficiente, parâmetros inválidos, força de contato negativa e horizonte físico não permitido.
- Injeção de defeitos no estado de energia interna e na força de suporte para verificar sensibilidade dos auditores.

A concordância entre verificadores é limitada a um modelo analítico idealizado. A integridade dos registros não demonstra a constituição de representações.

## Inspetor experimental preliminar

A página inicial contém um **inspetor funcional**, anterior à interface científica completa da etapa 8. No navegador é possível selecionar modalidades, alterar a intervenção entre "elevar e soltar" e "somente soltar", acompanhar o estado físico em um esquema 1D, percorrer o tempo e inspecionar as incidências efetivamente entregues.

O desenho é projetado a partir do mundo analítico; não influencia a evolução temporal. Não existe um grafo de unidades ou relações, pois o motor usado é o controle diagnóstico sem aprendizagem. A página pode exportar um JSON com o manifesto e histórico desta execução, mas não implementa persistência reprodutível com checkpoint (etapa 7).

### Executar em Node

~~~sh
npm test
npm run experiment:body
npm run experiment:body:json > body-run.json
npm run experiment:body:csv > body-incidences.csv
npm run experiment:body:extero
npm run experiment:body:proprio
npm run experiment:body:intero
npm run experiment:body:none
npm run experiment:body:no-lift
~~~

Os testes de regressão mantêm o TEMPO original somente leitura. Não se pode afirmar, a partir deste instrumento, que existam "pensamentos", representação, agência autônoma ou suficiência de interocepção.

## Ponto de atenção científico

A energia/corrente/tensão/temperatura aparecem como processos **internos ao corpo experimental**, não como constituições endógenas do sistema representacional. O controle motor é externamente programado: pode ser uma intervenção direta ou uma regra fixa de limiar. Não inferir que a existência de sinais interoceptivos obrigue a emergência de atividade endógena representacional. Esta questão deverá ser investigada, não programada como resposta.
