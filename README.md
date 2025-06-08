# GEF-BioTag

GEF-BioTag é um aplicativo mobile desenvolvido para facilitar o registro, identificação e acompanhamento de pacientes em situações de emergência, utilizando pulseiras NFC e monitoramento de dados vitais via IoT.

## Funcionalidades

- Registro de pacientes com identificação por pulseira NFC
- Simulação de leitura NFC para testes
- Consulta e edição de informações dos pacientes
- Visualização de abrigos disponíveis e seus pacientes
- Monitoramento de batimentos cardíacos dos pacientes
- Modal de informações sobre equipe, termos de uso, sobre o app e ajuda
- Integração com API para persistência dos dados

## Tecnologias Utilizadas

- React Native (Expo)
- TypeScript
- Context API para gerenciamento de estado
- Integração com API RESTful desenvolvida em Java
- Estilização customizada com StyleSheet
- Ícones: Lucide React Native

## Estrutura do Projeto

- `/app`: Telas e navegação do aplicativo
- `/components`: Componentes reutilizáveis (Header, Picker, etc)
- `/data`: Dados mockados para testes locais
- `/services`: Serviços de integração com a API
- `/constants`: Cores e estilos globais

## API

A integração do app é feita com uma API RESTful desenvolvida em Java, responsável por gerenciar os dados de pacientes e abrigos. Para testar localmente, utilize os dados mockados disponíveis na pasta `/data`.

## Como rodar o projeto

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Inicie o projeto:
   ```bash
   npx expo start
   ```
3. Siga as instruções do Expo para rodar no emulador ou dispositivo físico.

## Sobre a Equipe

- Eduardo Henrique Strapazzon Nagado - RM558158
- Felipe Silva Maciel - RM555307
- Gustavo Ramires Lazzuri - RM556772

## Termos de Uso

Este aplicativo é destinado ao gerenciamento de pacientes em situações de emergência, utilizando identificação por pulseira NFC. O uso é restrito a fins acadêmicos e demonstração. Nenhum dado real é coletado ou compartilhado.

## Ajuda

Em caso de dúvidas, entre em contato:
- rm558158@fiap.com.br
- rm555307@fiap.com.br
- rm556772@fiap.com.br
