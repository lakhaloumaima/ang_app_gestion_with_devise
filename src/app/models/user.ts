
import { Company } from "./company";

export class User {
    id?: number;
    last_name?: string;
    first_name?: string;
    email?: string;
    password?: string;
    role?: string;
    company?: Company;
  }
