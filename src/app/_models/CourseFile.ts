import { User } from './User';

export interface CourseFile 
{
	id: string;
	name: string;
	path: string;
	owner: User;
}