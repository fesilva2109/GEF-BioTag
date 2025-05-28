# GEF - BioTag: Sistema de Monitoramento de Emergência

GEF - BioTag é um aplicativo móvel desenvolvido para situações de desastres naturais, como enchentes e deslizamentos, focado na identificação e monitoramento de saúde de pessoas em áreas de risco.

## Descrição da Solução

Em eventos extremos como enchentes e deslizamentos, o aplicativo GEF - BioTag oferece uma solução para equipes de resgate e voluntários identificarem e monitorarem vítimas através de pulseiras inteligentes equipadas com NFC, RFID e sensores de batimentos cardíacos.

### Funcionalidades Principais

- Registro de vítimas via leitura de pulseiras com NFC/RFID/QR Code
- Monitoramento de sinais vitais (batimentos cardíacos)
- Funcionamento offline com sincronização posterior
- Agrupamento de vítimas por núcleo familiar
- Priorização de socorro baseada em dados vitais
- Gestão de pessoas que permaneceram em áreas de risco

### Tecnologias Utilizadas

- React Native com Expo
- TypeScript
- AsyncStorage para armazenamento offline
- Integração com APIs RESTful
- Expo Camera para leitura de QR Codes
- Geolocalização para marcação de vítimas

## Como Executar o Projeto

### Pré-requisitos

- Node.js 14 ou superior
- npm ou yarn
- Expo CLI instalado globalmente
- Um dispositivo físico ou emulador para testar

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/gef-biotag.git
cd gef-biotag
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Inicie o projeto:
```bash
npm run dev
# ou
yarn dev
```

4. Abra o aplicativo Expo Go em seu dispositivo e escaneie o QR code exibido no terminal.

## Estrutura do Projeto

- `/app`: Rotas e navegação do aplicativo
- `/components`: Componentes reutilizáveis
- `/contexts`: Contextos para gerenciamento de estado global
- `/hooks`: Hooks personalizados
- `/services`: Serviços para chamadas à API
- `/types`: Definições de tipos TypeScript
- `/utils`: Funções utilitárias

## Funcionalidades Implementadas

1. **Autenticação Simplificada**
   - Login como Resgatador

2. **Tela Inicial (Home)**
   - Resumo de vítimas registradas
   - Status de conexão (Online/Offline)
   - Botões de ação rápida

3. **Registro de Vítimas**
   - Leitura de QR Code
   - Simulação de leitura NFC
   - Captura de localização atual
   - Classificação de status (No abrigo, Área de risco, Crítico)

4. **Listagem de Vítimas**
   - Busca por nome/ID
   - Filtros por status e grupo familiar
   - Visualização rápida de dados essenciais

5. **Monitoramento Vital**
   - Acompanhamento de batimentos cardíacos
   - Alertas para casos críticos
   - Atualização em tempo real

6. **Sincronização de Dados**
   - Funcionamento offline
   - Marcação de registros pendentes
   - Sincronização com o servidor quando conectado

## Integrantes do Grupo

- Eduardo Henrique Strapazzon Nagado - RM 58158
- Felipe Silva Maciel - RM 555307
- Gustavo Ramires Lazzuri - RM 556772

## Link para o Vídeo de Demonstração

[Link para o vídeo no YouTube]()