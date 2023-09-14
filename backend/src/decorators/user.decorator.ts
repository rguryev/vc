import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from '../user/entities/user.entity';

// создаем кастомный декоратор, говорим: Когда его будут использовать - дай контекст ctx который есть у этого запроса, вытащи сам запрос request, и если бэкенд вернул информацию о том, что я авторизован - вернет инфу о юзере (что задали в jwt.strategy)
export const User = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): UserEntity => {
    const request = ctx.switchToHttp().getRequest();
    return request.user.id;
  },
);
