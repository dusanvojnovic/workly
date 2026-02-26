import { CustomerDashboard } from '../components/dashboard/CustomerDashboard';
import { useAuthStore } from '../store/auth.store';

export const DashboardPage: React.FunctionComponent = () => {
	const role = useAuthStore((s) => s.user?.role);
	console.log('ROLE', role);

	if (role === 'PROVIDER') return <p>provider</p>;
	return <CustomerDashboard />;
};
