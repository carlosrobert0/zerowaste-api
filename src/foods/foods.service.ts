import { Injectable } from '@nestjs/common';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FoodsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createFoodDto: CreateFoodDto) {
    const food = await this.prisma.food.create({ data: createFoodDto });
    return food;
  }

  async findAll() {
    const foods = await this.prisma.food.findMany();
    return foods;
  }

  async findOne(id: number) {
    const food = await this.prisma.food.findUnique({ where: { id } });
    return food;
  }

  async update(id: number, updateFoodDto: UpdateFoodDto) {
    const food = await this.prisma.food.update({
      where: { id },
      data: updateFoodDto,
    });
    return food;
  }

  async remove(id: number) {
    return await this.prisma.food.delete({ where: { id } });
  }
}
