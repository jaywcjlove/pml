import { TypeNexus, Action } from 'typenexus';
import express from 'express';
import crypto from 'crypto';
import { config, adminAccount } from './config.js';
import { User } from './entity/user.entity.js';
import { UserController } from './entity/user.controller.js';
import { CategoryController } from './entity/category.controller.js';
import { PasswordsController } from './entity/passwords.controller.js';

import 'express-session';

declare module 'express-session' {
  interface SessionData {
    token: string;
    /** 用户ID */
    userId: number;
    /** 用户信息 */
    userInfo: Record<keyof User, any> | undefined;
  }
}

(async () => {
  const app = new TypeNexus(3002, config);
  app.express.use(express.static('public'));
  await app.connect();
  await app.dataSource.synchronize();
  // Check if an administrator account has been created.
  // 🚨 Please be sure to use it after `app.connect()`.
  const repos = app.dataSource.getRepository(User);
  // Check if there is an admin account.
  const adminUser = await repos.findOneBy({ email: 'wcj@admin.com' });
  if (!adminUser) {
    const hashPassword = crypto.createHmac('sha256', adminAccount.password).digest('hex');
    // Create an admin account.
    const user = await repos.create({
      ...adminAccount,
      isAdmin: true,
      password: hashPassword,
    });
    await repos.save(user);
  }

  app.authorizationChecker = async (action: Action, roles: string[]) => {
    // here you can use request/response objects from action
    // also if decorator defines roles it needs to access the action
    // you can use them to provide granular access check
    // checker must return either boolean (true or false)
    // either promise that resolves a boolean value
    // demo code:
    const token =
      action.request.query.token ||
      action.request.body.token ||
      (action.request.headers.authorization || '').replace(/^token\s/, '');
    if (action.request.session.token === token) return true;
    action.response.status(401);
    // return { code: 3, message: '用户名或密码错误' };
    return false;
  };

  app.controllers([UserController, CategoryController, PasswordsController]);
  app.express.disable('x-powered-by');
  await app.start();
})();
