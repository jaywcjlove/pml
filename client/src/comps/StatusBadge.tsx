import { FC, PropsWithChildren } from 'react';
import styled, { css } from 'styled-components';

interface StatusBadgeProps {
  type?: number;
}

const Wrapper = styled.div<StatusBadgeProps>`
  font-size: 12px;
  display: inline-block;
  padding: 0 4px;
  border-radius: 2px;
  ${({ type }) => {
    if (type === 1)
      return css`
        --status-badge-bg-color: var(--primary-color);
        --status-badge-color: #fff;
      `;
    if (type === 2)
      return css`
        --status-badge-bg-color: var(--warning-color);
        --status-badge-color: #fff;
      `;
    if (type === 3)
      return css`
        --status-badge-bg-color: var(--success-color);
        --status-badge-color: #fff;
      `;
    if (type === 4)
      return css`
        --status-badge-bg-color: var(--remind-color);
        --status-badge-color: #fff;
      `;
    if (type === 5)
      return css`
        --status-badge-bg-color: rgba(var(--color-initial-op) / 0.9);
        --status-badge-color: #fff;
      `;
    return css`
      --status-badge-bg-color: var(--color-neutral-muted);
      --status-badge-color: var(--color-theme-text, #24292f);
    `;
  }}
  background-color: var(--status-badge-bg-color);
  color: var(--status-badge-color);
`;

export const StatusBadge: FC<PropsWithChildren<StatusBadgeProps>> = (props) => {
  const { type, children, ...reset } = props;
  let child = children;
  switch (type) {
    case 1:
      child = '未开始';
      break;
    case 2:
      child = '进行中';
      break;
    case 3:
      child = '已完成';
      break;
    case 4:
      child = '待接手';
      break;
    case 5:
      child = '已取消';
      break;
    default:
      child = '未知';
      break;
  }
  return (
    <Wrapper type={type} {...reset}>
      {child}
    </Wrapper>
  );
};
