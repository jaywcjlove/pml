import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useFetcher, useLocation, useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../../store';
import { signup } from '../../services/login';
import logoSrc from '../../asset/logo.png';
import { LogoImage, LoginPage } from './login';

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
        <LoginPage.Title> Sign Up </LoginPage.Title>
        <LoginPage.Logo>
          <LogoImage src={logoSrc} />
        </LoginPage.Logo>
        <LoginPage.Password keyname="confirmPassword" placeholder="Confirm Password" />
        <LoginPage.Username name="email" placeholder="Email address" />
        <LoginPage.Username keyname="name" placeholder="Please enter your name" />
        <LoginPage.Reset></LoginPage.Reset>
        <LoginPage.Footer>
          <NavLink to="/login">Login now</NavLink>
        </LoginPage.Footer>
      </LoginPage>
    </fetcher.Form>
  );
}

Component.displayName = 'SignupPage';
