import { Link, Outlet, Form, useLoaderData, useLocation } from 'react-router-dom';
import formatter from '@uiw/formatter';
import styled from 'styled-components';
import { Table, TFoot, TrEmpty, TablePlaceholder, Pagination } from 'src/comps/Table';
import { getPasswordList } from 'src/services/password';
import { decrypt } from 'src/utils/password';
import { TrashButton } from 'src/comps/Button';
import { PasswrodVisible, CopyText } from 'src/comps/fields/Password';
import { ReactComponent as LinkIcon } from 'src/comps/icons/link.svg';
import { ReactComponent as EditIcon } from 'src/comps/icons/edit.svg';
import { ReactComponent as TrashIcon } from 'src/comps/icons/trash.svg';

export const Anchor = styled.a`
  display: flex;
`;

const ToolBar = styled.div`
  display: flex;
  gap: 0.65rem;
  & > * {
    display: inline-flex;
    align-items: center;
  }
`;

export const loader = getPasswordList;

export function Component() {
  const location = useLocation();
  const data = useLoaderData() as any;
  return (
    <div>
      <Table $maxWidth="auto">
        <thead>
          <tr>
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
                  <td>
                    <Link to={`/passwords/${item.id}`}>{item.title || ''}</Link>
                  </td>
                  <td>
                    <CopyText text={item.username}>{item.username}</CopyText>
                  </td>
                  <td>
                    <PasswrodVisible value={item.password ? decrypt(item.password) : ''} />
                  </td>
                  <td>
                    {item.url && (
                      <Anchor target="_blank" href={item.url} title={item.url}>
                        <LinkIcon width={18} height={18} />
                      </Anchor>
                    )}
                  </td>
                  <td>{item.updateAt && formatter('YYYY年MM月DD日 HH:mm:ss', new Date(item.updateAt))}</td>
                  <td>
                    <ToolBar>
                      <Link to={`/passwords/${item.id}/edit${location.search}`}>
                        <EditIcon width={18} height={18} />
                      </Link>
                      <Form
                        method="post"
                        action={`/passwords/${item.id}/remove`}
                        onSubmit={(event) => {
                          if (!confirm(`请确认您要 ${item.id} 删除此记录。`)) {
                            event.preventDefault();
                          }
                        }}
                      >
                        <TrashButton type="submit">
                          <TrashIcon width={18} height={18} />
                        </TrashButton>
                      </Form>
                    </ToolBar>
                  </td>
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
