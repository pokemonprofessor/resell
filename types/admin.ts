export interface IAdmin extends Document {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role?: string;
}

export interface singIn extends Document {
  email: string;
  password: string;
}
