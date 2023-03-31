export class CreateMessageDto {
  from: string;
  to: string;
  body: string;
  mediaUrl?: string;
}
