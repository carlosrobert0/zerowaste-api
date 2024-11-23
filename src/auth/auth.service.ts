import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedError } from './errors/unauthorized.error';
import { UserPayload } from './models/UserPayload';
import { UserToken } from './models/UserToken';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { Users } from 'src/users/entities/users.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async login(user: Users): Promise<UserToken> {
    const payload: UserPayload = {
      sub: user.id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async validateUser(email: string, password: string): Promise<Users> {
    const user = await this.usersService.findByEmail(email);

    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        return {
          ...user,
          password: undefined,
          updatedAt: new Date(),
        };
      } else {
        throw new UnauthorizedError(
          'Email ou senha incorretos.',
        );
      }
    }

    throw new UnauthorizedError(
      'Email ou senha incorretos.',
    );
  }

  async findUserByEmail(email: string) {

    const user = await this.usersService.findByEmail(email);

    return user;
  }

  async generateResetToken(user: Users): Promise<string> {
    const payload: UserPayload = {
      sub: user.id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    };

    return this.jwtService.sign(payload);
  }

  async forgotPassword(email: string) {
    const user = await this.findUserByEmail(email);
    if (!user) throw new UnauthorizedError('User not found');

    const token = await this.generateResetToken({...user, updatedAt: new Date()});

    return token
  }

  async validateResetToken(token: string) {
    const user = await this.usersService.findOne(parseInt(token));

    if (!user) {
      return false;
    }

    return true;
  }

  async resetUserPassword(token: string, id: string, newPassword: string, userType: string) {
    const isValidToken = await this.validateResetToken(id);

    if (!isValidToken) {
      throw new Error('Token de redefinição de senha inválido ou expirado');
    }

    const user = await this.usersService.findOne(parseInt(id));
    user.password = newPassword;
    await this.usersService.update(parseInt(id), user);
  }

  async changeUserPassword(id: string, newPassword: string, userType: string) {
    const user = await this.usersService.findOne(parseInt(id));

    if (!user) {
      throw new UnauthorizedError('Usuário não encontrado');
    }

    user.password = newPassword;

    await this.usersService.update(parseInt(id), user);
  }

  async validatePassword(password: string, id: string, userType: string) {
    const user = await this.usersService.findOne(parseInt(id));
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Senha atual incorreta!');
    }
    return true;
  }
}