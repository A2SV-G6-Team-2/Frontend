import { SpendingDashboard } from '@/app/(protected)/components/spending/SpendingDashboard';
import { mockDashboardData } from '@/lib/mock-data';

export default function SpendingPage() {
  return <SpendingDashboard data={mockDashboardData} />;
}
