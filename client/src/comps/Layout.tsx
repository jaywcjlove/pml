import { Outlet, NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { RequireAuth } from '../store';
import { routes } from '../router';

const Wrapper = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: row;
`;

const SiderBar = styled.aside`
  background-color: var(--color-neutral-muted);
  backdrop-filter: saturate(180%) blur(0.4rem);
  position: sticky;
  width: 32px;
  min-width: 32px;
  height: 100vh;
  top: 0;
`;

const Content = styled.main`
  flex: 1;
  padding: 1rem;
`;

const Menus = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding-left: 6px;
  padding-right: 5px;
  padding-top: 5px;
  a {
    display: block;
    color: var(--color-theme-text);
    padding: 5px 8px;
    margin-right: 10px;
    transition: all 0.3s;
    border-radius: 3px;
    position: relative;
    text-decoration: none;
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
      content: '';
      display: block;
      position: absolute;
      right: -10px;
      top: 0;
      width: 5px;
      height: 100%;
      border-radius: 3px;
    }
    &.active::after,
    &:hover::after {
      transition: all 0.3s;
      background-color: var(--primary-color);
      content: '';
      display: block;
      position: absolute;
      right: -10px;
      top: 0;
      width: 5px;
      height: 100%;
      border-radius: 3px;
    }
  }
`;

export const SpacesLayout = () => {
  const menus = routes.find((m) => m.path == '/');
  return (
    <Wrapper>
      <SiderBar>
        <Menus>
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
