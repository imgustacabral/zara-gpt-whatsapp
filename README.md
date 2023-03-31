
# <center> 🤖 API ChatGPT para WhatsApp </center>

Esta é uma API de um projeto pessoal que utiliza a Twilio e o modelo GPT-3.5 Turbo para responder mensagens do WhatsApp de forma automatizada, além de utilizar o Dall-E para gerar imagens a partir de prompts.
## 🛠️ Stack Utilizada
A API ChatGPT para WhatsApp foi desenvolvida utilizando as seguintes tecnologias:

-   [![NestJS](https://img.shields.io/badge/-NestJS-FE0902?logo=nestjs&logoColor=white)](https://nestjs.com/) - Framework que fornece uma arquitetura escalável para desenvolvimento de apps em servidores.
-   [![Prisma](https://img.shields.io/badge/-Prisma-1B222D?logo=prisma&logoColor=white)](https://www.prisma.io/) - ORM que facilita a interação com bancos de dados.
-   [![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/) - Banco de dados relacional de código aberto.
-   [![Twilio API](https://img.shields.io/badge/-Twilio-FFC20E?logo=twilio&logoColor=white)](https://www.twilio.com/) - API de comunicação por Whatsapp, SMS, voz e vídeo.
-   [![OpenAI API](https://img.shields.io/badge/-OpenAI-FF733E?logo=openai&logoColor=white)](https://beta.openai.com/) - API para processamento de linguagem natural e inteligência artificial.
-   [![TypeScript](https://img.shields.io/badge/-TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/) - Superset de JavaScript que adiciona tipagem estática à linguagem.
-   [![Fastify](https://img.shields.io/badge/-Fastify-202020?logo=fastify&logoColor=white)](https://www.fastify.io/) - Utilizado como adapter junto ao NestJS com foco em desempenho e escalabilidade.

Essa stack proporcionou uma implementação eficiente e escalável para a API ChatGPT para WhatsApp.
### 📑 Sumário

- [Funcionalidades](#🚀features)
- [Ambiente Sandbox (Testes)](#🧪ambiente-sandbox-testes)
- [Instalação e Configuração](#🛠️instala%C3%A7%C3%A3o-e-configura%C3%A7%C3%A3o)

### 🚀Features

-   Conversação utilizando todo o poder do ChatGPT apenas mandando mensagens pelo WhatsApp. 🤝💬
-   Geração de imagens utilizando o comando `/imagine seu prompt`. 🖼️🤖
-   Limpeza do histórico de mensagens do banco de dados utilizando o comando `/clear`. 🗑️
-   Obtenha ajuda sobre os comandos disponíveis utilizando o comando `/help`. ❓🤔

Veja a imagem abaixo como exemplo:
[![Exemplo de imagem](https://i.postimg.cc/RVqv61bP/image.png)](https://postimg.cc/Tp8zBbxm)



###  🧪Ambiente Sandbox (Testes) 

Para realizar testes com a API ChatGPT em um ambiente seguro, a Twilio oferece um ambiente sandbox que pode ser utilizado gratuitamente. Para começar a utilizar o ambiente, siga os seguintes passos:

1.  Envie uma mensagem de texto com o texto "join box-fire" para o whatsapp +1 (415) 523-8886 ou [clique aqui](https://wa.me/14155238886?text=join%20box-fire).
    
2.  Aguarde a mensagem de confirmação informando que você entrou no ambiente sandbox.
    
3.  Envie uma nova mensagem para o número do sandbox. A mensagem será encaminhada para a API ChatGPT responder de forma automática.
Ao utilizar o ambiente sandbox para testes, é importante lembrar que todas as mensagens enviadas e recebidas são armazenadas em um banco de dados. Essas mensagens serão mantidas no banco de dados até que o comando `/clear` seja executado para limpar o histórico.

Além disso, ao utilizar a API ChatGPT e Dall-E, é importante lembrar que os termos de uso da [OpenAI]([https://beta.openai.com/terms/](https://beta.openai.com/terms/)) também se aplicam. Certifique-se de ler e concordar com esses termos antes de utilizar a API.

Também é necessário concordar com os termos de uso da Twilio, que pode ser encontrados [aqui](https://www.twilio.com/legal/tos).


### 🛠️Instalação e Configuração

Para instalar e configurar a API, siga os passos abaixo:

1.  Crie uma conta na Twilio e OpenAI e pegue suas credenciais. Preencha no arquivo `.env`. O arquivo `.env.example` está na raiz do projeto. Veja o exemplo abaixo:

```
OPENAI_API_KEY=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_NUMBER=whatsapp:
DATABASE_URL=
BOT_PERSONA="Persona do Bot"

```

O campo `DATABASE_URL` deve ser preenchido com a URL do seu banco de dados. Por padrão, está configurado para utilizar o PostgreSQL.

2.  Instale as dependências do projeto com o seguinte comando:

```bash
npm install
```

3.  Rode o testes, se der tudo OK, inicie a API em localhost com o comando:

```bash
npm run test

npm run start:dev
```

4. Para realizar testes em localhost, é altamente recomendado que você utilize o NGROK para fazer o tunnel de localhost para a internet. Siga os passos abaixo:

-   [Instale o ngrok](https://ngrok.com/download).
    
-  Rode o comando abaixo no seu terminal para criar um túnel para a porta 3000 da sua máquina:

```bash
ngrok http 3000
```

3.  O comando acima irá gerar uma URL externa no terminal. Copie esta URL e coloque como endpoint no console da sua Twilio. Certifique-se de que toda requisição vá para o formato POST para o endpoint `/message`. Veja o exemplo abaixo:

```
https://sua-url-do-ngrok.com/message
```

Assim, a Twilio enviará um webhook com as mensagens e imagens recebidas para esta URL e a API ChatGPT será capaz de responder às mensagens de forma automatizada.