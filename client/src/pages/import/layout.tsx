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

export function Component() {
  return (
    <Wrapper>
      <Header>
        <NavLink to="/import/passwords/csv">CSV</NavLink>
        <NavLink to="/import/passwords/macpass">MacPass</NavLink>
      </Header>
      <Outlet />
    </Wrapper>
  );
}

Component.displayName = 'ImportPage';
