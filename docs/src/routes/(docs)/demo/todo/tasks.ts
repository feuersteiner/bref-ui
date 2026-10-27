import type { SelectOptionDataProps } from 'bref-ui/types';
export const projectPhotos = {
	studio: { label: 'Studio', src: 'demos/relay-studio.jpg' },
	website: { label: 'Architecture', src: 'demos/relay-website.jpg' },
	mobile: { label: 'Glass', src: 'demos/relay-mobile.jpg' },
	room: { label: 'Lounge', src: 'demos/forma-room.jpg' }
} as const;
export interface Project extends SelectOptionDataProps {
	photo: keyof typeof projectPhotos;
}
export const initialProjects: Project[] = [
	{ id: 'website', label: 'Website launch', icon: { name: 'language' }, photo: 'website' },
	{ id: 'mobile', label: 'Mobile app', icon: { name: 'mobile' }, photo: 'mobile' }
];
export interface Task {
	id: number;
	title: string;
	project: string;
	assignee: string;
	priority: string;
	done: boolean;
}
export const initialPeople = ['Maya', 'Alex', 'Sam'];
export const initialTasks: Task[] = [
	{
		id: 1,
		title: 'Explore the new visual direction',
		project: 'website',
		assignee: 'Maya',
		priority: 'high',
		done: true
	},
	{
		id: 2,
		title: 'Build the component library',
		project: 'website',
		assignee: 'Alex',
		priority: 'high',
		done: false
	},
	{
		id: 3,
		title: 'Write the homepage story',
		project: 'website',
		assignee: 'Sam',
		priority: 'medium',
		done: false
	},
	{
		id: 4,
		title: 'Review mobile navigation',
		project: 'mobile',
		assignee: 'Maya',
		priority: 'medium',
		done: false
	},
	{
		id: 5,
		title: 'Map the onboarding journey',
		project: 'mobile',
		assignee: 'Alex',
		priority: 'low',
		done: true
	},
	{
		id: 6,
		title: 'Run accessibility checks',
		project: 'website',
		assignee: 'Sam',
		priority: 'high',
		done: false
	}
];
