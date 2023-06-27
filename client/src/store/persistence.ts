import { InitialState } from './';

export const USER_INFO = 'pml-userinfo';
export const getUserInfo = (): InitialState['user'] => JSON.parse(localStorage.getItem(USER_INFO) || '{}');
export const setUserInfo = (data: Partial<InitialState['user']> = {}) =>
  localStorage.setItem(USER_INFO, JSON.stringify(data));
export const removeUserInfo = () => localStorage.removeItem(USER_INFO);

export const TOKEN_NAME = 'pml-token';
export const getToken = () => localStorage.getItem(TOKEN_NAME);
export const removeToken = () => localStorage.removeItem(TOKEN_NAME);
export const setToken = (val: string) => localStorage.setItem(TOKEN_NAME, val);
