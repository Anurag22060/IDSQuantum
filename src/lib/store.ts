import { create } from 'zustand';
import { AlertLevel, IntrusionAlert, AnalysisResult, DatasetMetrics } from '../types';

interface AppState {
  alerts: IntrusionAlert[];
  analysisResults: AnalysisResult[];
  datasetMetrics: DatasetMetrics | null;
  addAlert: (alert: IntrusionAlert) => void;
  setAlerts: (alerts: IntrusionAlert[]) => void;
  setAnalysisResults: (results: AnalysisResult[]) => void;
  setDatasetMetrics: (metrics: DatasetMetrics) => void;
}

export const useStore = create<AppState>((set) => ({
  alerts: [],
  analysisResults: [],
  datasetMetrics: null,
  addAlert: (alert) => set((state) => ({ alerts: [...state.alerts, alert] })),
  setAlerts: (alerts) => set({ alerts }),
  setAnalysisResults: (results) => set({ analysisResults: results }),
  setDatasetMetrics: (metrics) => set({ datasetMetrics: metrics }),
}));