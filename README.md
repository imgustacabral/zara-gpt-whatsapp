# <center> 🤖 Zara Bot para WhatsApp </center>

Esse é o Bot de um projeto pessoal que utiliza a biblioteca whatsapp-web.js e o modelo GPT-3.5 Turbo para responder mensagens do WhatsApp de forma automatizada, além de utilizar o Dall-E para gerar imagens a partir de prompts.

## 🛠️ Tecnologias Utilizadas
A Zara foi desenvolvida utilizando as seguintes tecnologias:

-   [![NestJS](https://img.shields.io/badge/-NestJS-FE0902?logo=nestjs&logoColor=white)](https://nestjs.com/) - Framework que fornece uma arquitetura escalável para desenvolvimento de apps em servidores.
-   [![Prisma](https://img.shields.io/badge/-Prisma-1B222D?logo=prisma&logoColor=white)](https://www.prisma.io/) - ORM que facilita a interação com bancos de dados.
-   [![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/) - Banco de dados relacional de código aberto.
-   [![OpenAI API](https://img.shields.io/badge/-OpenAI-FF733E?logo=openai&logoColor=white)](https://beta.openai.com/) - API para processamento de linguagem natural e inteligência artificial.
-   [![TypeScript](https://img.shields.io/badge/-TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/) - Superset de JavaScript que adiciona tipagem estática à linguagem.
-   [![Fastify](https://img.shields.io/badge/-Fastify-202020?logo=fastify&logoColor=white)](https://www.fastify.io/) - Utilizado como adapter junto ao NestJS com foco em desempenho e escalabilidade.

### 🚀Funcionalidades

-   Conversação utilizando o poder do ChatGPT apenas mandando mensagens pelo WhatsApp. 🤝💬
-   Geração de imagens utilizando o comando `/imagine seu prompt`. 🖼️🤖
-   Limpeza do histórico de mensagens do banco de dados utilizando o comando `/clear`. 🗑️
-   Obtenha ajuda sobre os comandos disponíveis utilizando o comando `/help`. ❓🤔

Veja a imagem abaixo como exemplo:
[![Exemplo de imagem](https://i.postimg.cc/RVqv61bP/image.png)](https://postimg.cc/Tp8zBbxm)

###  🧪Como usar?

Para começar a utilizar o BOT, siga os seguintes passos:

1.  Envie uma mensagem de texto com o texto para o whatsapp +55 (88) 98147-8937 ou [clique aqui](https://wa.me/558881478937?text=Ola).
    
    
2. A mensagem será encaminhada para a API ChatGPT responder de forma automática. Ao utilizar o ambiente é importante lembrar que todas as mensagens enviadas e recebidas são armazenadas em um banco de dados. Essas mensagens serão mantidas no banco de dados até que o comando `/clear` seja executado para limpar o histórico.

Além disso, ao utilizar a API ChatGPT e Dall-E, é importante lembrar que os termos de uso da [OpenAI]([https://beta.openai.com/terms/](https://beta.openai.com/terms/)) também se aplicam. Certifique-se de ler e concordar com esses termos antes de utilizar a API.

### 🛠️Instalação e Configuração

Para instalar e configurar a API, siga os passos abaixo:

1.  Crie uma conta na OpenAI e pegue suas credenciais. Crie o arquivo `.env`. O arquivo `.env.example` está na raiz do projeto. Veja o exemplo abaixo:

```
OPENAI_API_KEY=
DATABASE_URL=
BOT_PERSONA="Persona do Bot"

```

O campo `DATABASE_URL` deve ser preenchido com a URL do seu banco de dados. Por padrão, está configurado para utilizar o PostgreSQL.

2.  Instale as dependências do projeto com o seguinte comando:

```bash
npm install
```

3.  Inicie a API em localhost com o comando:

```bash
npm run start:dev
```

4. Aguarde aparecer o QR Code no Terminal, no Whatsapp do seu celular entre em "Aparelhos Conectados" e scanneie o QR Code Gerado.

5. Agora é só enviar mensagem para o seu número e aguardar a resposta.