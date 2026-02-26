import { zodResolver } from '@hookform/resolvers/zod';
import {
	Alert,
	Box,
	Button,
	Card,
	CardContent,
	Divider,
	IconButton,
	InputAdornment,
	MenuItem,
	TextField,
	Typography,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Link, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAuthStore } from '../../store/auth.store';

type Mode = 'login' | 'register';

const SERVICE_CATEGORY_OPTIONS = [
	'SPORT',
	'BUSINESS',
	'EVENTS',
	'FOOD',
	'WELLNESS',
] as const;

const loginSchema = z.object({
	email: z.email('Invalid email'),
	password: z.string().min(1, 'Fill password'),
});
type LoginFormData = z.infer<typeof loginSchema>;

const registerSchema = z
	.object({
		email: z.email('Invalid email'),
		password: z
			.string()
			.min(6, 'Password must be at least 6 characters long'),
		role: z.enum(['customer', 'provider']),
		companyName: z
			.string()
			.transform((v) => (v?.trim() ? v.trim() : undefined))
			.optional(),
		serviceCategory: z.enum(SERVICE_CATEGORY_OPTIONS).optional(),
	})
	.superRefine((val, ctx) => {
		if (
			val.role === 'provider' &&
			(!val.companyName || val.companyName.trim().length < 2)
		) {
			ctx.addIssue({
				code: 'custom',
				message: 'Add company name (min 2 characters)',
				path: ['companyName'],
			});
		}

		if (val.role === 'provider' && !val.serviceCategory) {
			ctx.addIssue({
				code: 'custom',
				message: 'Select a service category',
				path: ['serviceCategory'],
			});
		}
	});
type RegisterFormData = z.infer<typeof registerSchema>;

function AuthShell({
	title,
	serverError,
	children,
	footer,
}: {
	title: string;
	serverError: string | null;
	children: React.ReactNode;
	footer: React.ReactNode;
}) {
	return (
		<Card
			sx={{
				width: '100%',
				maxWidth: 420,
				borderRadius: 3,
				backdropFilter: 'blur(10px)',
				background: (theme) =>
					theme.palette.mode === 'dark'
						? 'rgba(15, 23, 42, 0.7)'
						: '#ffffff',
				boxShadow:
					'0px 20px 40px rgba(0,0,0,0.25), 0px 4px 12px rgba(0,0,0,0.15)',
			}}
		>
			<CardContent sx={{ p: 4 }}>
				<Typography variant="h4" fontWeight={700} mb={2}>
					{title}
				</Typography>

				{serverError && (
					<Alert severity="error" sx={{ mb: 2 }}>
						{serverError}
					</Alert>
				)}

				{children}

				{footer && (
					<>
						<Divider sx={{ my: 3 }} />
						{footer}
					</>
				)}
			</CardContent>
		</Card>
	);
}

function LoginInner() {
	const navigate = useNavigate();
	const login = useAuthStore((s) => s.login);
	const [serverError, setServerError] = useState<string | null>(null);
	const [showPassword, setShowPassword] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		defaultValues: { email: '', password: '' },
	});

	const onSubmit = handleSubmit(async (data) => {
		setServerError(null);
		try {
			await login(data);
			navigate({ to: '/dashboard' });
		} catch (e: unknown) {
			const message =
				typeof e === 'object' && e !== null && 'response' in e
					? (e as { response?: { data?: { message?: string } } })
							.response?.data?.message
					: undefined;

			setServerError(message ?? 'An error occurred');
		}
	});

	return (
		<AuthShell
			title="Login"
			serverError={serverError}
			footer={
				<Typography variant="body2" textAlign="center">
					Don't have an account?{' '}
					<Link to="/register" style={{ fontWeight: 600 }}>
						Register
					</Link>
				</Typography>
			}
		>
			<Box component="form" onSubmit={onSubmit}>
				<TextField
					label="Email"
					type="email"
					fullWidth
					margin="normal"
					{...register('email')}
					error={!!errors.email}
					helperText={errors.email?.message}
				/>

				<TextField
					label="Password"
					type={showPassword ? 'text' : 'password'}
					fullWidth
					margin="normal"
					{...register('password')}
					error={!!errors.password}
					helperText={errors.password?.message}
					slotProps={{
						input: {
							endAdornment: (
								<InputAdornment position="end">
									<IconButton
										aria-label="toggle password visibility"
										onClick={() => setShowPassword((v) => !v)}
										edge="end"
									>
										{showPassword ? (
											<VisibilityOffIcon />
										) : (
											<VisibilityIcon />
										)}
									</IconButton>
								</InputAdornment>
							),
						},
					}}
				/>

				<Button
					type="submit"
					fullWidth
					variant="contained"
					disabled={isSubmitting}
					sx={{ mt: 2, textTransform: 'none' }}
				>
					{isSubmitting ? 'Submitting...' : 'Login'}
				</Button>
			</Box>
		</AuthShell>
	);
}

function RegisterInner() {
	const navigate = useNavigate();
	const registerUser = useAuthStore((s) => s.register);
	const [serverError, setServerError] = useState<string | null>(null);
	const [showPassword, setShowPassword] = useState(false);

	const {
		register,
		handleSubmit,
		control,
		watch,
		formState: { errors, isSubmitting },
	} = useForm<RegisterFormData>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			email: '',
			password: '',
			role: 'customer',
			companyName: '',
			serviceCategory: undefined,
		},
	});

	const role = watch('role');
	const roleMap = { customer: 'CUSTOMER', provider: 'PROVIDER' };

	const onSubmit = handleSubmit(async (data) => {
		setServerError(null);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const payload: any = {
			email: data.email,
			password: data.password,
			role: roleMap[data.role],
		};
		if (data.role === 'provider') {
			payload.companyName = data.companyName;
			payload.serviceCategory = data.serviceCategory;
		}
		try {
			await registerUser(data);
			navigate({ to: '/dashboard' });
		} catch (e: unknown) {
			const message =
				typeof e === 'object' && e !== null && 'response' in e
					? (
							e as {
								response?: {
									data?: { message?: string | string[] };
								};
							}
						).response?.data?.message
					: undefined;

			setServerError(
				Array.isArray(message)
					? message.join(', ')
					: (message ?? 'An error occurred'),
			);
		}
	});

	return (
		<AuthShell
			title="Register"
			serverError={serverError}
			footer={
				<Typography variant="body2" textAlign="center">
					Already have an account?{' '}
					<Link to="/login" style={{ fontWeight: 600 }}>
						Login
					</Link>
				</Typography>
			}
		>
			<Box component="form" onSubmit={onSubmit}>
				<TextField
					label="Email"
					type="email"
					fullWidth
					margin="normal"
					{...register('email')}
					error={!!errors.email}
					helperText={errors.email?.message}
				/>

				<TextField
					label="Password"
					type={showPassword ? 'text' : 'password'}
					fullWidth
					margin="normal"
					{...register('password')}
					error={!!errors.password}
					helperText={errors.password?.message}
					slotProps={{
						input: {
							endAdornment: (
								<InputAdornment position="end">
									<IconButton
										aria-label="toggle password visibility"
										onClick={() => setShowPassword((v) => !v)}
										edge="end"
									>
										{showPassword ? (
											<VisibilityOffIcon />
										) : (
											<VisibilityIcon />
										)}
									</IconButton>
								</InputAdornment>
							),
						},
					}}
				/>

				<Controller
					name="role"
					control={control}
					render={({ field }) => (
						<TextField
							select
							label="Account type"
							fullWidth
							margin="normal"
							value={field.value ?? 'customer'}
							onChange={field.onChange}
							error={!!errors.role}
							helperText={errors.role?.message}
						>
							<MenuItem value="customer">Customer</MenuItem>
							<MenuItem value="provider">Provider</MenuItem>
						</TextField>
					)}
				/>

				{role === 'provider' && (
					<>
						<TextField
							label="Company name"
							fullWidth
							margin="normal"
							{...register('companyName')}
							error={!!errors.companyName}
							helperText={errors.companyName?.message}
						/>

						<Controller
							name="serviceCategory"
							control={control}
							render={({ field }) => (
								<TextField
									select
									label="Service category"
									fullWidth
									margin="normal"
									value={field.value ?? ''}
									onChange={field.onChange}
									error={!!errors.serviceCategory}
									helperText={errors.serviceCategory?.message}
								>
									{SERVICE_CATEGORY_OPTIONS.map((option) => (
										<MenuItem key={option} value={option}>
											{option}
										</MenuItem>
									))}
								</TextField>
							)}
						/>
					</>
				)}

				<Button
					type="submit"
					fullWidth
					variant="contained"
					disabled={isSubmitting}
					sx={{ mt: 2, textTransform: 'none' }}
				>
					{isSubmitting ? 'Submitting...' : 'Register'}
				</Button>
			</Box>
		</AuthShell>
	);
}

export function AuthForm({ mode }: { mode: Mode }) {
	return mode === 'login' ? <LoginInner /> : <RegisterInner />;
}
