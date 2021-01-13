import { User } from './User'

export interface Teacher
{
    id: number;
    user: User;
    type?: string;
}