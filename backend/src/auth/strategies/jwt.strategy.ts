import { Injectable } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';

// расшифровка jwt
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'test',
    });
  }

  // если расшифровался токен - возвращаем расшифрованные данные, возвращает весь объект, который будем использовать при решении разрешать/запрещать просматривать страницу.
  async validate(payload: { sub: number; email: string }) {
    // валидация на случай, если пользователя уже нет, хоть токен и остался.
    const data = { id: payload.sub, email: payload.email };
    // user - это промис (неотрицательное значение, поэтому если не ставить await, то будет допускаться и проходить валидацию. Ставим await т.к это обращение к бд, т.е асинхронщина)
    const user = await this.userService.findByCond(data);

    if (!user) {
      throw new UnauthorizedException('Нет доступа к этой странице');
    }
    return {
      email: user.email,
      id: user.id,
    };
  }
}
