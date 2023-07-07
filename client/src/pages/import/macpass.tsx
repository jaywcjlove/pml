import { Form } from 'react-router-dom';
import XMLReader from '@uiw/react-xml-reader';
import JsonView from '@uiw/react-json-view';
import { FormStyle } from 'src/comps/FormStyle';
import { JSONPreview } from 'src/comps/JSONView';
import { Button, XMLInput } from 'src/comps/Button';
import { importPasswordXML } from 'src/services/password';
import styled from 'styled-components';
import { useState } from 'react';

interface TimesData {
  CreationTime: string;
  Expires: string;
  ExpiryTime: string;
  LastAccessTime: string;
  LastModificationTime: string;
  LocationChanged: string;
  UsageCount: number;
}

interface PasswordString {
  Key: 'Title' | 'UserName' | 'Password' | 'URL' | 'Notes';
  Value: string;
}

interface EntryData {
  AutoType: { Enabled: string; DataTransferObfuscation: number };
  BackgroundColor: string;
  ForegroundColor: string;
  History: { Entry: EntryData[] };
  IconID: number;
  OverrideURL: string;
  String: PasswordString[];
  Tags: string;
  Times: TimesData;
  UUID: string;
}

interface KeePassData {
  DefaultAutoTypeSequence: string;
  EnableAutoType: string;
  EnableSearching: string;
  Entry: EntryData[];
  Group: KeePassData[];
  IconID: number;
  IsExpanded: string;
  LastTopVisibleEntry: string;
  Name: string;
  Notes: string;
  Times: TimesData[];
  UUID: string;
}

interface KeePassFile {
  '?xml': string;
  KeePassFile: {
    Meta: any;
    Root: {
      DeletedObjects: any;
      Group: KeePassData;
    };
  };
}

type PasswordData = {
  title: string;
  username: string;
  password: string;
  url: string;
  notes: string;
};

const formatData = (data: KeePassData[] = [], result: any[] = []) => {
  data.forEach(({ Entry, Group }) => {
    if (Entry && Entry.length > 0) {
      Entry.forEach(({ String: item }) => {
        const password = {} as Record<PasswordString['Key'], string>;
        item.forEach(({ Key, Value }) => {
          password[Key] = Value;
        });
        result.push(password);
      });
    }
    if (Group && Group.length > 0) {
      result = result.concat(formatData(Group));
    }
  });
  return result;
};

export const action = importPasswordXML;
export function Component() {
  const [file, setFile] = useState<File | null>(null);
  const [value, setValue] = useState<PasswordData[]>([]);
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    if (!confirm(`确认添加密码？`)) {
      event.preventDefault();
    }
  };
  return (
    <Form method="post" onSubmit={submit} encType="multipart/form-data">
      <FormStyle style={{ padding: 0, display: 'inline-flex' }}>
        <input type="hidden" name="data" value={JSON.stringify(value)} />
        <XMLInput htmlFor="fileName">
          <span>Read XML file {file ? `: ${file.name}` : '...'}</span>
          <XMLReader
            name="fileName"
            onFileLoaded={(data: KeePassFile, fileInfo, originalFile) => {
              setFile(originalFile);
              if (data.KeePassFile?.Root?.Group) {
                const result = formatData([data.KeePassFile.Root.Group]);
                const val = result.map(({ Title, UserName, Password, URL, Notes }) => {
                  return { title: Title, username: UserName, password: Password, url: URL, notes: Notes };
                });
                if (val) {
                  setValue(val);
                }
              }
            }}
          />
        </XMLInput>
        {value.length > 0 && <JSONPreview value={value} collapsed={false} />}
        <footer>
          <Button type="submit" disabled={value.length === 0}>
            提交
          </Button>
        </footer>
      </FormStyle>
    </Form>
  );
}

Component.displayName = 'ImportPage';
