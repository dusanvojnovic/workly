import { CustomerDashboard } from '../components/dashboard/CustomerDashboard';
import { ProviderDashboard } from '../components/dashboard/ProviderDashboard';
import { useAuthStore } from '../store/auth.store';

export const DashboardPage: React.FunctionComponent = () => {
	const role = useAuthStore((s) => s.user?.role);

	if (role === 'PROVIDER') return <ProviderDashboard />;
	return <CustomerDashboard />;
};
