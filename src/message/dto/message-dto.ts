import { IsString } from 'class-validator';
export class MessageDto {
  @IsString()
  readonly SmsMessageSid: string;

  @IsString()
  readonly NumMedia: string;

  @IsString()
  readonly ProfileName: string;

  @IsString()
  readonly SmsSid: string;

  @IsString()
  readonly WaId: string;

  @IsString()
  readonly SmsStatus: string;

  @IsString()
  readonly Body: string;

  @IsString()
  readonly To: string;

  @IsString()
  readonly NumSegments: string;

  @IsString()
  readonly ReferralNumMedia: string;

  @IsString()
  readonly MessageSid: string;

  @IsString()
  readonly AccountSid: string;

  @IsString()
  readonly From: string;

  @IsString()
  readonly ApiVersion: string;
}
