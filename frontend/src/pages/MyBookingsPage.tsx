import { Alert, Box, Button, Paper, Stack, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import dayjs from 'dayjs';
import { api } from '../api/api';
import { useAuthStore } from '../store/auth.store';

type BookingItem = {
	id: string;
	startAt: string;
	endAt: string;
	status: string;
	unit: {
		id: string;
		name: string;
		venue: { id: string; name: string; city: string; address: string | null };
	};
	offering: {
		id: string;
		name: string;
		durationMin: number;
		price: number | null;
	};
};

async function fetchMyBookings(token: string) {
	const res = await api.get<BookingItem[]>('/customer/bookings', {
		headers: { Authorization: `Bearer ${token}` },
	});
	return res.data;
}

export function MyBookingsPage() {
	const token = useAuthStore((s) => s.token);
	const navigate = useNavigate();

	const {
		data = [],
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ['my-bookings', token],
		queryFn: () => fetchMyBookings(token!),
		enabled: !!token,
		staleTime: 30_000,
	});

	if (isLoading) {
		return (
			<Typography variant="body2" color="text.secondary">
				Loading bookings...
			</Typography>
		);
	}

	if (isError) {
		return (
			<Alert severity="error">
				Failed to load bookings.
				{error instanceof Error ? ` ${error.message}` : ''}
			</Alert>
		);
	}

	return (
		<Box sx={{ width: '100%', maxWidth: 1000, mt: 2 }}>
			<Stack
				direction={{ xs: 'column', sm: 'row' }}
				spacing={1}
				alignItems={{ sm: 'center' }}
				justifyContent={{ sm: 'space-between' }}
				sx={{ mb: 2 }}
			>
				<Typography variant="h5" fontWeight={900}>
					My bookings
				</Typography>
				<Button variant="outlined" onClick={() => navigate({ to: '/dashboard' })}>
					Back to dashboard
				</Button>
			</Stack>

			{data.length === 0 ? (
				<Typography variant="body2" color="text.secondary">
					No bookings yet.
				</Typography>
			) : (
				<Stack spacing={1.5}>
					{data.map((booking) => {
						const start = dayjs(booking.startAt);
						const end = dayjs(booking.endAt);

						return (
							<Paper key={booking.id} variant="outlined" sx={{ p: 2 }}>
								<Stack
									direction={{ xs: 'column', sm: 'row' }}
									justifyContent="space-between"
									spacing={1}
								>
									<Box>
										<Typography fontWeight={800}>
											{booking.unit.venue.name}
										</Typography>
										<Typography variant="body2" color="text.secondary">
											{booking.unit.name} • {booking.offering.name}
										</Typography>
										<Stack direction="row" spacing={1} alignItems="center">
											<Typography variant="body2" color="text.secondary">
												{formatVenueAddress(booking.unit.venue)}
											</Typography>
											<Button
												size="small"
												variant="text"
												onClick={() => {
													const query = encodeURIComponent(
														formatVenueAddress(booking.unit.venue),
													);
													window.open(
														`https://www.google.com/maps/search/?api=1&query=${query}`,
														'_blank',
													);
												}}
											>
												Show on map
											</Button>
										</Stack>
									</Box>
									<Box textAlign={{ sm: 'right' }}>
										<Typography fontWeight={700}>
											{start.format('DD MMM YYYY')}
										</Typography>
										<Typography variant="body2" color="text.secondary">
											{start.format('HH:mm')}–{end.format('HH:mm')}
										</Typography>
										<Typography variant="body2" color="text.secondary">
											{booking.offering.durationMin} min
											{booking.offering.price != null
												? ` • ${booking.offering.price} RSD`
												: ''}
										</Typography>
										<Typography variant="body2" color="text.secondary">
											{formatStatus(booking.status)}
										</Typography>
									</Box>
								</Stack>
							</Paper>
						);
					})}
				</Stack>
			)}
		</Box>
	);
}

function formatStatus(status: string) {
	switch (status) {
		case 'CONFIRMED':
			return 'Confirmed';
		case 'PENDING':
			return 'Pending';
		case 'CANCELLED':
			return 'Cancelled';
		case 'COMPLETED':
			return 'Completed';
		default:
			return status;
	}
}

function formatVenueAddress(venue: { city: string; address: string | null }) {
	return venue.address ? `${venue.address}, ${venue.city}` : venue.city;
}
