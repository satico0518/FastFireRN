import React, {createContext, useState} from 'react';

export interface AuthState {
  isLoggedIn: boolean;
  logging: boolean;
  userId: number | null;
}

export const authInitState: AuthState = {
  isLoggedIn: false,
  logging: false,
  userId: null,
};

type AuthContextProps = {
  authState: AuthState;
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>;
};

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({children}: any) => {
  const [authState, setAuthState] = useState(authInitState);

  return (
    <AuthContext.Provider value={{authState, setAuthState}}>
      {children}
    </AuthContext.Provider>
  );
};
