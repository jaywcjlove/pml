import { Fragment } from 'react';
import { useEffect, useRef } from 'react';
import { Form, useLoaderData, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getPassword, updatePassword } from 'src/services/password';
import { FormStyle } from 'src/comps/FormStyle';
import { ModelLayout, ModelLayoutRef } from 'src/comps/Model';
import { GeneratePassword } from 'src/comps/fields/Password';
import { Button } from 'src/comps/Button';

export const loader = getPassword;
export const action = updatePassword;
export function Component() {
  const location = useLocation();
  const data = useLoaderData() as any;
  const $model = useRef<ModelLayoutRef>(null);
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!confirm(`确认更新密码？`)) {
      e.preventDefault();
    }
  };
  return (
    <ModelLayout ref={$model} header="Edit Password" pathname={`/passwords${location.search}`}>
      <Form method="post" action={`/passwords/${data.id}/edit${location.search}`} onSubmit={submit}>
        <FormStyle style={{ padding: 12 }}>
          <label>
            <h3>Title</h3>
            <input required type="text" name="title" defaultValue={data.title} placeholder="Title" />
          </label>
          <label>
            <h3>Username</h3>
            <input type="text" name="username" defaultValue={data.username} placeholder="Username" />
          </label>
          <label>
            <h3>Password</h3>
            <GeneratePassword />
          </label>
          <label>
            <h3>URL</h3>
            <input type="url" name="url" placeholder="URL" defaultValue={data.url} />
          </label>
          <label>
            <h3>Notes</h3>
            <textarea name="notes" style={{ minHeight: 70 }} defaultValue={data.notes}></textarea>
          </label>
          <footer>
            <Button type="submit">提交</Button>
          </footer>
        </FormStyle>
      </Form>
    </ModelLayout>
  );
}

Component.displayName = 'EditPage';
