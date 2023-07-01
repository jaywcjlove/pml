import styled, { css } from 'styled-components';

interface FormStyleProps {
  inlineBlock?: boolean;
}

export const FormStyle = styled.div<FormStyleProps>`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.51rem;
  > label {
    display: block;
  }
  label select,
  label input[type='text'],
  label input[type='email'],
  label input[type='url'],
  label input[type='datetime-local'],
  label input[type='password'],
  label textarea {
    ${(props) =>
      !props.inlineBlock &&
      css`
        width: 100%;
        max-width: 100%;
      `}
    padding: 0.416rem;
    line-height: 12px;
  }
  > label h3,
  > section > label h3 {
    padding: 0;
    margin: 0;
    padding-bottom: 5px;
    font-weight: 400;
    font-size: 14px;
  }
  > div button + button,
  > footer button + button {
    margin-left: 0.5rem;
  }
  > label > section,
  > section {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  > section * {
    flex: 1;
  }
  > label button {
    cursor: pointer;
  }
  > label > section input + button {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  > label > section input + button svg {
    min-width: 23px;
    min-height: 23px;
  }
`;
