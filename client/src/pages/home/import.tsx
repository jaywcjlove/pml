import { Form } from 'react-router-dom';
import { FormStyle } from 'src/comps/FormStyle';
import { Button } from 'src/comps/Button';
import { GeneratePassword } from 'src/comps/fields/Password';
import { importPasswordCSV } from 'src/services/password';
import styled from 'styled-components';

const placeholder = `title,username,password,url,notes\ntitle,username,password,url\ntitle,,password\ntitle,,password,url\ntitle,,,url`;

export const Textarea = styled.textarea``;

export const action = importPasswordCSV;
export function Component() {
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    if (!confirm(`确认添加密码？`)) {
      event.preventDefault();
    }
  };
  return (
    <Form method="post" onSubmit={submit}>
      <FormStyle inlineBlock style={{ padding: 0 }}>
        <label>
          <h3>CSV Text Import</h3>
          <Textarea
            required
            name="data"
            style={{ minHeight: 270, width: '100%', maxWidth: '100%' }}
            placeholder={placeholder}
          />
        </label>
        <footer>
          <Button type="submit">提交</Button>
        </footer>
      </FormStyle>
    </Form>
  );
}

Component.displayName = 'ImportPage';
