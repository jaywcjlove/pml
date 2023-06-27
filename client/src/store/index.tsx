import { createContext, useContext, useReducer, PropsWithChildren } from 'react';
import * as local from './persistence';
export * from './RequireAuth';

export interface AuthContextValue extends InitialState {
  dispatch: React.Dispatch<InitialState | DispatchData>;
}

export interface UserInfo {
  id: string;
  username: string;
  name: string;
}
export interface DispatchData {
  type: 'user';
  data: UserInfo;
}

export interface InitialState {
  /** Login token */
  token?: string | null;
  /** User Info */
  user?: UserInfo;
}

export const initialState: InitialState = {
  token: local.getToken(),
  user: local.getUserInfo(),
};

export const reducer = (state: InitialState, action: InitialState | DispatchData): InitialState => {
  const resultData = {} as InitialState;
  if ('type' in action) {
    switch (action.type) {
      case 'user':
        local.setUserInfo(action.data);
        resultData.user = { ...state.user, ...action.data };
        break;
      default:
        break;
    }
  }
  if ('token' in action && state.token !== action.token) {
    resultData.token = action.token;
    if (action.token) {
      local.setToken(action.token);
    } else if (action.token === null) {
      local.removeToken();
    }
  }
  return { ...state, ...resultData };
};

export const AuthContext = createContext<AuthContextValue>({} as AuthContextValue);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider: React.FC<PropsWithChildren<any>> = ({ children }: any) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return <AuthContext.Provider value={{ ...state, dispatch }}>{children}</AuthContext.Provider>;
};
