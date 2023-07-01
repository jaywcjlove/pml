import React, { useState, PropsWithChildren } from 'react';
import styled, { css } from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

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

export const Header = styled.header`
  border-bottom: 1px solid;
  padding: 0.66rem 0.66rem;
  border-color: rgba(var(--color-initial) / 0.065);
  font-size: 16px;
  display: flex;
  justify-content: space-between;
`;

export const CloseWrapper = styled.div`
  position: fixed;
  top: 0.65rem;
  left: 0.65rem;
  display: flex;
`;

export const Wrapper = styled(motion.div)`
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

const Inner = styled(motion.div)<{ width?: number }>`
  position: absolute;
  width: ${({ width }) => `${width ? width : 280}px`};
  top: 10px;
  bottom: 10px;
  right: 10px;
  border-radius: 0.375rem;
  transform: translateX(100%) translateZ(0px);
  background-color: rgba(var(--color-init) / 0.95);
  box-shadow: 0 0 0 1px rgba(16, 22, 26, 0.1), 0 4px 8px rgba(16, 22, 26, 0.2), 0 18px 46px 6px rgba(16, 22, 26, 0.2);
`;

const Content = styled.article`
  height: calc(100% - 44px);
  overflow: auto;
`;

interface DrawerProps {
  header?: React.ReactNode;
  pathname?: string;
  overlayColor?: string;
  width?: number;
}

export const Drawer: React.FC<PropsWithChildren<DrawerProps>> = (props) => {
  const { header, children } = props;
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const { state } = useLocation();
  const referrer = state?.referrer || props.pathname;
  const closeHandler = () => {
    setIsOpen(false);
  };

  return (
    <Wrapper
      animate={isOpen ? 'open' : 'closed'}
      variants={{
        open: { opacity: 1 },
        closed: { opacity: 0 },
      }}
      transition={{ duration: 0.5 }}
      onAnimationComplete={(definition) => {
        if (definition === 'closed') {
          navigate(referrer);
        }
      }}
      onClick={() => setIsOpen(false)}
    >
      <CloseWrapper onClick={() => setIsOpen(false)}>
        <CloseButton size={21} />
      </CloseWrapper>
      <Inner
        onClick={(evn) => evn.stopPropagation()}
        initial={{ x: '100%' }}
        variants={{
          open: { x: '0%' },
          closed: { x: '100%', opacity: 1 },
        }}
        transition={{ duration: 0.3 }}
      >
        {header && (
          <Header>
            {header}
            <CloseButton size={21} onClick={closeHandler} />
          </Header>
        )}
        <Content>{children}</Content>
      </Inner>
    </Wrapper>
  );
};

export default Drawer;
