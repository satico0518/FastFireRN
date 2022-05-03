import {Role} from '../interfaces/app-interfaces';

const padTo2Digits = (num: number) => {
  return num.toString().padStart(2, '0');
};

export const convertMsToHM = (milliseconds: number): string => {
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);

  seconds = seconds % 60;
  minutes = seconds >= 30 ? minutes + 1 : minutes;
  minutes = minutes % 60;

  return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}`;
};

export const translateRoles = (role: Role): string => {
  switch (role) {
    case 'ADMIN_ROLE':
      return 'Admin';
    case 'SUPERVISOR_ROLE':
      return 'Supervisor';
    case 'USER_ROLE':
      return 'Operario';
    default:
      return 'Operario';
  }
};

export const addDaysToDate = (date: Date, days: number) => {
  date.setDate(date.getDate() + days);
  return date;
};

export const getLocaleTimeFromDateNumber = (dateNumber: number) => {
  const date = new Date(dateNumber);
  const hr = date.getHours().toLocaleString();
  const mins = date.getMinutes().toLocaleString();
  return `${hr.length < 2 ? '0' + hr : hr}:${ mins.length < 2 ? '0' + mins : mins}`;
};

export const getLocaleFormatedDateString = (date: Date) => {
  const [month, day, _] = date.toLocaleDateString().split('/');
  return `${new Date().getFullYear()}-${month}-${day}`;
}

export const isExtraHours = (milliseconds: number) => {
  console.log(milliseconds);
  const minutes =  milliseconds / 1000 / 60;
  console.log('mins: ', minutes);

  
  if(minutes > 510) return true;
  return false;
}