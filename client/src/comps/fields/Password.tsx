import styled, { css } from 'styled-components';
import copyTextToClipboard from '@uiw/copy-to-clipboard';
import { FC, PropsWithChildren, useState } from 'react';
import { generate } from '@wcj/generate-password';
import toast from 'react-hot-toast';
import { Button } from 'src/comps/Button';
import { ReactComponent as Eye } from 'src/comps/icons/eye.svg';
import { ReactComponent as EyeSlash } from 'src/comps/icons/eye-slash.svg';

const eyeStyle = css`
  cursor: pointer;
  margin-right: 5px;
  width: 18px;
  height: 18px;
`;

export const EyeIcon = styled(Eye)`
  ${eyeStyle}
`;
export const EyeCloseIcon = styled(EyeSlash)`
  ${eyeStyle}
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
      {type === 'password' && <EyeCloseIcon width={26} height={26} onClick={() => setType('text')} />}
      {type === 'text' && <EyeIcon width={26} height={26} onClick={() => setType('password')} />}
      <Button type="button" onClick={generateButton}>
        Generate
      </Button>
    </section>
  );
};

export const PasswrodVisible = ({ value = '' }: { value: string }) => {
  const [visible, setVisible] = useState(false);
  const click = (evn: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    setVisible(!visible);
    evn.stopPropagation();
  };
  return (
    <CopyText text={value}>
      {visible && <EyeIcon width={26} height={26} onClick={click} />}
      {!visible && <EyeCloseIcon width={26} height={26} onClick={click} />}
      {visible ? value : Array.from({ length: value.length }, () => '*').join('')}
    </CopyText>
  );
};

const Text = styled.span`
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  font-family: monospace;
  vertical-align: middle;
`;

export const CopyText: FC<PropsWithChildren<{ text: string }>> = ({ text = '', children, ...reset }) => {
  const click = () => {
    copyTextToClipboard(text, () => {
      toast.success(`复制成功!`);
    });
  };
  return (
    <Text onClick={click} {...reset}>
      {children}
    </Text>
  );
};
