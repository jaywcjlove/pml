import { Controller, ContentType, Get, Param, Post, Delete, Res, Req, DSource, DataSource, ILike } from 'typenexus';
import {
  Body,
  BodyParam,
  UseBefore,
  NotFoundError,
  BadRequestError,
  Authorized,
  UnauthorizedError,
  SessionParam,
  Repository,
} from 'typenexus';
import { Response, Request } from 'express';
import crypto from 'crypto';
import { User } from './user.entity.js';
import { PaginationMiddleware, PaginationAwareObject } from '../middleware/Pagination.js';

// Fix type error issue
// e.g: `req.session.userInfo`
import 'express-session';

interface UserResult {
  code: number;
  message: string;
  token?: string;
}

const secretKey = 'secret-pml-2023';

@Controller('/users')
export class UserController {
  private reps: Repository<User>;
  constructor(@DSource() private dataSource: DataSource) {
    this.reps = this.dataSource.getRepository(User);
  }

  @ContentType('application/json')
  @Authorized()
  @Get()
  @UseBefore(PaginationMiddleware)
  public async all(@SessionParam('userInfo') userInfo: User): Promise<PaginationAwareObject<User>> {
    if (!userInfo.isAdmin) {
      throw new UnauthorizedError('没有权限');
    }
    return (
      this.reps
        .createQueryBuilder('user')
        // .where(`user.isAdmin = :isAdmin`, { isAdmin: true })
        .paginate()
    );
  }

  @Post('/login')
  public async login(
    @BodyParam('email') email: string,
    @BodyParam('password') password: string,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<User | UserResult> {
    if (!email) {
      res.status(332);
      return { code: 1, message: '请输入登录账号' };
    }
    if (!password) {
      res.status(331);
      return { code: 2, message: '请输入登录密码' };
    }

    const hashPassword = crypto.createHmac('sha256', password).digest('hex');
    const userInfo = await this.dataSource.manager.findOne(User, {
      where: { email, password: hashPassword },
      select: ['email', 'id', 'name', 'isAdmin', 'createAt', 'deleteAt'],
    });
    if (!userInfo) {
      res.status(401);
      return { code: 3, message: '用户名或密码错误' };
    }
    if (req.session?.token) {
      const { token, userInfo: sessionUserInfo } = req.session;
      return { ...userInfo, token, ...sessionUserInfo };
    }
    const token = crypto
      .createHmac('sha256', secretKey)
      .update(`${email}${Math.floor(Date.now() / 1000)}`)
      .digest('hex');
    req.session.token = token;
    req.session.userInfo = userInfo;
    req.session.userId = userInfo.id;
    return { ...userInfo, token };
  }
  @Get('/verify')
  public async verify(
    @SessionParam('token') token: string,
    @SessionParam('userInfo') userInfo: User,
    @Res() res: Response,
  ): Promise<User | UserResult> {
    if (token) {
      return { token, ...userInfo };
    }
    res.status(401);
    return { code: 401, message: 'Expired, please login again! ' };
  }
  @Get('/:userId')
  @Authorized()
  public async detail(
    @Param('userId') userId: string,
    @Res() res: Response,
    @SessionParam('userInfo') userInfo: User,
  ): Promise<User | UserResult> {
    if (!userInfo.isAdmin || (userInfo.id !== Number(userId) && !userInfo.isAdmin)) {
      throw new UnauthorizedError('没有权限');
    }
    const info = await this.dataSource.manager.findOneBy(User, {
      id: userId as unknown as number,
    });
    if (!info) res.status(404);
    return info;
  }
  @Post('/search')
  @Authorized()
  public async search(
    @Body() body: User,
    @Res() res: Response,
    @SessionParam('userInfo') userInfo: User,
  ): Promise<User | UserResult> {
    if (!body.email) {
      throw new BadRequestError('请输入搜索邮箱关键字');
    }
    const info = await this.reps.findOne({ where: { email: ILike('%' + (body.email || '') + '%') } });
    if (!info) throw new NotFoundError('没有找到用户');
    return info;
  }
  @Post('/logout')
  public async logout(@Req() req: Request, @Res() res: Response) {
    const destroy = () =>
      new Promise((resolve, reject) => {
        req.session.destroy((error) => {
          res.status(error ? 500 : 200);
          error ? reject({ ...error }) : resolve({ message: 'Logout successful!' });
        });
      });
    return destroy();
  }
  @Post()
  @Authorized()
  public async create(@Body() body: User, @Res() res: Response) {
    if (body.password) {
      body.password = crypto.createHmac('sha256', body.password).digest('hex');
    }
    const userEntity = this.dataSource.manager.create(User, { ...body });
    try {
      const userInfo = await this.dataSource.manager.save(userEntity);
      delete userInfo.password;
      return userInfo;
    } catch (error) {
      res.status(409);
      return { message: error.message || 'User already exists and cannot be created.' };
    }
  }
  @Post('/signup')
  public async signup(@Body() body: User, @Res() res: Response) {
    if (body.password) {
      body.password = crypto.createHmac('sha256', body.password).digest('hex');
    }
    const user = await this.dataSource.manager.findOne(User, { where: { email: body.email } });
    if (user) {
      res.status(409);
      return { message: '用户已存在，不能注册新用户' };
    }
    const userEntity = this.dataSource.manager.create(User, { ...body });
    try {
      const userInfo = await this.dataSource.manager.save(userEntity);
      delete userInfo.password;
      return userInfo;
    } catch (error) {
      res.status(409);
      return { message: 'User already exists and cannot be created.' };
    }
  }
  @Delete('/:userId')
  @Authorized()
  public async remove(@Param('userId') userId: string, @SessionParam('userInfo') userInfo: User, @Res() res: Response) {
    if (!userInfo.isAdmin) {
      throw new UnauthorizedError('没有权限');
    }
    const result = await this.dataSource.manager.softDelete(User, userId);
    res.status(result.affected ? 200 : 404);
    return result.affected ? { message: 'Deletion successful!' } : { message: 'Deletion failed!' };
  }
}
