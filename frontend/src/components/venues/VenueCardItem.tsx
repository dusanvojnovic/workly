import LocationOnIcon from '@mui/icons-material/LocationOn';
import {
	Box,
	Button,
	Chip,
	Divider,
	Paper,
	Stack,
	Typography,
} from '@mui/material';

export type VenueCard = {
	id: string;
	name: string;
	category: string;
	city: string;
	address: string;
	unitsCount: number;
	offeringsCount: number;
	priceFrom: number | null;
};

export function VenueCardItem({
	v,
	onOpen,
}: {
	v: VenueCard;
	onOpen: () => void;
}) {
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
			{/* “Hero” header (no images yet) */}
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
						label={`${v.offeringsCount} offerings`}
						size="small"
						variant="outlined"
					/>
					<Chip
						label={
							v.priceFrom == null
								? 'No price'
								: `From ${formatEur(v.priceFrom)}`
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
							: `${formatEur(v.priceFrom)} / slot`}
					</Typography>

					<Button variant="contained" onClick={onOpen}>
						Details
					</Button>
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
