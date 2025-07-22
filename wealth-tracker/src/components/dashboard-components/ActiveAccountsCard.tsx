interface ActiveAccountsCardProps {
  recentActivity: number;
}

export function ActiveAccountsCard({
  recentActivity,
}: ActiveAccountsCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-sm font-medium text-gray-700">Active Accounts</h3>
      <p className="text-2xl font-bold mt-2 text-gray-900">{recentActivity}</p>
      <p className="text-xs text-gray-500 mt-1">Money locations tracked</p>
    </div>
  );
}
