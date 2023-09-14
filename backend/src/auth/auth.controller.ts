import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  // когда успешно сделали авторизацию - выполняем метод login
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    // возвращает jwt-токен
    return this.authService.login(req.user);
  }

  // когда придет запрос на регистрацию - создай через userService юзера. Не забываем использовать декоратор @Body()
  @Post('register')
  register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }
}
