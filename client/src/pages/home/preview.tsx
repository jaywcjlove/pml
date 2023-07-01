import { Fragment } from 'react';
import { useEffect, useRef } from 'react';
import { Form, useLoaderData, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getPassword, updatePassword } from 'src/services/password';
import { FormStyle } from 'src/comps/FormStyle';
import { Drawer } from 'src/comps/Drawer';
import { decrypt } from 'src/utils/password';
import { GeneratePassword } from 'src/comps/fields/Password';
import { PasswrodVisible, CopyText } from 'src/comps/fields/Password';
import { Button } from 'src/comps/Button';
import { List } from 'src/comps/List';

function truncateText(text: string = '', maxLength: number = 30) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  }
  return text;
}

export const loader = getPassword;
export function Component() {
  const location = useLocation();
  const data = useLoaderData() as any;
  return (
    <Drawer header="View Password" pathname={`/passwords${location.search}`}>
      <List>
        {data.title && (
          <li>
            <label>Title</label>
            <p>{data.title}</p>
          </li>
        )}
        {data.username && (
          <li>
            <label>Username</label>
            <p>
              <CopyText text={data.username}>{data.username}</CopyText>
            </p>
          </li>
        )}
        {data.password && (
          <li>
            <label>Password</label>
            <p>
              <PasswrodVisible value={data.password ? decrypt(data.password) : ''} />
            </p>
          </li>
        )}
        {data.url && (
          <li>
            <label>URL</label>
            <p>
              <a href={data.url} target="_blank" rel="noopener noreferrer">
                {data.url}
              </a>
            </p>
          </li>
        )}
        {data.notes && (
          <li>
            <label>Notes</label>
            <p>{data.notes}</p>
          </li>
        )}
      </List>
    </Drawer>
  );
}

Component.displayName = 'EditPage';
