import { generate } from '@wcj/generate-password';
import { useState } from 'react';
import { Button } from 'src/comps/Button';
import { ReactComponent as Eye } from 'src/comps/icons/eye.svg';
import { ReactComponent as EyeSlash } from 'src/comps/icons/eye-slash.svg';
import styled from 'styled-components';

const Icons = styled.div`
  cursor: pointer;
`;

export const GeneratePassword = (props: React.InputHTMLAttributes<HTMLInputElement>) => {
  const [value, setValue] = useState(generate({ length: 23 }));
  const [type, setType] = useState<'password' | 'text'>('password');
  const generateButton = () => setValue(generate({ length: 23 }));
  return (
    <section>
      <input
        type={type}
        value={value}
        name="password"
        placeholder="Password"
        {...props}
        onChange={(evn) => setValue(evn.target.value)}
      />
      {type === 'password' && (
        <Icons>
          <EyeSlash width={26} height={26} onClick={() => setType('text')} />
        </Icons>
      )}
      {type === 'text' && (
        <Icons>
          <Eye width={26} height={26} onClick={() => setType('password')} />
        </Icons>
      )}
      <Button type="button" onClick={generateButton}>
        Generate
      </Button>
    </section>
  );
};
