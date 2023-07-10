import Login from '@react-login-page/base';
import styled from 'styled-components';
import { useEffect } from 'react';
import { Form, useLocation, useNavigate, NavLink, useActionData } from 'react-router-dom';
import { useAuth } from '../../store';
import { login } from '../../services/login';
import logoSrc from '../../asset/logo.png';

export const LoginPage = styled(Login)`
  height: 100vh !important;
`;

export const LogoImage = styled.img`
  width: 34px;
  display: block;
`;

export const action = login;
export function Component() {
  const data = useActionData() as any;
  const { token, dispatch } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const currentToken = data?.token;
  useEffect(() => {
    if (currentToken) {
      console.log(currentToken);
      dispatch({
        token: currentToken,
        user: {
          id: data?.id,
          username: data?.username,
          name: data?.name,
        },
      });
      setTimeout(() => {
        // 跳转到上一个页面或者 `/`
        const from = location.state?.from?.pathname || '/passwords';
        navigate(from, { replace: true });
      });
    }
  }, [currentToken]);

  useEffect(() => {
    if (token) {
      dispatch({ token: null });
    }
    // eslint-disable-next-line
  }, []);

  return (
    <Form method="post">
      <LoginPage>
        <Login.Title> PML Login </Login.Title>
        <Login.Logo>
          <LogoImage src={logoSrc} />
        </Login.Logo>
        <Login.Username placeholder="Email address" name="email" />
        <Login.Footer>
          New to PML? <NavLink to="/signup">Create an account</NavLink>.
        </Login.Footer>
      </LoginPage>
    </Form>
  );
}

Component.displayName = 'LoginPage';
