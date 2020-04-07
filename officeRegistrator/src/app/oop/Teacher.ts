import { User } from './User'

export interface Teacher extends User
{
    id: string;
	login: string;
    password: string;
    name: string;
    type: string;
}