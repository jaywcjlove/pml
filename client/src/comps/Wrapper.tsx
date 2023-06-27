import { FC, PropsWithChildren } from 'react';
import styled, { css } from 'styled-components';
import { buttonStyles } from './Button';

interface WrapperProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  header?: JSX.Element | string;
  title?: JSX.Element | string;
  extra?: JSX.Element | string;
}

const InnerWrapper = styled.main`
  width: 100%;
`;

const Header = styled.header`
  padding-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  > section {
    padding: 0;
    margin: 0;
    font-size: 1.2rem;
    width: 100%;
  }
  > aside {
    position: absolute;
    right: 5px;
    a {
      text-decoration: none;
    }
  }
`;

const Aside = styled.aside``;

export const Wrapper: FC<PropsWithChildren<WrapperProps>> = ({ children, header, title, extra, ...reset }) => {
  return (
    <InnerWrapper {...reset}>
      {header}
      {(title || extra) && (
        <Header>
          <section> {title} </section>
          {extra && <Aside>{extra}</Aside>}
        </Header>
      )}
      {children}
    </InnerWrapper>
  );
};

export const Tabs = styled.div<{ small?: boolean }>`
  display: flex;
  gap: 0.76rem;
  ${({ small }) =>
    !small &&
    css`
      box-shadow: inset 0 -1px 0 rgba(var(--color-initial) / 0.2);
    `}
  > a {
    font-size: 14px;
    padding: 5px 0;
    text-decoration: none;
    color: rgba(var(--color-initial) / 0.55);
    ${({ small }) =>
      small &&
      css`
        padding: 2px 5px;
        border-radius: 3px;
      `}
  }
  > a.active {
    color: rgba(var(--color-initial) / 0.9);
    ${({ small }) =>
      !small &&
      css`
        border-bottom: 1px solid rgba(var(--color-initial) / 0.9);
      `}
    ${({ small }) =>
      small &&
      css`
        background-color: rgba(var(--color-initial) / 0.1);
      `}
  }
`;

export const HeaderInnerWrapper = styled.div`
  display: flex;
  gap: 1rem;
  padding-bottom: 0.56rem;
  > section {
    width: 46px;
    min-width: 46px;
    height: 46px;
    background-color: rgba(var(--color-initial) / 0.175);
    border-radius: 0.45rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 26px;
    font-weight: 900;
    text-transform: uppercase;
  }
  > article {
    display: flex;
    flex-direction: column;
    gap: 0.36rem;
    flex: 1;
  }
  > article h2 {
    padding: 0;
    margin: 0;
    font-size: 16px;
  }
  > article pre {
    color: rgba(var(--color-initial) / 0.575);
    margin: 0;
  }
  > aside {
    display: flex;
    align-items: center;
    > a {
      ${buttonStyles}
      text-decoration: none;
      & + a {
        margin-left: 0.56rem;
      }
    }
  }
`;

interface HeaderInnerProps {
  name: string;
  describe?: string;
  extra?: JSX.Element | string;
}

export const HeaderInner: FC<HeaderInnerProps> = (props) => {
  const { name, describe = '' } = props;
  return (
    <HeaderInnerWrapper>
      <section>{(name || '').charAt(0)}</section>
      <article>
        <h2>{name}</h2>
        <pre>{(describe || '').replace(/^\s+|\s+$/g, '')}</pre>
      </article>
      {props.extra && <aside>{props.extra}</aside>}
    </HeaderInnerWrapper>
  );
};
