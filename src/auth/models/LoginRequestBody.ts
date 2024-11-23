import { IsEmail, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginRequestBody {
  @ApiProperty({
    description: 'The email of the user',
    type: String,
    example: 'johndoe@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    type: String,
    example: 'password123',
  })
  @IsString()
  password: string;
}