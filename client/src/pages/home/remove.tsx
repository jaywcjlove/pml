import { Fragment } from 'react';
import { removePassword } from 'src/services/password';

export const action = removePassword;
export function Component() {
  return <Fragment />;
}

Component.displayName = 'DeletePage';
