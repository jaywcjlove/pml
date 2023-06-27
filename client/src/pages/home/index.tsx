import { Table } from 'src/comps/Table';

export function Component() {
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
          </tr>
        </thead>
      </Table>
    </div>
  );
}

Component.displayName = 'HomePage';
