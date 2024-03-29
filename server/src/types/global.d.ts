import 'express-session';
import { User } from '../entity/user.entity.ts';

declare module 'express-session' {
  interface SessionData {
    token: string;
    /** 用户ID */
    userId: number;
    /** 用户信息 */
    userInfo: Record<keyof User, any> | undefined;
  }
}
