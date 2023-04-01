import { Injectable } from '@nestjs/common';
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai';
@Injectable()
export class OpenAiService {
  private configuration: Configuration;
  private openAI: OpenAIApi;

  constructor() {
    this.configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.openAI = new OpenAIApi(this.configuration);
  }

  async createChatCompletition(
    user: string,
    context: ChatCompletionRequestMessage[],
    content: string,
  ) {
    context.push({ role: 'user', content });
    try {
      const response = await this.openAI.createChatCompletion({
        model: 'gpt-3.5-turbo',
        user,
        messages: context,
      });
      const GPTResponse = response.data.choices[0].message.content;
      console.log(GPTResponse);
      return GPTResponse;
    } catch (e) {
      console.log(e);
      if (e.response.status === 400 || e.response.status === 429) {
        return e.response.status;
      } else {
        return;
      }
    }
  }

  async createImage(prompt: string) {
    try {
      const response = await this.openAI.createImage({
        prompt,
        n: 1,
        size: '1024x1024',
      });
      const imgURL = response.data.data[0].url;
      return imgURL;
    } catch (e) {
      return e.response.status;
    }
  }
}
