export type AlertSeverity = 'critical' | 'warning' | 'info';

export type TelemetrySample = {
  id: string;
  timestamp: string;
  temperature: number;
  radiation: number;
  energy: number;
  solarInput: number;
  signal: number;
  latency: number;
  orbitalStability: number;
  oxygen: number;
  cpuLoad: number;
};

export type Thresholds = {
  temperatureMax: number;
  radiationMax: number;
  energyMin: number;
  signalMin: number;
  latencyMax: number;
  stabilityMin: number;
  oxygenMin: number;
};

export type MissionAlert = {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  metric: string;
  value: number;
  threshold: number;
  createdAt: string;
  dismissed?: boolean;
};

export type MissionProfile = {
  missionName: string;
  operator: string;
  orbit: string;
  vehicle: string;
  updatedAt: string;
};

export type MissionState = {
  telemetry: TelemetrySample[];
  alerts: MissionAlert[];
  thresholds: Thresholds;
  profile: MissionProfile;
  isLoaded: boolean;
  simulationEnabled: boolean;
};
