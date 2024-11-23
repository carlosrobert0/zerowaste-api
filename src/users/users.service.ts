import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,  
  ) {}
  
  async create(createUserDto: User) {
    const userAlreadyExists = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (userAlreadyExists) {
      throw new ConflictException('User already exists');
    }

    const data = {
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    }

    const user = await this.prisma.user.create({ data });

    const confirmationToken = await this.jwtService.signAsync({
      id: user.id,
      email: user.email,
      role: user.role,
    }, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1d',
    }) 

    return {
      ...user,
      confirmationToken,
    }
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return user;
  }

  async update(id: number, updateUserDto: User) {
    return await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.user.delete({
      where: { id },
    });
  }
}
