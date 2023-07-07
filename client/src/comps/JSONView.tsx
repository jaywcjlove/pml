import { CSSProperties, useEffect, useState } from 'react';
import JsonView, { JsonViewProps } from '@uiw/react-json-view';
import { lightTheme } from '@uiw/react-json-view/light';
import { darkTheme } from '@uiw/react-json-view/dark';
import styled from 'styled-components';

const Wrapper = styled(JsonView)`
  padding: 8px;
`;

export const JSONPreview = (props: Omit<JsonViewProps<object>, 'ref'>) => {
  const toggle = document.querySelector('dark-mode');
  const [theme, setTheme] = useState<'light' | 'dark'>(toggle?.mode || 'dark');
  useEffect(() => {
    document.addEventListener('colorschemechange', (e) => {
      setTheme(e.detail.colorScheme);
    });
  }, []);
  const style = (theme === 'dark' ? darkTheme : lightTheme) as CSSProperties;
  return <Wrapper style={style} {...props} />;
};
