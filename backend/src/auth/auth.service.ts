import { Injectable } from '@nestjs/common';
import { Body } from '@nestjs/common/decorators';
import { ForbiddenException } from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt';
import { throwError } from 'rxjs';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByCond({
      email,
      password,
    });
    if (user && user.password === password) {
      // деструктуризация: вытащи все из user, кроме пароля
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // Создаем метод, который будет брать id и email юзера и возвращать токен
  generateJwtToken(data: { id: number; email: string }) {
    const payload = { email: data.email, sub: data.id };

    return this.jwtService.sign(payload);
  }

  async login(user: UserEntity) {
    const { password, ...userData } = user;
    return {
      ...userData,
      token: this.generateJwtToken(userData),
    };
  }

  // пишем логику регистрации: функция регистрации принимает dto юзера + покрывает декоратором @Body
  async register(@Body() dto: CreateUserDto) {
    try {
      // Используем метод create из другого сервиса - UserService.service.ts и передаем в него dto юзера, метод create с помощью TypeORM регает пользователя в БД и возвращает этого юзера.
      // Заносим всего юзера (кроме поля passport) в переменную user.
      // Передаем в .create только то, что нужно передать в БД, точно контролируем данные тут в бэке, не доверяемся на валидацию фронта.
      const { password, ...userData } = await this.userService.create({
        email: dto.email,
        fullName: dto.fullName,
        password: dto.password,
      });
      // Возвращаем юзера + его токен доступа (который генерирутся в методе generateJwtToken который делали выше)
      return {
        ...userData,
        token: this.generateJwtToken(userData),
      };
    } catch (error) {
      throw new ForbiddenException('Ошибка при регистрации');
    }
  }
}
