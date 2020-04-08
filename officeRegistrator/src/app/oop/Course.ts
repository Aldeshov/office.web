import { Teacher } from './Teacher';

export interface Course 
{
	id: string;
	name: string;
	credits: number;
	schedule: number[][];
	teacher: Teacher;
	room: string;
}