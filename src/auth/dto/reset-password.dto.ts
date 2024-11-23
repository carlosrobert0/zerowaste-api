import { IsString } from "class-validator";


export class ResetPasswordDto {
  @IsString()
  id: string;

  @IsString()
  userType: string;

  @IsString()
  newPassword: string;
}