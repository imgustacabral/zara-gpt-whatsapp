import { IsString } from 'class-validator';
export class MessageDto {
  @IsString()
  readonly Body: string;

  @IsString()
  readonly From: string;
}
