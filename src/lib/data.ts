export type Alert = {
  id: string;
  assetId: string; // Added assetId
  ticketId: string; // Added ticketId
  title: string;
  description: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  timestamp: string;
  source: string;
};

export const mockAlert: Alert = {
  id: 'ALT-12345',
  assetId: 'ASSET-WEB-01',
  ticketId: 'TICK-67890',
  title: 'High CPU Utilization on "web-server-01"',
  description: 'CPU utilization has exceeded 95% for the last 15 minutes. Services may be affected. The process "data-cruncher.py" is consuming the most resources.',
  severity: 'Critical',
  timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  source: 'SuperOps',
};

export const mockAlerts: Alert[] = [
  mockAlert,
  {
    id: 'ALT-67890',
    assetId: 'ASSET-DB-01',
    ticketId: 'TICK-12345',
    title: 'Database Connection Errors',
    description: 'The main application database "prod-db-01" is intermittently refusing connections. Users are reporting errors accessing their data.',
    severity: 'High',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    source: 'SuperOps',
  }
]
