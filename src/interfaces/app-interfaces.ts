export interface RegisterResponse {
    msg:  string;
    user: User;
}

export interface LoginResponse {
    user:  User;
    token: string;
}

export interface LoginData {
    user?: string;
    password: string;
    deviceId: string;
}

export interface RegisterData extends LoginData {
    identification: string;
    name: string;
}

export type Role = 'USER_ROLE' | 'SUPERVISOR_ROLE' | 'ADMIN_ROLE';

export interface User {
    _id:            string;
    deviceId:       string;
    deviceIdFailed: string | null;
    identification: string;
    name:           string;
    role:           Role;
    createdDate:    string;
    isActive:       boolean;
    img?:           string;
}


export interface InactiveUsersRersponse {
    total: number;
    users: User[];
}
