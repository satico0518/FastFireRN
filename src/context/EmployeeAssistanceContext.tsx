import React, {createContext, useState} from 'react';

export interface EmployeeAssistanceState {
    isIn: boolean;
    location: any;
    inTime?: string;
    outTime?: string;
}

export const EmployeeAssistanceInitState: EmployeeAssistanceState = {
    isIn: false,
    location: null,
};

type EmployeeAssistanceContextProps = {
  employeeAssistanceState: EmployeeAssistanceState;
  setEmployeeAssistanceState: React.Dispatch<
    React.SetStateAction<EmployeeAssistanceState>
  >;
};

export const EmployeeAssistanceContext = createContext(
  {} as EmployeeAssistanceContextProps,
);

export const EmployeeAssistanceProvider = ({children}: any) => {
  const [employeeAssistanceState, setEmployeeAssistanceState] = useState(
    EmployeeAssistanceInitState,
  );

  return (
    <EmployeeAssistanceContext.Provider value={{employeeAssistanceState, setEmployeeAssistanceState}}>
      {children}
    </EmployeeAssistanceContext.Provider>
  );
};
