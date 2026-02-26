import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import {
	Box,
	Button,
	Chip,
	Divider,
	InputAdornment,
	MenuItem,
	Paper,
	Select,
	Skeleton,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import * as React from 'react';
import { api } from '../../api/api';

type VenueCard = {
	id: string;
	name: string;
	category: string;
	city: string;
	address: string;
	unitsCount: number;
	offeringsCount: number;
	priceFrom: number | null;
};

async function fetchVenues(params: {
	q: string;
	city: string;
	category: string;
}) {
	const res = await api.get<VenueCard[]>('/venues', {
		params: {
			q: params.q || undefined,
			city: params.city === 'all' ? undefined : params.city,
			category: params.category === 'all' ? undefined : params.category,
		},
	});
	return res.data;
}

export function CustomerDashboard() {
	const [q, setQ] = React.useState('');
	const [city, setCity] = React.useState('all');
	const [category, setCategory] = React.useState('all');

	const {
		data = [],
		isLoading,
		isError,
	} = useQuery({
		queryKey: ['venues', q, city, category],
		queryFn: () => fetchVenues({ q, city, category }),
		staleTime: 30_000,
	});

	// gradovi iz podataka (kad se učita)
	const cities = React.useMemo(() => {
		const set = new Set(data.map((x) => x.city).filter(Boolean));
		return ['all', ...Array.from(set)];
	}, [data]);

	const categories = React.useMemo(() => {
		const set = new Set(data.map((x) => x.category).filter(Boolean));
		return ['all', ...Array.from(set)];
	}, [data]);

	return (
		<Box
			sx={{
				display: 'grid',
				gridTemplateColumns: { xs: '1fr', lg: '320px 1fr' },
				gap: 2,
			}}
		>
			{/* Filter panel */}
			<Paper
				variant="outlined"
				sx={{
					p: 2,
					borderRadius: 3,
					position: { lg: 'sticky' },
					top: { lg: 88 },
					height: { lg: 'fit-content' },
				}}
			>
				<Stack
					direction="row"
					alignItems="center"
					justifyContent="space-between"
					mb={1.5}
				>
					<Stack direction="row" spacing={1} alignItems="center">
						<TuneIcon fontSize="small" />
						<Typography fontWeight={800}>Filteri</Typography>
					</Stack>

					<Button
						size="small"
						onClick={() => {
							setQ('');
							setCity('all');
							setCategory('all');
						}}
					>
						Reset
					</Button>
				</Stack>

				<Stack spacing={2}>
					<TextField
						value={q}
						onChange={(e) => setQ(e.target.value)}
						placeholder="Pretraži (naziv, grad, adresa)…"
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<SearchIcon fontSize="small" />
								</InputAdornment>
							),
						}}
					/>

					<Box>
						<Typography
							variant="body2"
							sx={{ mb: 0.75, color: 'text.secondary' }}
						>
							Kategorija
						</Typography>
						<Select
							fullWidth
							value={category}
							onChange={(e) =>
								setCategory(String(e.target.value))
							}
						>
							{categories.map((c) => (
								<MenuItem key={c} value={c}>
									{c === 'all' ? 'Sve' : c}
								</MenuItem>
							))}
						</Select>
					</Box>

					<Box>
						<Typography
							variant="body2"
							sx={{ mb: 0.75, color: 'text.secondary' }}
						>
							Grad
						</Typography>
						<Select
							fullWidth
							value={city}
							onChange={(e) => setCity(String(e.target.value))}
						>
							{cities.map((c) => (
								<MenuItem key={c} value={c}>
									{c === 'all' ? 'Svi gradovi' : c}
								</MenuItem>
							))}
						</Select>
					</Box>

					<Divider />

					<Stack spacing={1}>
						<Typography
							variant="body2"
							sx={{ color: 'text.secondary' }}
						>
							Brzi filteri (primer)
						</Typography>
						<Stack direction="row" flexWrap="wrap" gap={1}>
							{['Belgrade', 'SPORT'].map((t) => (
								<Chip
									key={t}
									label={t}
									clickable
									variant="outlined"
									onClick={() => {
										if (t === 'SPORT') setCategory('SPORT');
										if (t === 'Belgrade')
											setCity('Belgrade');
									}}
								/>
							))}
						</Stack>
					</Stack>
				</Stack>
			</Paper>

			{/* Content */}
			<Box>
				<Paper
					variant="outlined"
					sx={{
						p: 2,
						borderRadius: 3,
						mb: 2,
						background:
							'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0))',
					}}
				>
					<Stack
						direction={{ xs: 'column', md: 'row' }}
						spacing={1}
						justifyContent="space-between"
						alignItems={{ md: 'center' }}
					>
						<Box>
							<Typography variant="h5" fontWeight={900}>
								Objekti i usluge
							</Typography>
							<Typography variant="body2" color="text.secondary">
								Izaberi objekat, pogledaj ponude i rezerviši
								termin.
							</Typography>
						</Box>

						<Stack direction="row" spacing={1}>
							<Button variant="outlined">Mapa (kasnije)</Button>
							<Button variant="contained">
								Moje rezervacije
							</Button>
						</Stack>
					</Stack>
				</Paper>

				<Stack
					direction="row"
					justifyContent="space-between"
					alignItems="center"
					sx={{ mb: 1.5 }}
				>
					<Typography variant="body2" color="text.secondary">
						Prikazano: <b>{isLoading ? '...' : data.length}</b>
					</Typography>
					{isError && (
						<Typography variant="body2" color="error">
							Greška pri učitavanju.
						</Typography>
					)}
				</Stack>

				<Box
					sx={{
						display: 'grid',
						gridTemplateColumns: {
							xs: '1fr',
							sm: '1fr 1fr',
							xl: '1fr 1fr 1fr',
						},
						gap: 2,
					}}
				>
					{isLoading
						? Array.from({ length: 6 }).map((_, i) => (
								<Paper
									key={i}
									variant="outlined"
									sx={{ borderRadius: 3, overflow: 'hidden' }}
								>
									<Skeleton
										variant="rectangular"
										height={140}
									/>
									<Box sx={{ p: 2 }}>
										<Skeleton width="70%" />
										<Skeleton width="45%" />
										<Skeleton width="90%" />
									</Box>
								</Paper>
							))
						: data.map((v) => <VenueCardItem key={v.id} v={v} />)}
				</Box>
			</Box>
		</Box>
	);
}

function VenueCardItem({ v }: { v: VenueCard }) {
	return (
		<Paper
			variant="outlined"
			sx={{
				borderRadius: 3,
				overflow: 'hidden',
				transition: 'transform .12s ease',
				'&:hover': { transform: 'translateY(-2px)' },
			}}
		>
			{/* “Hero” header (bez slika za sad) */}
			<Box
				sx={{
					height: 140,
					bgcolor: 'action.hover',
					p: 2,
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'flex-end',
				}}
			>
				<Chip
					label={v.category}
					size="small"
					variant="outlined"
					sx={{ alignSelf: 'flex-start', mb: 1 }}
				/>
				<Typography fontWeight={900} variant="h6" noWrap>
					{v.name}
				</Typography>
				<Stack direction="row" spacing={0.75} alignItems="center">
					<LocationOnIcon fontSize="small" />
					<Typography variant="body2" color="text.secondary" noWrap>
						{v.city} • {v.address}
					</Typography>
				</Stack>
			</Box>

			<Box sx={{ p: 2 }}>
				<Stack direction="row" gap={1} flexWrap="wrap">
					<Chip
						label={`${v.unitsCount} units`}
						size="small"
						variant="outlined"
					/>
					<Chip
						label={`${v.offeringsCount} ponuda`}
						size="small"
						variant="outlined"
					/>
					<Chip
						label={
							v.priceFrom == null
								? 'Nema cene'
								: `Od ${formatEur(v.priceFrom)}`
						}
						size="small"
						color={v.priceFrom == null ? 'default' : 'primary'}
						variant={v.priceFrom == null ? 'outlined' : 'filled'}
					/>
				</Stack>

				<Divider sx={{ my: 1.5 }} />

				<Stack
					direction="row"
					justifyContent="space-between"
					alignItems="center"
				>
					<Typography fontWeight={900}>
						{v.priceFrom == null
							? '—'
							: `${formatEur(v.priceFrom)} / termin`}
					</Typography>

					{/* <Button
						component={Link}
						to="/venues/$venueId"
						params={{ venueId: v.id }}
						variant="contained"
					>
						Detalji
					</Button> */}
				</Stack>
			</Box>
		</Paper>
	);
}

function formatEur(value: number) {
	return new Intl.NumberFormat('sr-RS', {
		style: 'currency',
		currency: 'EUR',
		maximumFractionDigits: 0,
	}).format(value);
}
