import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { AppBar, IconButton, Toolbar, Typography } from '@mui/material';
import { useThemeMode } from '../../theme/mode';

export const Navbar = () => {
	const { mode, toggleMode } = useThemeMode();

	return (
		<AppBar
			position="fixed"
			elevation={0}
			sx={{
				width: '100%',
				left: 0,
				top: 0,
				borderBottom: 1,
				borderColor: 'divider',
			}}
		>
			<Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
				<Typography variant="h5" sx={{ fontWeight: 700 }}>
					BookMe
				</Typography>

				<IconButton
					onClick={toggleMode}
					color="inherit"
					aria-label="toggle theme"
				>
					{mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
				</IconButton>
			</Toolbar>
		</AppBar>
	);
};
