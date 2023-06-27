import { ActionFunction } from 'react-router-dom';
import { fetchFn } from '../utils/react-query';

export const login: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  if (!data.email) {
    return Promise.resolve({ code: 0, message: '请输入账号!' });
  }
  if (!data.password) {
    return Promise.resolve({ code: 0, message: '请输入密码!' });
  }
  return fetchFn('/api/users/login', { ...request, method: 'POST', body: JSON.stringify(data) });
};

export const signup: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  if (!data.email) {
    return Promise.resolve({ code: 0, message: '请输入账号!' });
  }
  if (!data.password) {
    return Promise.resolve({ code: 0, message: '请输入密码!' });
  }
  if (data.password !== data.confirmPassword) {
    return Promise.resolve({ code: 0, message: '两次密码输入不一致!' });
  }
  delete data.confirmPassword;
  const user = await fetchFn('/api/users/signup', { ...request, method: 'POST', body: JSON.stringify(data) });
  return user;
};
