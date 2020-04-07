import { User } from './User'
import { Course } from './Course'

export interface Student extends User 
{
	id: string;
	login: string;
	password: string;
	name: string;
	courses: Course[];
	type: string;
}
