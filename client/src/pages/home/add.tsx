import { Form } from 'react-router-dom';
import { FormStyle } from 'src/comps/FormStyle';
import { Button } from 'src/comps/Button';
import { GeneratePassword } from 'src/comps/fields/Password';
import { addPassword } from 'src/services/password';

export const action = addPassword;
export function Component() {
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    if (!confirm(`确认添加密码？`)) {
      event.preventDefault();
    }
  };
  return (
    <Form method="post" action="/add/passwords" onSubmit={submit}>
      <FormStyle inlineBlock style={{ padding: 0 }}>
        <label>
          <h3>Title</h3>
          <input required type="text" name="title" placeholder="Title" />
        </label>
        <label>
          <h3>Username</h3>
          <input type="text" name="username" placeholder="Username" />
        </label>
        <label>
          <h3>Password</h3>
          <GeneratePassword />
        </label>
        <label>
          <h3>URL</h3>
          <input type="url" name="url" placeholder="URL" />
        </label>
        <label>
          <h3>Notes</h3>
          <textarea name="notes" style={{ minHeight: 70 }}></textarea>
        </label>
        <footer>
          <Button type="submit">提交</Button>
        </footer>
      </FormStyle>
    </Form>
  );
}

Component.displayName = 'DeletePage';
