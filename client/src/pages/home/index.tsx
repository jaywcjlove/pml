import { Link, Outlet, Form, useLoaderData, useLocation } from 'react-router-dom';
import formatter from '@uiw/formatter';
import { Table, TFoot, Td, TrEmpty, TablePlaceholder, Pagination } from 'src/comps/Table';
import { getPasswordList } from 'src/services/password';
import { decrypt } from 'src/utils/password';

function truncateText(text: string = '', maxLength: number = 30) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  }
  return text;
}

export const Anchor = (props: { url: string }) => {
  const { url = '' } = props;
  return (
    <a target="_blank" href={url} title={url}>
      {truncateText(url || '')}
    </a>
  );
};

export const loader = getPasswordList;

export function Component() {
  const location = useLocation();
  const data = useLoaderData() as any;
  return (
    <div>
      <Table maxWidth="auto">
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Username</th>
            <th>Password</th>
            <th>URL</th>
            <th>Modified</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {(!Array.isArray(data?.data) || (data.data && data.data.length === 0)) && (
            <TrEmpty>
              <TablePlaceholder colSpan={7}>Data Not Found</TablePlaceholder>
            </TrEmpty>
          )}
          {data &&
            Array.isArray(data.data) &&
            data.data.map((item: any, index: number) => {
              return (
                <tr key={`${index}-${item.id}`}>
                  <td>{item.id}</td>
                  <td>{item.title || '-'}</td>
                  <td>{item.username}</td>
                  <td>
                    {item.password
                      ? decrypt(
                          '2adBN2EEXkjeQ32Hrpn6gQ==.WpQBfJ02JmDuKRNthDKiR8E6QvqklI8NrduecvOnD8A=.Db9T0p/HoiX2zIwhaFC04g==',
                        )
                      : ''}
                  </td>
                  <td>
                    <Anchor url={item.url} />
                  </td>
                  <td>{item.updateAt && formatter('YYYY年MM月DD日 HH:mm:ss', new Date(item.updateAt))}</td>
                  <Td>
                    <Link to={`/passwords/${item.id}/edit${location.search}`}>编辑</Link>
                    <Form
                      method="post"
                      action={`/passwords/${item.id}/remove`}
                      onSubmit={(event) => {
                        if (!confirm(`请确认您要 ${item.id} 删除此记录。`)) {
                          event.preventDefault();
                        }
                      }}
                    >
                      <button type="submit">Delete</button>
                    </Form>
                  </Td>
                </tr>
              );
            })}
        </tbody>
        <TFoot>
          <tr>
            <td colSpan={10}>
              <Pagination
                pathname={location.pathname}
                from={data.from}
                to={data.to}
                page={data.page}
                total={data.total}
                prev_page={data.prev_page}
                per_page={data.per_page}
                last_page={data.last_page}
                next_page={data.next_page}
              />
            </td>
          </tr>
        </TFoot>
      </Table>
      <Outlet />
    </div>
  );
}

Component.displayName = 'HomePage';
