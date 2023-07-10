import React, { useState, PropsWithChildren } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimationDefinition } from 'framer-motion';
import { CloseButton, Header, CloseWrapper, Wrapper } from './Drawer';

const Inner = styled(motion.div)<{ width?: number }>`
  position: absolute;
  width: ${({ width }) => `${width ? width : 230}px`};
  border-radius: 0.375rem;
  background-color: rgba(var(--color-init) / 0.95);
  box-shadow:
    0 0 0 1px rgba(16, 22, 26, 0.1),
    0 4px 8px rgba(16, 22, 26, 0.2),
    0 18px 46px 6px rgba(16, 22, 26, 0.2);
`;

interface ModelProps {
  header?: React.ReactNode;
  pathname?: string;
  width?: number;
}
export const Model: React.FC<PropsWithChildren<ModelProps>> = (props) => {
  const { header, children, width } = props;
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
      onAnimationComplete={(definition: AnimationDefinition) => {
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
        onClick={(evn: React.MouseEvent<HTMLDivElement, MouseEvent>) => evn.stopPropagation()}
        initial={{ scale: 0.8 }}
        width={width}
        variants={{
          open: { scale: 1 },
          closed: { scale: 0.8 },
        }}
        transition={{ duration: 0.3 }}
      >
        {header && (
          <Header>
            {header}
            <CloseButton size={21} onClick={closeHandler} />
          </Header>
        )}
        {children}
      </Inner>
    </Wrapper>
  );
};

export default Model;
