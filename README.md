
## 🤖 API ChatGPT para WhatsApp

Esta é uma API de um projeto pessoal que utiliza a Twilio e o modelo GPT-3.5 Turbo para responder mensagens do WhatsApp de forma automatizada, além de utilizar o Dall-E para gerar imagens a partir de prompts.

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

1.  Envie uma mensagem de texto com o texto "join box-fire" para o número de telefone +1 (415) 523-8886.
    
2.  Aguarde a mensagem de confirmação informando que você entrou no ambiente sandbox.
    
3.  Envie uma nova mensagem para o número do sandbox. A mensagem será encaminhada para a API ChatGPT responder de forma automática.
Ao utilizar o ambiente sandbox para testes, é importante lembrar que todas as mensagens enviadas e recebidas são armazenadas em um banco de dados. Essas mensagens serão mantidas no banco de dados até que o comando `/clear` seja executado para limpar o histórico.

Além disso, ao utilizar a API ChatGPT e Dall-E, é importante lembrar que os termos de uso da [OpenAI]([https://beta.openai.com/terms/](https://beta.openai.com/terms/)) também se aplicam. Certifique-se de ler e concordar com esses termos antes de utilizar a API.

Também é necessário concordar com os termos de uso da Twilio, que pode ser encontrados [aqui](https://www.twilio.com/legal/tos).


### 🛠️Instalação e Configuração

Para instalar e configurar a API, siga os passos abaixo:

1.  Crie uma conta na Twilio e OpenAI e pegue suas credenciais. Preencha no arquivo `.env`. O arquivo `.env.example` está na raiz do projeto. Veja o exemplo abaixo:

```
OPENAI_API_KEY=<sua-chave-da-OpenAI>
TWILIO_ACCOUNT_SID=<seu-SID-da-Twilio>
TWILIO_AUTH_TOKEN=<seu-token-de-autenticação-da-Twilio>
DATABASE_URL=<url-do-seu-banco-de-dados>` 
```

O campo `DATABASE_URL` deve ser preenchido com a URL do seu banco de dados. Por padrão, está configurado para utilizar o PostgreSQL.

2.  Instale as dependências do projeto com o seguinte comando:

```bash
npm install
```

3.  Rode a API em localhost com o comando:

```bash
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
````

Assim, a Twilio enviará um webhook com as mensagens e imagens recebidas para esta URL e a API ChatGPT será capaz de responder às mensagens de forma automatizada.