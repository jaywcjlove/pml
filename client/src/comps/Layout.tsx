import { Outlet, NavLink } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { RequireAuth } from '../store';
import { routes } from '../router';
import logo from 'src/asset/logo.png';
import { ReactComponent as AddIcon } from './icons/add.svg';
import { ReactComponent as ImportIcon } from './icons/import.svg';

const Wrapper = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const SiderBar = styled.aside`
  display: flex;
  justify-content: space-between;
  padding: 5px 34px 5px 0;
  border-bottom: 1px solid rgba(var(--color-initial) / 0.13);
`;

const Content = styled.main`
  flex: 1;
  padding: 1rem;
`;

const Menus = styled.aside<{ $isTools?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
  padding: 5px;
  padding-inline: 10px;
  ${({ $isTools }) =>
    $isTools &&
    css`
      & {
        gap: 12px;
      }
    `}
  a {
    display: inline-flex;
    color: var(--color-theme-text);
    transition: all 0.3s;
    border-radius: 3px;
    position: relative;
    text-decoration: none;
    ${({ $isTools }) =>
      !$isTools &&
      css`
        & {
          padding: 3px 8px;
          margin: 5px 0;
        }
      `}
    &:hover,
    &.active {
      background-color: var(--color-neutral-muted);
    }
    &:active {
      background-color: var(--primary-color);
    }
    &.active:active::after {
      background-color: var(--primary-color);
    }
    &::after {
      transition: all 0.3s;
      background-color: transparent;
    }
  }
`;

const Logo = styled.img`
  width: 28px;
  height: 28px;
  margin-right: 5px;
`;

export const SpacesLayout = () => {
  const menus = routes.find((m) => m.path == '/');
  return (
    <Wrapper>
      <SiderBar>
        <Menus>
          <Logo src={logo} />
          {menus?.children &&
            menus?.children.map((m, idx) => {
              if (!m.label) return null;
              return (
                <NavLink to={m.path || ''} key={idx + (m.path || '')}>
                  {m.label}
                </NavLink>
              );
            })}
        </Menus>
        <Menus $isTools={true}>
          <NavLink to="/add/passwords" className="icon">
            <AddIcon width={21} height={21} />
          </NavLink>
          <NavLink to="/import/passwords" className="icon">
            <ImportIcon width={21} height={21} />
          </NavLink>
        </Menus>
      </SiderBar>
      <Content>
        <Outlet />
      </Content>
    </Wrapper>
  );
};

export const Component = () => {
  return (
    <RequireAuth>
      <SpacesLayout />
    </RequireAuth>
  );
};

Component.displayName = 'SpacesPage';
