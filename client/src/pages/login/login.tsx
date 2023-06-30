import Login from '@react-login-page/page3';
import defaultBannerImage from '@react-login-page/page3/bg.jpeg';
import styled from 'styled-components';
import toast from 'react-hot-toast';
import { useFetcher, useLocation, useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../../store';
import { login } from '../../services/login';
import { useEffect, useRef } from 'react';

const LoginPage = styled(Login)`
  height: 100vh !important;
`;

export const ErrorInfo = styled.div`
  color: red;
  word-break: break-all;
  white-space: pre-wrap;
  width: 100%;
  max-width: 265px;
`;

export const action = login;
export function Component() {
  const fetcher = useFetcher();
  const { token, dispatch } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toastId = useRef<string>();
  const submitHanle = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toastId.current = toast.loading('正在登录中...');
    fetcher.submit(e.currentTarget);
  };

  useEffect(() => {
    if (fetcher.data && fetcher.data.token) {
      dispatch({
        token: fetcher.data.token,
        user: {
          id: fetcher.data.data?.id,
          username: fetcher.data.data?.username,
          name: fetcher.data.data?.name,
        },
      });
      toastId.current &&
        toast.success('登录成功!', {
          id: toastId.current,
        });
      setTimeout(() => {
        // 跳转到上一个页面或者 `/`
        const from = location.state?.from?.pathname || '/passwords';
        navigate(from, { replace: true });
      });
    }
  }, [fetcher.data, location.state, dispatch, navigate]);

  useEffect(() => {
    if (fetcher.data?.code !== 1 && fetcher.data?.message) {
      toastId.current &&
        toast.error(fetcher.data?.message || '登录失败', {
          id: toastId.current,
        });
    }
  }, [fetcher.data]);

  useEffect(() => {
    if (token && fetcher.state === 'idle') {
      dispatch({ token: null });
    }
    // eslint-disable-next-line
  }, []);

  return (
    <fetcher.Form method="post" onSubmit={submitHanle}>
      <LoginPage>
        <Login.Banner style={{ backgroundImage: `url(${defaultBannerImage})` }} />
        <Login.Title> Password Manager Lite </Login.Title>
        <Login.Welcome>Welcome back! Log in to your account.</Login.Welcome>
        <Login.Submit>登录</Login.Submit>
        <Login.Password autoComplete="on"></Login.Password>
        <Login.ButtonAfter>
          <NavLink to="/signup">现在注册</NavLink>
        </Login.ButtonAfter>
      </LoginPage>
      <div>{fetcher.data?.code !== 1 && <ErrorInfo>{fetcher.data?.message}</ErrorInfo>}</div>
    </fetcher.Form>
  );
}

Component.displayName = 'LoginPage';
