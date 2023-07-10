import { ActionFunction } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fetchFn } from '../utils/react-query';

export const login: ActionFunction = async ({ request }) => {
  const toastId = toast.loading('正在登陆中...');
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  if (!data.email) {
    return Promise.resolve({ code: 0, message: '请输入账号!' });
  }
  if (!data.password) {
    return Promise.resolve({ code: 0, message: '请输入密码!' });
  }
  const result = await fetchFn('/api/users/login', { ...request, method: 'POST', body: JSON.stringify(data) });
  const resultData = await result.json();
  if (result.status !== 200) {
    toast.error(`登录失败! ${resultData.message}`, { id: toastId });
    return { statusCode: result.status, message: resultData.message || '添加密码失败!' };
  }
  toast.success(`登录成功!`, { id: toastId });
  return resultData;
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
