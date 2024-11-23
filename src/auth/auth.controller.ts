import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put, Request,
  UseGuards
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from './auth.service';
import { IsPublic } from './decorators/is-public.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthRequest } from './models/AuthRequest';
import { ApiBody } from '@nestjs/swagger';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) { }

  @IsPublic()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: 'johndoe@gmail.com',
        },
        password: {
          type: 'string',
          example: 'password123',
        },
      },
    }
  })
  async login(@Request() req: AuthRequest) {
    return this.authService.login(req.user);
  }

  // @Get('forgot-password/:email')
  // async sendEmailForgotPassword(@Param() params): Promise<IResponse> {
  //   try {
  //     var isEmailSent = await this.authService.sendEmailForgotPassword(params.email);
  //     if(isEmailSent){
  //       return new ResponseSuccess("LOGIN.EMAIL_RESENT", null);
  //     } else {
  //       return new ResponseError("REGISTRATION.ERROR.MAIL_NOT_SENT");
  //     }
  //   } catch(error) {
  //     return new ResponseError("LOGIN.ERROR.SEND_EMAIL", error);
  //   }
  // }

  @IsPublic()
  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    try {
      const user = await this.authService.findUserByEmail(forgotPasswordDto.email);

      if (JSON.stringify(user) === '{}') {
        throw new NotFoundException('Usuário não encontrado!');
      }

      const resetToken = await this.authService.generateResetToken({...user, updatedAt: new Date()});

      return { user, token: resetToken };
    } catch (error) {
      throw new NotFoundException(error?.response?.message);
    }
  }

  @Put('reset-password/:token')
  async resetPassword(@Param('token') token: string, @Body() resetPasswordDto: ResetPasswordDto) {

    const isValidToken = await this.authService.validateResetToken(token);

    if (!isValidToken) {
      throw new BadRequestException('Token de redefinição de senha inválido ou expirado');
    }

    await this.authService.resetUserPassword(token, resetPasswordDto.id, resetPasswordDto.newPassword, resetPasswordDto.userType);

    return { message: 'Senha redefinida com sucesso' };
  }

  @Put('change-password')
  async changePassword(@Body() changePassword: ChangePasswordDto) {
    const isValidPassword = await this.authService.validatePassword(changePassword.oldPassword, changePassword.id, changePassword.userType);
    if (!isValidPassword) {
      throw new BadRequestException('Senha atual incorreta!');
    }


    await this.authService.changeUserPassword(changePassword.id, changePassword.newPassword, changePassword.userType);

    return { message: 'Senha alterada com sucesso' };
  }

  // @Post('email/reset-password')
  // @HttpCode(HttpStatus.OK)
  // async setNewPassord(@Body() resetPassword: ResetPasswordDto): Promise<IResponse> {
  //   try {
  //     var isNewPasswordChanged: boolean = false;
  //     if (resetPassword.email && resetPassword.currentPassword) {
  //       var isValidPassword = await this.authService.checkPassword(resetPassword.email, resetPassword.currentPassword);
  //       if (isValidPassword) {
  //         isNewPasswordChanged = await this.userService.setPassword(resetPassword.email, resetPassword.newPassword);
  //       } else {
  //         return new ResponseError("RESET_PASSWORD.WRONG_CURRENT_PASSWORD");
  //       }
  //     } else if (resetPassword.newPasswordToken) {
  //       var forgottenPasswordModel = await this.authService.getForgottenPasswordModel(resetPassword.newPasswordToken);
  //       isNewPasswordChanged = await this.userService.setPassword(forgottenPasswordModel.email, resetPassword.newPassword);
  //       if (isNewPasswordChanged) await forgottenPasswordModel.remove();
  //     } else {
  //       return new ResponseError("RESET_PASSWORD.CHANGE_PASSWORD_ERROR");
  //     }
  //     return new ResponseSuccess("RESET_PASSWORD.PASSWORD_CHANGED", isNewPasswordChanged);
  //   } catch (error) {
  //     return new ResponseError("RESET_PASSWORD.CHANGE_PASSWORD_ERROR", error);
  //   }
  // }

  // @IsPublic()
  // @Get('confirm/:token')
  // async confirmEmail(@Param('token') token: string) {
  //   try {
  //     const decodedToken = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });

  //     const user = await this.prisma.user.findUnique({
  //       where: { id: decodedToken.id },
  //     });

  //     if (user) {
  //       await this.prisma.user.update({
  //         where: { id: user.id },
  //         data: { isConfirmed: true },
  //       });

  //       return true
  //     }
  //   } catch (error) {
  //     return false
  //   }
  // }
}