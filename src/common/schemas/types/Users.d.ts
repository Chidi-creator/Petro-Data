import { Role } from "src/config/constants";
export interface IUser {
    firstName: string;
    lastName: string;
    email: string;
     phoneNumber: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
    isActive?: boolean;
    role: Role[];
    DeletedAt?: Date;
}