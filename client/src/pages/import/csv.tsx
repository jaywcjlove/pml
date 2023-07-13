import { useState } from 'react';
import { Form } from 'react-router-dom';
import CSVReader from '@uiw/react-csv-reader';
import styled from 'styled-components';
import { FormStyle } from 'src/comps/FormStyle';
import { Button } from 'src/comps/Button';
import { importPasswordCSV } from 'src/services/password';

const placeholder = `title,username,password,url,notes\ntitle,username,password,url\ntitle,,password\ntitle,,password,url\ntitle,,,url`;

export const Textarea = styled.textarea`
  min-height: 270px;
  width: 100%;
  max-width: 100%;
`;

export const action = importPasswordCSV;
export function Component() {
  const [value, setValue] = useState('');
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    if (!confirm(`确认添加密码？`)) {
      event.preventDefault();
    }
  };
  return (
    <Form method="post" onSubmit={submit}>
      <FormStyle $inlineBlock style={{ padding: 0 }}>
        <div>CSV password text or ".csv" password file import.</div>
        <label>
          <Textarea
            required
            value={value}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setValue(e.target.value)}
            name="data"
            placeholder={placeholder}
          />
        </label>
        <label htmlFor="csv_uploads">
          <h3>Read CSV file</h3>
          <CSVReader
            name="csv_uploads"
            id="csv_uploads"
            onFileLoaded={(data, iFileInfo, iOriginalFile, text) => {
              text && setValue(text);
            }}
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
