import { User } from './User';

export interface CourseFile 
{
	id: number;
	name: string;
	path: string;
	owner: User;
}