import { Controller, Param, DSource, DataSource, Put } from 'typenexus';
import { Get, Post, Delete } from 'typenexus';
import {
  Body,
  BodyParam,
  UseBefore,
  NotFoundError,
  Authorized,
  SessionParam,
  Repository,
  FindOptionsSelect,
} from 'typenexus';
import { User } from './user.entity.js';
import { PaginationMiddleware } from '../middleware/Pagination.js';
import { Category } from './category.entity.js';

const selectOptions: FindOptionsSelect<Category> = {
  id: true,
  name: true,
  creator: {
    id: true,
    isAdmin: true,
    email: true,
    name: true,
  },
  parent: {
    id: true,
    name: true,
  },
  deleteAt: true,
  createAt: true,
};

@Controller('/category')
export class CategoryController {
  private reps: Repository<Category>;
  constructor(@DSource() private dataSource: DataSource) {
    this.reps = this.dataSource.getRepository(Category);
  }

  @Authorized()
  @Get()
  @UseBefore(PaginationMiddleware)
  public async all(@SessionParam('userInfo') userInfo: User): Promise<Category[]> {
    return this.dataSource.manager.getTreeRepository(Category).findTrees();
  }

  @Authorized()
  @Get('/:categoryId')
  @UseBefore(PaginationMiddleware)
  public async one(
    @Param('categoryId') categoryId: number,
    @SessionParam('userInfo') userInfo: User,
  ): Promise<Category> {
    return this.reps.findOne({
      where: { id: categoryId, creator: { id: userInfo.id } },
      select: selectOptions,
      relations: {
        parent: true,
        creator: true,
      },
    });
  }

  @Authorized()
  @Post()
  public async create(@BodyParam('name') name: string, @SessionParam('userInfo') userInfo: User): Promise<Category> {
    const user = await this.dataSource.getRepository(User).findOne({
      where: { id: userInfo.id },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    if (!user) {
      throw new NotFoundError(`用户 ${user.id} 不存在！`);
    }
    const data = new Category();
    data.name = name;
    data.creator = user;
    return this.reps.save(data);
  }

  @Authorized()
  @Post('/:parentId')
  public async createChild(
    @BodyParam('name') name: string,
    @Param('parentId') parentId: number,
    @SessionParam('userInfo') userInfo: User,
  ): Promise<Category> {
    const category = await this.reps.findOne({
      where: { id: parentId },
      select: {
        id: true,
        name: true,
      },
    });
    if (!category) {
      throw new NotFoundError(`城市 ${parentId} 不存在！`);
    }
    const user = await this.dataSource.getRepository(User).findOne({
      where: { id: userInfo.id },
    });
    if (!user) {
      throw new NotFoundError(`用户 ${user.id} 不存在！`);
    }
    const data = new Category();
    data.name = name;
    data.parent = category;
    data.creator = user;
    const result = await this.reps.save(data);
    delete result.deleteAt;
    delete result.createAt;
    return result;
  }

  @Authorized()
  @Delete('/:categoryId')
  public async del(
    @Param('categoryId') categoryId: number,
    @SessionParam('userInfo') userInfo: User,
  ): Promise<{ message: string }> {
    const data = await this.reps.find({
      where: [
        { id: categoryId, creator: { id: userInfo.id } },
        { parent: { id: categoryId }, creator: { id: userInfo.id } },
      ],
    });
    if (data.length === 0) {
      throw new NotFoundError(`分类 ${categoryId} 不存在或没有权限删除！`);
    }
    await this.reps.remove(data);
    return { message: '删除成功！' };
  }

  @Authorized()
  @Put('/:categoryId')
  public async modify(
    @Param('categoryId') categoryId: number,
    @SessionParam('userInfo') userInfo: User,
    @Body() body: Category,
  ): Promise<{ message: string }> {
    const result = await this.reps.manager.update(Category, { id: categoryId }, { ...body });
    if (result.affected === 0) {
      throw new NotFoundError(`分类 ${categoryId} 更新失败！`);
    }
    return { message: '删除成功！' };
  }
}
