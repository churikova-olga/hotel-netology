export interface SignUp {
  email: string;
  password: string;
}

export interface SearchUserParams {
  limit: number;
  offset: number;
  name: string;
  contactPhone: string;
  password?: string;
  email: string;
}
