import { SideNavItems, SideNavSection } from '@modules/navigation/models';

export const sideNavSections: SideNavSection[] = [
    {
        text: '',
        items: ['dashboard']
    },
    {
        text: '',
        items: ['folder']
    }, 
    {
        text: '',
        items: ['tasks']
    }, 
    {
        text: '',
        items: ['modules']
    }, 
    {
        text: '',
        items: ['notifications']
    },
];

export const sideNavItems: SideNavItems = {
    dashboard: {
        icon: 'tachometer-alt',
        text: 'Car Brand',
        link: '/dashboard',
    },
    folder: {
        icon: '',
        text: 'Folder',
        link: '/folder',
    },
    tasks: {
        icon: '',
        text: 'Tasks',
        link: '/tasks',
    },
    modules: {
        icon: '',
        text: 'Modules',
        link: '/modules',
    },
    notifications: {
        icon: '',
        text: 'Notifications',
        link: '/notifications',
    },
};
