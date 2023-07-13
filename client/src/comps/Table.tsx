import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

export const TablePlaceholder = styled.td`
  text-align: center;
`;

export const TrEmpty = styled.tr``;
export const Table = styled.table<{ $maxWidth?: string }>`
  border-spacing: 0;
  border-collapse: collapse;
  border-radius: 0.25rem;
  min-width: ${({ $maxWidth }) => $maxWidth || `100%`};
  tbody td,
  thead th {
    line-height: 21px;
    padding: 0.4rem 0.5rem;
  }
  caption {
    padding: 0.5rem;
    line-height: 21px;
    border-radius: 0.25rem 0.25rem 0 0;
    text-align: left;
  }
  caption + thead tr th {
    border-radius: 0 !important;
    line-height: 16px;
  }
  thead th {
    text-align: left;
  }

  thead tr:first-child th:first-child {
    border-radius: 0.25rem 0 0 0;
  }

  thead tr:first-child th:last-child {
    border-radius: 0 0.25rem 0 0;
  }

  tfoot tr td {
    padding: 0.5rem;
  }
  tfoot tr:last-child td {
    border-radius: 0 0 0.25rem 0.25rem;
  }
  tbody tr {
    background-color: initial;
    transition: all 0.3s;
  }
  tbody tr:last-child td:first-child,
  tbody tr:last-child td:last-child {
    border-radius: 0 0 0.25rem 0.25rem;
  }
  tbody:has(+ tfoot) tr td {
    border-radius: 0 !important;
  }
  tbody tr:hover:not(${TrEmpty}) {
    background-color: var(--color-neutral-muted);
  }
`;

const FooterWarpper = styled.tfoot``;

export const TFoot: FC<React.HTMLAttributes<HTMLElement>> = ({ ...props }) => {
  return <FooterWarpper {...props} />;
};

interface PaginationProps {
  pathname: string;
  from: number | null;
  to: number;
  per_page: number;
  total: number;
  page: number;
  prev_page: number | null;
  next_page: number | null;
  last_page: number;
}

const PaginationWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.55rem;
  button {
    cursor: pointer;
  }
  button:disabled {
    cursor: not-allowed;
  }
`;

export const Pagination: FC<PaginationProps> = (props) => {
  const { from, to, page, pathname, total, prev_page, last_page, next_page } = props;
  const navigate = useNavigate();
  const prevPage = () => navigate(`${pathname}?page=${prev_page}`);
  const nextPage = () => navigate(`${pathname}?page=${next_page}`);
  return (
    <PaginationWrapper>
      <button disabled={!prev_page} onClick={prevPage}>
        上一页
      </button>
      <span>
        页码: {page} / {last_page}
      </span>
      <button disabled={!next_page} onClick={nextPage}>
        下一页
      </button>
      <span>
        显示: {from} - {to} 共 {total} 条数据
      </span>
    </PaginationWrapper>
  );
};
