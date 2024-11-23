import { Body, Controller, Post, Get, Patch, Put, Delete, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {
  }
  
  @IsPublic()
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<any> {
    try {
      return await this.usersService.create(createUserDto);
    } catch (error) {
      return error;
    }
  }

  @Get()
  async  findAll(): Promise<any> {
    return await this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<any> {
    return await this.usersService.findOne(+id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<any> {
    return await this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<any> {
    return await this.usersService.remove(+id);
  }
}
