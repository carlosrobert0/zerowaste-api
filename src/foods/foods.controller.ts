import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { FoodsService } from './foods.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';

@ApiTags('foods')
@ApiBearerAuth()
@Controller('foods')
export class FoodsController {
  constructor(private readonly foodsService: FoodsService) {}

  @Post()
  @ApiCreatedResponse({ description: 'The record has been successfully created.' })
  @ApiOperation({ summary: 'Create a new food' })
  async create(@Body() createFoodDto: CreateFoodDto): Promise<any> {
    return await this.foodsService.create(createFoodDto);
  }

  @Get()
  @ApiOkResponse({ description: 'The records have been successfully retrieved.' })
  @ApiOperation({ summary: 'Retrieve all foods' })
  async findAll(): Promise<any> {
    return await this.foodsService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'The record has been successfully retrieved.' })
  @ApiOperation({ summary: 'Retrieve a food' })
  async findOne(@Param('id') id: string): Promise<any> {
    return await this.foodsService.findOne(+id);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'The record has been successfully updated.' })
  @ApiOperation({ summary: 'Update a food' })
  async update(@Param('id') id: string, @Body() updateFoodDto: UpdateFoodDto): Promise<any> {
    return await this.foodsService.update(+id, updateFoodDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'The record has been successfully deleted.' })
  @ApiOperation({ summary: 'Delete a food' })
  async remove(@Param('id') id: string): Promise<any> {
    return await this.foodsService.remove(+id);
  }
}
