import { IsString } from "class-validator";

export class CreateMessageDto{
    @IsString()
    readonly body:string;

    @IsString()
    readonly to:string;
}