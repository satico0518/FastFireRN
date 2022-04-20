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
