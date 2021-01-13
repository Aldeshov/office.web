import { User } from './User'
import { Course } from './Course'
import { CourseFile } from './CourseFile'

export interface Student
{
	id: number;
	user: User;
	courses: Course[];
	files: CourseFile[];
}