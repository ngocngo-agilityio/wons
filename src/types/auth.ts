// Models
import { TUser } from '@/models';

export interface SignInFormData {
  identifier: string;
  password: string;
}

export interface AuthResponse {
  jwt: string;
  user: TUser | null;
  error: string;
}

export interface ISignUpFormData {
  fullName: string;
  username: string;
  email: string;
  password: string;
}

export type TSignUpPayload = {
  fullName: string;
  username: string;
  email: string;
  password: string;
};

export type TSignUpResponse = { jwt: string; user: Omit<TUser, 'password'> };

export type TRole = {
  id: number;
  name: string;
};
