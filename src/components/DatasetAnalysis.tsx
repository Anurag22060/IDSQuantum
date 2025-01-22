import React, { useState } from 'react';
import { Upload, BarChart2, Clock, AlertCircle, ChevronDown, Download, RefreshCw } from 'lucide-react';
import { useStore } from '../lib/store';
import type { AnalysisResult } from '../types';

export const DatasetAnalysis: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState<string>('custom');
  const { setAnalysisResults, setDatasetMetrics } = useStore();

  const predefinedDatasets = [
    { 
      id: 'kdd99', 
      name: 'KDD Cup 1999', 
      records: 4898431,
      results: {
        traditional: {
          accuracy: 0.91,
          processingTime: 1450,
          falsePositives: 52,
          falseNegatives: 38
        },
        quantum: {
          accuracy: 0.98,
          processingTime: 580,
          falsePositives: 15,
          falseNegatives: 10
        },
        metrics: {
          totalRecords: 4898431,
          attackTypes: {
            'DOS': 3883370,
            'Probe': 41102,
            'R2L': 1126,
            'U2R': 52
          },
          normalTraffic: 972781,
          maliciousTraffic: 3925650
        }
      }
    },
    { 
      id: 'unsw', 
      name: 'UNSW-NB15', 
      records: 2540044,
      results: {
        traditional: {
          accuracy: 0.88,
          processingTime: 980,
          falsePositives: 48,
          falseNegatives: 35
        },
        quantum: {
          accuracy: 0.96,
          processingTime: 420,
          falsePositives: 18,
          falseNegatives: 12
        },
        metrics: {
          totalRecords: 2540044,
          attackTypes: {
            'Generic': 1000000,
            'Exploits': 440000,
            'Fuzzers': 380000,
            'DoS': 380000,
            'Reconnaissance': 340044
          },
          normalTraffic: 1500000,
          maliciousTraffic: 1040044
        }
      }
    },
    { 
      id: 'cicids', 
      name: 'CICIDS2017', 
      records: 2830743,
      results: {
        traditional: {
          accuracy: 0.89,
          processingTime: 1100,
          falsePositives: 42,
          falseNegatives: 31
        },
        quantum: {
          accuracy: 0.97,
          processingTime: 480,
          falsePositives: 14,
          falseNegatives: 9
        },
        metrics: {
          totalRecords: 2830743,
          attackTypes: {
            'DDoS': 1200000,
            'PortScan': 850000,
            'BruteForce': 480000,
            'WebAttack': 300743
          },
          normalTraffic: 1800000,
          maliciousTraffic: 1030743
        }
      }
    },
    { 
      id: 'custom', 
      name: 'Custom Dataset', 
      records: 0,
      results: null
    }
  ];

  const handleDatasetSelect = async (datasetId: string) => {
    setSelectedDataset(datasetId);
    if (datasetId !== 'custom') {
      setIsProcessing(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing delay
        const dataset = predefinedDatasets.find(d => d.id === datasetId);
        if (dataset && dataset.results) {
          const results: AnalysisResult[] = [
            {
              algorithm: 'traditional',
              ...dataset.results.traditional,
              timestamp: new Date().toISOString()
            },
            {
              algorithm: 'quantum',
              ...dataset.results.quantum,
              timestamp: new Date().toISOString()
            }
          ];
          setAnalysisResults(results);
          setDatasetMetrics(dataset.results.metrics);
        }
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate file processing
      // For custom uploads, generate random but realistic results
      const results: AnalysisResult[] = [
        {
          algorithm: 'traditional',
          accuracy: 0.85 + Math.random() * 0.1,
          processingTime: 800 + Math.random() * 800,
          falsePositives: Math.floor(30 + Math.random() * 40),
          falseNegatives: Math.floor(20 + Math.random() * 30),
          timestamp: new Date().toISOString()
        },
        {
          algorithm: 'quantum',
          accuracy: 0.92 + Math.random() * 0.07,
          processingTime: 300 + Math.random() * 400,
          falsePositives: Math.floor(10 + Math.random() * 20),
          falseNegatives: Math.floor(5 + Math.random() * 15),
          timestamp: new Date().toISOString()
        }
      ];

      const totalRecords = Math.floor(50000 + Math.random() * 150000);
      const maliciousTraffic = Math.floor(totalRecords * (0.2 + Math.random() * 0.3));
      
      setAnalysisResults(results);
      setDatasetMetrics({
        totalRecords,
        attackTypes: {
          'DOS': Math.floor(maliciousTraffic * 0.4),
          'Probe': Math.floor(maliciousTraffic * 0.3),
          'R2L': Math.floor(maliciousTraffic * 0.2),
          'U2R': Math.floor(maliciousTraffic * 0.1)
        },
        normalTraffic: totalRecords - maliciousTraffic,
        maliciousTraffic
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Dataset Analysis</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <select
              value={selectedDataset}
              onChange={(e) => handleDatasetSelect(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-md pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {predefinedDatasets.map(dataset => (
                <option key={dataset.id} value={dataset.id}>
                  {dataset.name} {dataset.records > 0 && `(${dataset.records.toLocaleString()} records)`}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          <button
            onClick={() => handleDatasetSelect(selectedDataset)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isProcessing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isProcessing ? 'animate-spin' : ''}`} />
            Analyze
          </button>
        </div>
      </div>
      
      {selectedDataset === 'custom' && (
        <div className="mb-8">
          <label className="block mb-4">
            <div className="flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 cursor-pointer">
              <div className="flex flex-col items-center space-y-2">
                <Upload className="w-8 h-8 text-gray-400" />
                <p className="text-sm text-gray-600">
                  {isProcessing ? 'Processing...' : 'Upload network traffic dataset (CSV)'}
                </p>
                <p className="text-xs text-gray-500">
                  Supported formats: CSV, PCAP
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                accept=".csv,.pcap"
                onChange={handleFileUpload}
                disabled={isProcessing}
              />
            </div>
          </label>
        </div>
      )}

      <ComparisonResults />
    </div>
  );
};

const ComparisonResults: React.FC = () => {
  const results = useStore((state) => state.analysisResults);
  const metrics = useStore((state) => state.datasetMetrics);

  if (!results.length || !metrics) return null;

  const traditionalResult = results.find(r => r.algorithm === 'traditional')!;
  const quantumResult = results.find(r => r.algorithm === 'quantum')!;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Analysis Results</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <MetricsCard
          title="Dataset Overview"
          metrics={[
            { label: 'Total Records', value: metrics.totalRecords.toLocaleString() },
            { label: 'Normal Traffic', value: metrics.normalTraffic.toLocaleString() },
            { label: 'Malicious Traffic', value: metrics.maliciousTraffic.toLocaleString() }
          ]}
        />
        
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Attack Distribution</h4>
          <div className="space-y-2">
            {Object.entries(metrics.attackTypes).map(([type, count]) => (
              <div key={type} className="flex items-center">
                <div className="w-24 text-sm text-gray-600">{type}</div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{
                        width: `${(count / metrics.maliciousTraffic) * 100}%`
                      }}
                    />
                  </div>
                </div>
                <div className="w-20 text-right text-sm text-gray-600">
                  {count.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AlgorithmCard
          title="Traditional IDS"
          icon={<BarChart2 className="w-6 h-6 text-blue-500" />}
          metrics={[
            { label: 'Accuracy', value: `${(traditionalResult.accuracy * 100).toFixed(1)}%` },
            { label: 'Processing Time', value: `${traditionalResult.processingTime}ms` },
            { label: 'False Positives', value: traditionalResult.falsePositives.toString() },
            { label: 'False Negatives', value: traditionalResult.falseNegatives.toString() }
          ]}
          className="border-blue-100"
        />

        <AlgorithmCard
          title="Quantum-Enhanced IDS"
          icon={<Clock className="w-6 h-6 text-purple-500" />}
          metrics={[
            { label: 'Accuracy', value: `${(quantumResult.accuracy * 100).toFixed(1)}%` },
            { label: 'Processing Time', value: `${quantumResult.processingTime}ms` },
            { label: 'False Positives', value: quantumResult.falsePositives.toString() },
            { label: 'False Negatives', value: quantumResult.falseNegatives.toString() }
          ]}
          className="border-purple-100"
          improvement={{
            accuracy: ((quantumResult.accuracy - traditionalResult.accuracy) * 100).toFixed(1),
            speed: ((traditionalResult.processingTime - quantumResult.processingTime) / traditionalResult.processingTime * 100).toFixed(1)
          }}
        />
      </div>
    </div>
  );
};

interface MetricsCardProps {
  title: string;
  metrics: Array<{ label: string; value: string }>;
}

const MetricsCard: React.FC<MetricsCardProps> = ({ title, metrics }) => (
  <div className="bg-gray-50 rounded-lg p-4">
    <h4 className="text-sm font-medium text-gray-700 mb-3">{title}</h4>
    <div className="space-y-2">
      {metrics.map(({ label, value }) => (
        <div key={label} className="flex justify-between">
          <span className="text-sm text-gray-600">{label}</span>
          <span className="text-sm font-medium text-gray-900">{value}</span>
        </div>
      ))}
    </div>
  </div>
);

interface AlgorithmCardProps {
  title: string;
  icon: React.ReactNode;
  metrics: Array<{ label: string; value: string }>;
  className?: string;
  improvement?: {
    accuracy: string;
    speed: string;
  };
}

const AlgorithmCard: React.FC<AlgorithmCardProps> = ({
  title,
  icon,
  metrics,
  className = '',
  improvement
}) => (
  <div className={`bg-white rounded-lg p-6 border-2 ${className}`}>
    <div className="flex items-center mb-4">
      {icon}
      <h4 className="text-lg font-medium ml-2">{title}</h4>
    </div>
    
    <div className="space-y-3">
      {metrics.map(({ label, value }) => (
        <div key={label} className="flex justify-between">
          <span className="text-sm text-gray-600">{label}</span>
          <span className="text-sm font-medium text-gray-900">{value}</span>
        </div>
      ))}
    </div>

    {improvement && (
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center text-sm text-green-600">
          <AlertCircle className="w-4 h-4 mr-1" />
          <span>
            {improvement.accuracy}% higher accuracy
          </span>
        </div>
        <div className="flex items-center text-sm text-green-600 mt-1">
          <Clock className="w-4 h-4 mr-1" />
          <span>
            {improvement.speed}% faster processing
          </span>
        </div>
      </div>
    )}
  </div>
);

export default DatasetAnalysis;