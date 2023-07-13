import { NavLink, Outlet } from 'react-router-dom';
import styled from 'styled-components';

const Wrapper = styled.div``;

const Header = styled.header`
  padding-bottom: 12px;
  display: flex;
  gap: 0.35rem;
  a {
    text-decoration: none;
    padding: 0.22rem 0.4rem;
    border-radius: 0.3rem;
  }
  a.active {
    background-color: var(--color-neutral-muted);
    text-decoration: underline;
    color: var(--color-theme-text);
    cursor: pointer;
  }
`;

const Content = styled.div`
  background-color: rgba(var(--color-initial) / 0.102);
  padding: 0.75rem;
  border-radius: 0.25rem;
`;

export function Component() {
  return (
    <Wrapper>
      <Header>
        <NavLink to="/import/passwords/csv">CSV</NavLink>
        <NavLink to="/import/passwords/macpass">MacPass</NavLink>
      </Header>
      <Content>
        <Outlet />
      </Content>
    </Wrapper>
  );
}

Component.displayName = 'ImportPage';
