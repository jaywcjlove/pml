import { ActionFunction, LoaderFunction, redirect, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fetchFn } from 'src/utils/react-query';

const getUrl = () => {
  const uri = new URLSearchParams(window.location.href.split('?')[1] || '');
  return uri.size ? `?` + uri.toString() : '';
};

export const getPasswordList: LoaderFunction = async ({ request, params }): Promise<any> => {
  const uri = new URLSearchParams(request.url.split('?')[1] || '');
  const result = await fetchFn(`/api/passwords?${uri.toString()}`, { ...request, method: 'GET' });
  if (result.status === 401) {
    return redirect('/login');
  }
  return result;
};

export const getPassword: LoaderFunction = async ({ request, params }): Promise<any> => {
  const result = await fetchFn(`/api/passwords/${params.id}`, { ...request, method: 'GET' });
  if (result.status === 401) {
    return redirect('/login');
  }
  return result;
};

export const removePassword: ActionFunction = async ({ request, params, context }): Promise<any> => {
  let toastId = toast.loading('正在删除密码中...');
  const result = await fetchFn(`/api/passwords/${params.id}`, {
    ...request,
    method: 'DELETE',
  });
  if (result.status === 401) {
    toast.error('请重新登录!', { id: toastId });
    return redirect('/login');
  }
  if (result.status !== 200) {
    toast.error('删除密码失败!', { id: toastId });
    return { statusCode: result.status, message: '删除密码失败!' };
  }
  toast.success(`删除密码 ${params.id} 成功!`, { id: toastId });
  return redirect(`/passwords${getUrl()}`);
};

export const addPassword: ActionFunction = async ({ request, params }): Promise<any> => {
  let toastId = toast.loading('正在添加密码中...');
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const result = await fetchFn(`/api/passwords`, {
    ...request,
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (result.status === 401) {
    toast.error('请重新登录!', { id: toastId });
    return redirect('/login');
  }
  if (result.status !== 200) {
    toast.error('添加密码失败!', { id: toastId });
    return { statusCode: result.status, message: '添加密码失败!' };
  }
  const resultData = await result.json();
  toast.success(`添加密码 ${resultData.id} 成功!`, { id: toastId });
  return redirect(`/passwords${getUrl()}`);
};

export const updatePassword: ActionFunction = async ({ request, params }): Promise<any> => {
  let toastId = toast.loading('正在修改密码中...');
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const result = await fetchFn(`/api/passwords/${params.id}`, {
    ...request,
    method: 'PUT',
    body: JSON.stringify(data),
  });
  if (result.status === 401) {
    toast.error('请重新登录!', { id: toastId });
    return redirect('/login');
  }
  if (result.status !== 200) {
    toast.error('添加密码失败!', { id: toastId });
    return { statusCode: result.status, message: '添加密码失败!' };
  }
  toast.success(`添加密码 ${params.id} 成功!`, { id: toastId });
  console.log('request:', request);
  return redirect(`/passwords${getUrl()}`);
};

export const importPasswordCSV: ActionFunction = async ({ request, params }): Promise<any> => {
  let toastId = toast.loading('正在批量导入密码中...');
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const result = await fetchFn(`/api/passwords/import/csv/text`, {
    ...request,
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (result.status === 401) {
    toast.error('请重新登录!', { id: toastId });
    return redirect('/login');
  }
  if (result.status !== 200) {
    toast.error('批量导入密码失败!', { id: toastId });
    return { statusCode: result.status, message: '批量导入密码失败!' };
  }
  const resultData = await result.json();
  toast.success(`批量导入 ${resultData.length} 密码成功!`, { id: toastId });
  return redirect(`/passwords${getUrl()}`);
};
