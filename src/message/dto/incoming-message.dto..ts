import { IsString } from 'class-validator';
export class IncomingMessageDto {
  @IsString()
  readonly body: string;

  @IsString()
  readonly from: string;
}
