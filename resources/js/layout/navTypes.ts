export type NavRoutes = {
    home: string;
    map: string;
    summary: string;
    login: string;
    logout: string;
    editUserMe: string;
    crewsIndex: string;
    aircraftIndex: string;
    usersIndex: string;
    privacy: string;
    newStatus?: string | null;
    editCrew?: string | null;
    crewAccounts?: string | null;
};

export type NavConfig = {
    type: 'guest' | 'user' | 'admin';
    active: string;
    userName: string | null;
    crewId: number | null;
    routes: NavRoutes;
};

declare global {
    interface Window {
        Laravel: {
            csrfToken: string;
            nav: NavConfig;
            pusher?: {
                appKey?: string;
                cluster?: string;
                encrypted?: boolean;
            };
        };
    }
}

export function getNavConfig(): NavConfig {
    if (window.Laravel?.nav) {
        return window.Laravel.nav;
    }

    return {
        type: 'guest',
        active: '',
        userName: null,
        crewId: null,
        routes: {
            home: '/',
            map: '/map',
            summary: '/summary',
            login: '/login',
            logout: '/logout',
            editUserMe: '/account',
            crewsIndex: '/crews',
            aircraftIndex: '/aircraft',
            usersIndex: '/accounts',
            privacy: '/privacy',
        },
    };
}
