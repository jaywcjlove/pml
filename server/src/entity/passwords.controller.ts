import * as Papa from 'papaparse';
import { Controller, DSource, DataSource } from 'typenexus';
import { Get, Post, Delete, Put } from 'typenexus';
import { Param, Body, BodyParam } from 'typenexus';
import {
  UseBefore,
  NotFoundError,
  NotAcceptableError,
  Authorized,
  SessionParam,
  Repository,
  FindOptionsSelect,
  InsertResult,
} from 'typenexus';
import { User } from './user.entity.js';
import { PaginationMiddleware, PaginationAwareObject } from '../middleware/Pagination.js';
import { Passwords } from './passwords.entity.js';
import { decrypt, encrypt } from '../utils/password.js';

const selectOptions: FindOptionsSelect<Passwords> = {
  id: true,
  title: true,
  username: true,
  password: true,
  notes: true,
  url: true,
  creator: {
    id: true,
    isAdmin: true,
    email: true,
    name: true,
  },
  deleteAt: true,
  updateAt: true,
  createAt: true,
};

@Controller('/passwords')
export class PasswordsController {
  public reps: Repository<Passwords>;
  constructor(@DSource() public dataSource: DataSource) {
    this.reps = this.dataSource.getRepository(Passwords);
  }
  @Authorized()
  @Get()
  @UseBefore(PaginationMiddleware)
  public async all(@SessionParam('userInfo') userInfo: User): Promise<PaginationAwareObject<Passwords>> {
    return this.reps
      .createQueryBuilder('passwords')
      .leftJoinAndSelect('passwords.creator', 'creator')
      .setFindOptions({
        select: selectOptions,
        relations: {
          creator: true,
        },
      })
      .where(`creator.id = :userId`, { userId: userInfo.id })
      .addOrderBy('passwords.createAt', 'DESC')
      .paginate(100);
  }

  @Authorized()
  @Post('/:passwordId/decrypt')
  public async decrypt(
    @Param('passwordId') passwordId: number,
    @SessionParam('userInfo') userInfo: User,
  ): Promise<Pick<Passwords, 'password'>> {
    const result = await this.reps.findOne({
      where: { id: passwordId, creator: { id: userInfo.id } },
      select: selectOptions,
      relations: {
        creator: true,
      },
    });
    if (result.password) {
      const [raw, key, iv] = result.password.split('.');
      if (!raw || !iv || !key) {
        throw new NotAcceptableError(`密码 ${passwordId} 数据源错误！`);
      }
      return { password: decrypt(result.password) };
    }
    throw new NotFoundError(`密码 ${passwordId} 不存在！`);
  }

  @Authorized()
  @Get('/:passwordId')
  public async one(
    @Param('passwordId') passwordId: number,
    @SessionParam('userInfo') userInfo: User,
  ): Promise<Passwords> {
    const result = await this.reps.findOne({
      where: { id: passwordId, creator: { id: userInfo.id } },
      select: selectOptions,
      relations: {
        creator: true,
      },
    });
    if (!result) {
      throw new NotFoundError(`密码 ${passwordId} 不存在！`);
    }
    return result;
  }

  @Authorized()
  @Post()
  public async create(
    @BodyParam('title') title: string,
    @BodyParam('url') url: string,
    @BodyParam('username') username: string,
    @BodyParam('password') password: string,
    @BodyParam('notes') notes: string,
    @SessionParam('userInfo') userInfo: User,
  ): Promise<Passwords> {
    const user = await this.dataSource.getRepository(User).findOne({
      where: { id: userInfo.id },
      select: selectOptions.creator,
    });
    if (!user) {
      throw new NotFoundError(`用户 ${user.id} 存在！`);
    }
    const data = new Passwords();
    data.title = title;
    data.username = username;
    data.password = password ? encrypt(password) : password;
    data.url = url;
    data.notes = notes;
    data.creator = user;
    return this.reps.save(data);
  }

  @Authorized()
  @Delete('/:passwordId')
  public async del(
    @Param('passwordId') passwordId: number,
    @SessionParam('userInfo') userInfo: User,
  ): Promise<{ message: string }> {
    const data = await this.reps.findOne({
      where: { id: passwordId, creator: { id: userInfo.id } },
    });
    if (!data) {
      throw new NotFoundError(`密码 ${passwordId} 不存在或没有权限删除！`);
    }
    await this.reps.remove(data);
    return { message: '密码删除成功！' };
  }

  @Authorized()
  @Put('/:passwordId')
  public async modify(
    @Param('passwordId') passwordId: number,
    @SessionParam('userInfo') userInfo: User,
    @Body() body: Passwords,
  ): Promise<{ message: string }> {
    if (body.password) {
      body.password = body.password ? encrypt(body.password) : body.password;
    }
    const result = await this.reps.update(
      { id: passwordId, creator: { id: userInfo.id } },
      Object.assign(body, { creator: { id: userInfo.id } }),
    );
    if (result.affected === 0) {
      throw new NotFoundError(`密码 ${passwordId} 更新失败！`);
    }
    return { message: '密码更新成功！' };
  }

  @Authorized()
  @Post('/import/csv/text')
  public async importCSVText(
    @BodyParam('data') data: string,
    @SessionParam('userInfo') userInfo: User,
  ): Promise<{ message: string } | InsertResult['raw']> {
    try {
      const user = await this.dataSource.getRepository(User).findOne({
        where: { id: userInfo.id },
      });
      const result = Papa.default.parse(data, {
        skipEmptyLines: true,
      });
      if (result.data.length === 0) {
        throw new NotFoundError(`CSV 数据为空！`);
      }
      const values = result.data.map(([title, username, password, url, notes]) => {
        return {
          title,
          username,
          password: password ? encrypt(password) : password,
          url,
          notes,
          creator: user,
        };
      });
      const resultValues = await this.dataSource.createQueryBuilder().insert().into(Passwords).values(values).execute();
      return resultValues.raw;
    } catch (error) {
      throw new NotAcceptableError(`导入 CSV 数据错误： ${error.message}`);
    }
  }

  @Authorized()
  @Post('/import/json')
  public async importMacpassXML(
    @BodyParam('data') data: string,
    @SessionParam('userInfo') userInfo: User,
  ): Promise<{ message: string } | InsertResult['raw']> {
    try {
      const user = await this.dataSource.getRepository(User).findOne({
        where: { id: userInfo.id },
      });
      const result = JSON.parse(data) as Array<{
        title?: string;
        username?: string;
        password?: string;
        url?: string;
        notes?: string;
      }>;
      if (result.length === 0) {
        throw new NotFoundError(`XML 数据为空！`);
      }
      const values = result.map((item) => {
        const { title, username, password, url, notes } = item || {};
        return {
          title,
          username,
          password: password ? encrypt(password.toString()) : password,
          url,
          notes,
          creator: user,
        };
      });
      const resultValues = await this.dataSource.createQueryBuilder().insert().into(Passwords).values(values).execute();
      return resultValues.raw;
    } catch (error) {
      throw new NotAcceptableError(`导入 XML 数据错误： ${error.message}`);
    }
  }
}
