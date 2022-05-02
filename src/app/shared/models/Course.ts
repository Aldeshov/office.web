import { User } from './User';

export interface Course
{
	id: string;
	name: string;
	room: string;
	credits: number;
	schedule: number[][];
	teacher: User;
}
