import { IsDate, IsEmail, IsNumber, IsOptional, IsString } from "class-validator";
import {
  ApiProperty,
  ApiPropertyOptional,
  ApiHideProperty,
} from '@nestjs/swagger';

export class UpdateUserDto {
  @IsNumber()
  @ApiProperty({
    description: 'The id of the user',
    type: Number,
    example: 1,
  })
  id: number

  @IsString()
  @ApiProperty({
    description: 'The name of the user',
    type: String,
    example: 'John Doe',
  })
  name: string

  @IsEmail()
  @ApiProperty({
    description: 'The email of the user',
    type: String,
    example: 'johndoe@gmail.com',
  })
  email: string

  @IsString()
  @ApiProperty({
    description: 'The password of the user',
    type: String,
    example: 'password123',
  })
  password: string

  @IsString()
  @ApiProperty({
    description: 'The role of the user',
    type: String,
    example: 'consumer | establishment',
  })
  role: string

  @IsDate()
  @IsOptional()
  @ApiProperty({
    description: "The date the user was created",
    type: Date,
    example: new Date()
  })
  createdAt: Date

  @IsDate()
  @IsOptional()
  @ApiProperty({
    description: "The date the user was last updated",
    type: Date,
    example: new Date()
  })
  updatedAt: Date
}