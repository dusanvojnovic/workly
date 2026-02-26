import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { router } from './router';
import { useAuthStore } from './store/auth.store';
import { ThemeModeProvider } from './theme/mode';

useAuthStore.getState().initAuth();

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<ThemeModeProvider>
				<RouterProvider router={router} />
			</ThemeModeProvider>
		</QueryClientProvider>
	</StrictMode>,
);
