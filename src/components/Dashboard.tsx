import React from 'react';
import { useStore } from '../lib/store';
import { Shield, AlertTriangle, Activity, Database, Zap, History, Filter, Download } from 'lucide-react';
import { format } from 'date-fns';

export const Dashboard: React.FC = () => {
  const alerts = useStore((state) => state.alerts);
  
  const criticalAlerts = alerts.filter(a => a.level === 'critical');
  const recentAlerts = alerts.slice(0, 5);

  const handleExportAlerts = () => {
    const csvContent = [
      ['Timestamp', 'Level', 'Source IP', 'Target System', 'Description', 'Q-Probability', 'Mitigated'].join(','),
      ...alerts.map(alert => [
        alert.timestamp,
        alert.level,
        alert.sourceIP,
        alert.targetSystem,
        `"${alert.description}"`,
        alert.quantumProbability,
        alert.mitigated
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quantum-ids-alerts-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Shield className="w-8 h-8 text-emerald-500" />}
          title="System Status"
          value="Active"
          description="Quantum IDS Operational"
          trend="+99.9% uptime"
          trendUp={true}
        />
        <StatCard
          icon={<AlertTriangle className="w-8 h-8 text-red-500" />}
          title="Critical Alerts"
          value={criticalAlerts.length.toString()}
          description="Last 24 hours"
          trend="-12% from yesterday"
          trendUp={false}
        />
        <StatCard
          icon={<Activity className="w-8 h-8 text-blue-500" />}
          title="Detection Rate"
          value="99.9%"
          description="Quantum-enhanced accuracy"
          trend="+2.3% improvement"
          trendUp={true}
        />
        <StatCard
          icon={<Database className="w-8 h-8 text-purple-500" />}
          title="Systems Monitored"
          value="124"
          description="Active endpoints"
          trend="+3 new systems"
          trendUp={true}
        />
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Alerts</h2>
            <div className="flex space-x-4">
              <button
                onClick={() => {}}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </button>
              <button
                onClick={handleExportAlerts}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source IP</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Q-Probability</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentAlerts.map((alert) => (
                <tr key={alert.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(alert.timestamp), 'HH:mm:ss')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <AlertBadge level={alert.level} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-900">{alert.sourceIP}</span>
                      {alert.level === 'critical' && (
                        <span className="ml-2">
                          <Zap className="w-4 h-4 text-red-500" />
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-md truncate">
                    {alert.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${alert.quantumProbability * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-900">
                        {(alert.quantumProbability * 100).toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        alert.mitigated
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {alert.mitigated ? 'Mitigated' : 'Active'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {}}
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500"
            >
              <History className="w-4 h-4 mr-1" />
              View Alert History
            </button>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Showing 5 of {alerts.length} alerts</span>
              <button className="text-blue-600 hover:text-blue-500">View All</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
  trend: string;
  trendUp: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  title,
  value,
  description,
  trend,
  trendUp
}) => (
  <div className="bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-[1.02]">
    <div className="flex items-center">
      <div className="p-2 rounded-lg bg-gray-50">{icon}</div>
      <div className="ml-4">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
        <p className={`text-sm mt-2 ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
          {trend}
        </p>
      </div>
    </div>
  </div>
);

const AlertBadge: React.FC<{ level: AlertLevel }> = ({ level }) => {
  const colors = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colors[level]}`}>
      {level.charAt(0).toUpperCase() + level.slice(1)}
    </span>
  );
};