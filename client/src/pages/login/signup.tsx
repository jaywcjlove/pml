import Login from '@react-login-page/page3';
import defaultBannerImage from '@react-login-page/page3/bg.jpeg';
import styled from 'styled-components';
import toast from 'react-hot-toast';
import { useFetcher, useLocation, useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../../store';
import { signup } from '../../services/login';
import { useEffect, useRef } from 'react';

const LoginPage = styled(Login)`
  height: 100vh !important;
`;

export const action = signup;
export function Component() {
  const fetcher = useFetcher();
  const { token, dispatch } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toastId = useRef<string>();
  const submitHanle = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toastId.current = toast.loading('正在注册中...');
    fetcher.submit(e.currentTarget);
  };

  useEffect(() => {
    if (fetcher.data && !fetcher.data?.message) {
      toastId.current &&
        toast.success('注册成功!', {
          id: toastId.current,
        });
      setTimeout(() => {
        navigate('/login', { replace: true });
      });
    }
  }, [fetcher.data, location.state, dispatch, navigate]);

  useEffect(() => {
    if (fetcher.data?.message) {
      toastId.current &&
        toast.error(fetcher.data?.message || '注册失败', {
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
        <Login.Title> Task Tracker </Login.Title>
        <Login.Logo visible={false} />
        <Login.Welcome>Welcome! Signup to your account.</Login.Welcome>
        <Login.Submit>注册</Login.Submit>
        <Login.Password label="密码" placeholder="请输入你的密码" />
        <Login.Password label="确认密码" keyname="confirmPassword" placeholder="确认你的密码" />
        <Login.Email label="邮箱" placeholder="请输入你的邮箱" />
        <Login.Email label="姓名" type="text" keyname="name" placeholder="请输入你的姓名" index={-1} />
        <Login.ButtonAfter>
          <NavLink to="/login">现在登录</NavLink>
        </Login.ButtonAfter>
      </LoginPage>
    </fetcher.Form>
  );
}

Component.displayName = 'SignupPage';
