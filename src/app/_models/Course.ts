import { User } from '.';

export interface Course 
{
	id: string;
	name: string;
	room: string;
	credits: number;
	schedule: number[][];
	teacher: User;
}