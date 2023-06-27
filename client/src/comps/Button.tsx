import styled, { css } from 'styled-components';

export const buttonStyles = css`
  color: rgba(var(--color-initial) / 0.855);
  border-radius: 0.25rem;
  padding: 5px 10px;
  --tt-btn-background-color: rgba(var(--color-initial) / 0.155);
  background-color: var(--tt-btn-background-color);
  box-shadow: inset 0 0 0 1px rgba(var(--color-initial) / 0.2), 0 1px 2px rgba(var(--color-initial) / 0.1);
  --tt-btn-color: rgba(var(--color-initial) / 0.9);
  color: var(--tt-btn-color);
  transition: all 0.6s;
  box-shadow: 0 0 0 0 transparent;
  &:hover {
    background-clip: padding-box;
    --tt-btn-hover-background-color: rgba(var(--color-initial) / 0.255);
    background-color: var(--tt-btn-hover-background-color);
    --tt-btn-hover-color: rgba(var(--color-initial) / 0.9);
    color: var(--tt-btn-hover-color);
  }
  &:active {
    --tt-btn-active-background-color: rgba(var(--color-initial) / 0.155);
    background-color: var(--tt-btn-active-background-color);
  }
  &:focus {
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(var(--color-initial) / 0.35);
  }
`;

interface ButtonProps {
  danger?: boolean;
}

export const Button = styled.button<ButtonProps>`
  align-items: center;
  border: none;
  cursor: pointer;
  display: inline-flex;
  flex-direction: row;
  font-size: 14px;
  justify-content: center;
  min-height: 30px;
  min-width: 30px;
  text-align: left;
  vertical-align: middle;
  transition: all 0.3s;
  ${({ danger }) =>
    danger &&
    css`
      --tt-btn-color: rgba(var(--color-initial-op) / 0.9) !important;
      --tt-btn-background-color: #dc3545 !important;
      --color-initial-op: 255 255 255 !important;
      --color-initial: 220 53 69 !important;
    `}
  ${buttonStyles}
`;
