import { jwtDecode } from 'jwt-decode';
import { create } from 'zustand';
import { api } from '../api/api';
import { type AuthStore, type AuthUser, type Role } from '../types/auth';

type JwtPayload = { sub: string; role: Role; exp?: number };
const STORAGE_KEY = 'accessToken';

function isExpired(exp?: number) {
	if (!exp) return false;
	return Date.now() >= exp * 1000;
}

function decodeToken(token: string): { user: AuthUser; exp?: number } {
	const decoded = jwtDecode<JwtPayload>(token);
	if (!decoded?.sub || !decoded?.role) {
		throw new Error('Invalid token payload');
	}
	return {
		user: { id: decoded.sub, role: decoded.role },
		exp: decoded.exp,
	};
}

function setAuthState(
	set: (partial: Partial<AuthStore>) => void,
	token: string,
) {
	const { user, exp } = decodeToken(token);

	if (isExpired(exp)) {
		localStorage.removeItem(STORAGE_KEY);
		set({ token: null, user: null });
		return;
	}

	localStorage.setItem(STORAGE_KEY, token);
	set({ token, user });
}

export const useAuthStore = create<AuthStore>((set) => ({
	token: null,
	user: null,

	initAuth: () => {
		const token = localStorage.getItem(STORAGE_KEY);
		if (!token) return;
		try {
			setAuthState(set, token);
		} catch {
			localStorage.removeItem(STORAGE_KEY);
			set({ token: null, user: null });
		}
	},

	logout: () => {
		localStorage.removeItem(STORAGE_KEY);
		set({ token: null, user: null });
	},

	login: async (payload) => {
		const res = await api.post<{ accessToken: string }>(
			'/auth/login',
			payload,
		);
		setAuthState(set, res.data.accessToken);
	},

	register: async (payload) => {
		const res = await api.post<{ accessToken: string }>(
			'/auth/register',
			payload,
		);
		setAuthState(set, res.data.accessToken);
	},
}));
