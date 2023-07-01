import styled from 'styled-components';

export const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 16px 14px;
  border-width: 1px;
  border-style: solid;
  border-radius: 0.375rem;
  border-color: rgba(var(--color-initial) / 0.065);
  > li + li {
    border-top: 1px solid rgba(var(--color-initial) / 0.065);
  }
  > li > label {
    font-size: smaller;
    padding-top: 8px;
    padding-bottom: 2px;
    display: block;
    color: rgba(var(--color-initial) / 0.265);
  }
  > li > p {
    margin: 0;
    padding-bottom: 8px;
    word-break: break-all;
    white-space: pre-wrap;
  }
  > li {
    margin: 0;
    padding: 0 8px;
  }
`;
