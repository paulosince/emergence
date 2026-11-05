# EMERGENCE — Checkpoints, persistência e replicação (Etapa 7, v0.1)

**Estado:** instrumento operacional para o laboratório determinístico atual e motor diagnóstico sem aprendizagem. Não afirma retomada genérica do TEMPO, de motores constitutivos futuros ou de mundos com estados mutáveis não implementados.

## Separações científicas indispensáveis

| Operação | O que ocorre | O que se pode concluir |
| --- | --- | --- |
| Reproduzir histórico gravado | Exibir registros armazenados, sem reexecutar física | Saber o que foi registrado; não comprova equivalência causal |
| Reexecução independente do registro | Construir um mundo novo e executar integralmente o modelo | Igualdade de históricos sob a mesma versão, código e condições |
| Retomada do checkpoint | Repor fila, relógio, sensores, aleatoriedade e motor e continuar | Igualdade com execução contínua para o contrato de retomada implementado |
| Verificar ZIP | Conferir entradas, CRC32, SHA-256 e conteúdos duplicados | Integridade dos dados, não autenticação de autoria |

A comparação avalia todo o manifesto, incidências, eventos operacionais, medidas, tempo, contadores e estado final. Divergências são apresentadas, nunca corrigidas artificialmente.

## O que é realmente capturado

O checkpoint versionado registra:

- **Mundo físico:** parâmetros/manifesto, data, geometria, condições meteorológicas, estado calculado na fronteira temporal (inclusive temperatura, radiação e lâmpada) e eventos físicos anteriores.
- **Tempo:** último instante de evento processado e limite temporal da interrupção, mesmo quando diferentes.
- **Agendador:** todos os eventos pendentes, payloads, tempo, ordem de inserção e contador de sequência; inclui medições que ainda não chegaram ao domínio.
- **Transdutores:** parâmetros e último valor efetivamente emitido.
- **Aleatoriedade:** estado integral do fluxo pseudoaleatório de cada canal, compatível com o RNG de referência fixado no TEMPO.
- **Motor diagnóstico:** relógio, contagem de entradas, último registro e eventos internos ainda pendentes.
- **Auditoria:** rastros, incidências, identificadores e contadores.

Na Sala Experimental, o mundo é uma função analítica determinística do tempo e parâmetros. Assim, sua evolução pode ser reconstruída da configuração; **também capturamos e comparamos o estado físico calculado** no limite do checkpoint antes de continuar. Um futuro mundo com memória dinâmica adicional deverá serializar seu estado integral, não aproveitar essa simplificação sem demonstração.

Não se injeta verdade física ou nomes de fenômenos no motor experimental: o fluxo de incidências permanece numérico.

## Persistência IndexedDB

O banco local do navegador chama-se emergence-research, esquema versão 2, com lojas:

- runs — configuração, histórico completo, métricas e versão do experimento;
- configs — configurações armazenadas;
- checkpoints — estados de retomada associados às execuções.

A migração de v1 para v2 acrescenta checkpoints preservando as lojas existentes. Salvamento e exclusão da execução e do checkpoint são **atômicos na mesma transação**. Quando IndexedDB está indisponível, a aplicação informa o erro e preserva a opção de exportar ZIP, sem substituição silenciosa por outro armazenamento.

Dados locais podem desaparecer ao limpar o navegador, usar modo privado, trocar de dispositivo ou alcançar limites de armazenamento. Os arquivos ZIP são a cópia transportável.

## Pacote científico ZIP

O formato é um ZIP sem compressão (método STORE), contendo:

| Arquivo | Conteúdo |
| --- | --- |
| record.json | Definição versionada da sala, manifesto, histórico, métricas, checkpoint e configuração |
| incidences.csv | Tabela RFC 4180 de incidências |
| trace.json | Eventos operacionais e amostras |
| checkpoint.json | Cópia do checkpoint, quando presente |
| integrity.json | SHA-256 de cada entrada e versão do esquema |

Importação limita o total a 25 MB, aceita somente nomes permitidos sem diretórios, verifica CRC32, SHA-256, campos do ZIP e consistência entre cópias CSV/JSON e o registro central. Não aceita ZIP64, métodos compactados nem arquivos arbitrários.

CRC32 e SHA-256 **não são assinatura digital**: alguém pode adulterar um pacote e recalcular ambos os hashes. A reexecução integral é uma comparação científica adicional dentro das mesmas hipóteses físicas e da mesma implementação, não validação da realidade.

O ZIP contém dados físicos disponíveis ao pesquisador. É preciso revisar o conteúdo antes de distribuição pública.

## Fluxo na interface

Acesse a Sala Experimental em https://paulosince.github.io/emergence/ e configure clima, data, obstáculo e sensores.

1. **Salvar execução:** guarda histórico, manifesto e checkpoint localmente.
2. **Abrir registro:** usa o histórico armazenado; não reexecuta o experimento.
3. **Reexecutar e comparar:** calcula novamente o cenário e compara todos os campos.
4. **Retomar checkpoint:** restaura os estados serializados e conclui o restante da história.
5. **Exportar ZIP científico:** grava uma cópia portátil verificável.
6. **Importar ZIP:** verifica integridade e abre o histórico gravado.

A visualização rejeita pacotes de outra versão do simulador: reconstruí-los com equações diferentes poderia apresentar um mundo que não corresponde ao registro original.

## CLI e testes

~~~sh
npm test
npm run experiment:room:replication
npm run experiment:room:replication:zip
npm run experiment:room:replication -- --zip=experimento.zip
~~~

A campanha de replicação inclui sensores com ruído controlado, exportação/importação, nova execução integral e retomada de checkpoint. Testes adversariais alteram estado físico, fila, parâmetros, contadores e conteúdo de arquivo.

## Limites de validade

- **Verificado:** equivalência exata para as condições e mecanismos existentes, inclusive atrasos, RNG, eventos simultâneos, várias retomadas e ablação de sensores.
- **Não verificado:** validade empírica geral dos modelos físicos; mundos com estado oculto mutável; retomada de motores TEMPO ou de futuros constitutivos; integridade contra um adversário que refaz hashes.
- **Proveniência:** execução CLI pode registrar SHA do Git. Na página estática do navegador, registra-se a versão do software, mas o SHA exato do deploy ainda não é embutido automaticamente. Fixar o commit é necessário para replicação rigorosa entre ambientes.
- **Sem alegações de representação:** persistir incidências e estruturas não demonstra constituição autônoma de unidades ou relações.

O projeto TEMPO original permanece congelado e inalterado.
