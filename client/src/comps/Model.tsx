import styled, { css } from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAnimate } from 'framer-motion';
import { useEffect, useImperativeHandle } from 'react';
import { forwardRef } from 'react';

export const Model = styled.div`
  position: fixed;
  background-color: rgba(var(--color-initial-op) / 0.75);
  inset: 0px;
  z-index: 999;
  display: grid;
  justify-content: center;
  place-items: center;
  overflow: auto;
  opacity: 0;
`;

export const Inner = styled.div<{ width?: number }>`
  width: ${({ width }) => width}px;
  border-radius: 0.375rem;
  background-color: rgba(var(--color-init) / 0.95);
  box-shadow: 0 0 0 1px rgba(16, 22, 26, 0.1), 0 4px 8px rgba(16, 22, 26, 0.2), 0 18px 46px 6px rgba(16, 22, 26, 0.2);
`;

export const CloseButton = styled.div<{ fixed?: boolean; size?: number }>`
  width: 21px;
  height: 21px;
  border: none;
  display: grid;
  ${({ fixed }) =>
    fixed &&
    css`
      position: fixed;
      top: 0.65rem;
      left: 0.65rem;
    `}
  background-color: transparent;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  &:before,
  &:after {
    content: '';
    position: absolute;
    width: 16px;
    height: 2px;
    background-color: rgba(var(--color-initial) / 0.5);
    transform: translate(16%, 490%) rotate(45deg);
    transition: all 0.3s ease-in-out;
  }
  &:after {
    transform: translate(16%, 490%) rotate(-45deg);
  }

  &:hover:before,
  &:hover:after {
    background-color: rgba(var(--color-initial) / 0.9);
  }
  &:hover {
    background-color: rgba(var(--color-initial) / 0.1);
    border-radius: 3px;
  }
`;

export const CloseWrapper = styled.div`
  position: fixed;
  top: 0.65rem;
  left: 0.65rem;
  display: flex;
`;

export const Header = styled.header`
  border-bottom: 1px solid;
  padding: 0.66rem 0.66rem;
  border-color: rgba(var(--color-initial) / 0.065);
  font-size: 16px;
  display: flex;
  justify-content: space-between;
`;

export interface ModelLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  pathname?: string;
  header?: JSX.Element | string;
  width?: number;
}

export interface ModelLayoutRef {
  close: () => void;
}

export const ModelLayout = forwardRef<ModelLayoutRef, ModelLayoutProps>((props, ref) => {
  const { header } = props;
  const navigate = useNavigate();
  const { state } = useLocation();
  const referrer = state?.referrer || props.pathname;
  console.log('referrer:', referrer);
  const [scope, animate] = useAnimate();

  useEffect(() => {
    animate(scope.current, { opacity: 1 }, { duration: 0.5 });
  }, [scope]);

  const closeHandler = async () => {
    if (referrer) {
      await animate(
        scope.current,
        { opacity: 0 },
        {
          duration: 0.3,
        },
      );
      navigate(referrer);
    }
  };

  useImperativeHandle(ref, () => ({ close: closeHandler }));

  return (
    <Model ref={scope} onClick={closeHandler}>
      <CloseWrapper>
        <CloseButton size={21} />
      </CloseWrapper>
      <Inner onClick={(evn) => evn.stopPropagation()} {...props}>
        {header && (
          <Header>
            {header}
            <CloseButton size={21} onClick={closeHandler} />
          </Header>
        )}
        {props.children}
      </Inner>
    </Model>
  );
});
