import { Controller, Get } from '@nestjs/common';
import { Users } from 'src/users/entities/users.entity';
import { CurrentUser } from './auth/decorators/current-user.decorator';

@Controller()
export class AppController {
  @Get("/me")
  getMe(@CurrentUser() user: Users) {
    return user
  }
}
