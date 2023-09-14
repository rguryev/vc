import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from 'src/comment/entities/comment.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { SearchUserDto } from './dto/search-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>,
  ) {}

  create(dto: CreateUserDto) {
    return this.repository.save(dto);
  }

  async findAll() {
    const arr = await this.repository
      .createQueryBuilder('u')
      // leftJoin - получение всех комментариев
      // MapMany - возьмет каждый коммент, возьмет CommentEntity и назовет его как 'comment' и будет сравнивать вот этот комментарий который есть в таблице в CommentEntity в коментс, его userId (comment.userId) равен ли нашему юзер-айди (u.id - т.е тому пользователю, который есть в списке) Если равен - то его оставлять конкретному пользователю в поле 'u.comments'
      .leftJoinAndMapMany(
        'u.comments',
        CommentEntity,
        'comment',
        'comment.userId = u.id',
      )
      // loadRelationCountAndMap - подгрузи все зависимости и прикрепи к этой сущности свойство 'u.commentsCount', прикрути к свойству u.commentsCount все комментарии ('u.comments'), посчитай количество этих комментариев и помести это количество в свойство u.commentsCount.
      .loadRelationCountAndMap('u.commentsCount', 'u.comments', 'comments')
      .getMany();

    return arr.map((obj) => {
      // убираем сами комменты т.к это не нужно.
      delete obj.comments;
      return obj;
    });
  }

  findById(id: number) {
    return this.repository.findOne(id);
  }

  findByCond(cond: LoginUserDto) {
    return this.repository.findOne(cond);
  }

  update(id: number, dto: UpdateUserDto) {
    return this.repository.update(id, dto);
  }

  async search(dto: SearchUserDto) {
    const qb = this.repository.createQueryBuilder('u');

    qb.limit(dto.limit || 0);
    qb.take(dto.take || 10);

    if (dto.fullName) {
      qb.andWhere(`u.fullName ILIKE :fullName`);
    }
    if (dto.email) {
      qb.andWhere(`u.email ILIKE :email`);
    }

    qb.setParameters({
      fullName: `%${dto.fullName}%`,
      email: `%${dto.email}%`,
    });

    const [items, total] = await qb.getManyAndCount();

    return { items, total };
  }
}
