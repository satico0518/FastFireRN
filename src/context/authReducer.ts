import {User} from '../interfaces/app-interfaces';

export interface AuthState {
  errorMessage: string;
  token: string | null;
  user: User | null;
  status: 'checking' | 'authenticated' | 'not-authenticated';
}

type AuthAction =
  | {type: 'signIn'; payload: {token: string; user: User}}
  | {type: 'addError'; payload: string}
  | {type: 'removeError'}
  | {type: 'authFail'}
  | {type: 'logOut'};

export const authReducer = (
  state: AuthState,
  action: AuthAction,
): AuthState => {
  switch (action.type) {
    case 'addError':
      return {
        ...state,
        user: null,
        status: 'not-authenticated',
        token: null,
        errorMessage: action.payload,
      };
    case 'removeError':
      return {
        ...state,
        errorMessage: '',
      };
    case 'authFail':
    case 'logOut':
      return {
        ...state,
        status: 'not-authenticated',
        token: null,
        user: null,
      };
    case 'signIn':
      return {
        ...state,
        errorMessage: '',
        status: 'authenticated',
        token: action.payload.token,
        user: action.payload.user,
      };
    default:
      return state;
  }
};
