import { Box, Container } from '@mui/material';
import { Outlet } from '@tanstack/react-router';
import { Navbar } from '../components/shared/Navbar';

export function AppLayout() {
	return (
		<Box
			sx={{
				minHeight: '100vh',
				width: '100vw',
				display: 'flex',
				flexDirection: 'column',
				background: (theme) =>
					theme.palette.mode === 'dark'
						? 'linear-gradient(180deg, #0b0f19 0%, #0e1525 100%)' // ✅ fali ti )
						: '#f8fafc',
			}}
		>
			<Navbar />

			<Box
				sx={{
					flex: 1,
					width: '100%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					px: 2,
				}}
			>
				<Container maxWidth="sm" sx={{ width: '100%' }}>
					<Box sx={{ display: 'flex', justifyContent: 'center' }}>
						<Outlet />
					</Box>
				</Container>
			</Box>
		</Box>
	);
}
