import { Typography } from '@mui/material';
import {
	createRootRoute,
	createRoute,
	createRouter,
	Outlet,
	redirect,
} from '@tanstack/react-router';
import { AppLayout } from '../layout/AppLayout';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { useAuthStore } from '../store/auth.store';

const rootRoute = createRootRoute({
	component: () => <AppLayout />,
});

const loginRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: '/login',
	component: LoginPage,
});

const registerRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: '/register',
	component: RegisterPage,
});

const protectedRoute = createRoute({
	getParentRoute: () => rootRoute,
	id: 'protected',
	beforeLoad: () => {
		const token = useAuthStore.getState().token;
		if (!token) throw redirect({ to: '/login' });
	},
	component: Outlet,
});

const dashboardRoute = createRoute({
	getParentRoute: () => protectedRoute,
	path: '/dashboard',
	component: () => <Typography>DASHBOARD</Typography>,
});

const routeTree = rootRoute.addChildren([
	loginRoute,
	registerRoute,
	protectedRoute.addChildren([dashboardRoute]),
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router;
	}
}
