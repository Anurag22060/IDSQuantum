export type AlertLevel = 'low' | 'medium' | 'high' | 'critical';

export interface IntrusionAlert {
  id: string;
  timestamp: string;
  sourceIP: string;
  targetSystem: string;
  description: string;
  level: AlertLevel;
  quantumProbability: number;
  mitigated: boolean;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'analyst' | 'viewer';
}

export interface AnalysisResult {
  algorithm: 'traditional' | 'quantum';
  accuracy: number;
  processingTime: number;
  falsePositives: number;
  falseNegatives: number;
  timestamp: string;
}

export interface DatasetMetrics {
  totalRecords: number;
  attackTypes: { [key: string]: number };
  normalTraffic: number;
  maliciousTraffic: number;
}