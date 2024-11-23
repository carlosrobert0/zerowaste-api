import { IsString, IsNumber, IsDate, IsOptional } from 'class-validator';
import {
  ApiProperty,
  ApiPropertyOptional,
  ApiHideProperty,
} from '@nestjs/swagger';


export class CreateFoodDto {
  @IsString()
  @ApiProperty({
    description: 'The name of the food',
    type: String,
    example: 'Apple',
  })
  name: string;

  @IsString()
  @ApiProperty({
    description: 'The description of the food',
    type: String,
    example: 'A red apple',
  })
  description: string;

  @IsDate()
  @ApiProperty({
    description: 'The expiration date of the food',
    type: Date,
    example: '2021-12-31',
  })
  expiration: Date;

  @IsNumber()
  @ApiProperty({
    description: 'The quantity of the food',
    type: Number,
    example: 5,
  })
  quantity: number;

  @IsNumber()
  @ApiProperty({
    description: 'The price of the food',
    type: Number,
    example: 1.99,
  })
  price: number;

  @IsString()
  @ApiProperty({
    description: 'The location of the food',
    type: String,
    example: 'Fridge',
  })
  location: string;

  @IsString()
  @ApiProperty({
    description: 'The status of the food',
    type: String,
    example: 'Available',
  })
  status: string;

  @IsNumber()
  @ApiProperty({
    description: 'The user ID of the food',
    type: Number,
    example: 1,
  })
  userId: number;

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