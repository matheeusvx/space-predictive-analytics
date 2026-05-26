import { MissionProfile, TelemetrySample, Thresholds } from '@/types/mission';

export const DEFAULT_THRESHOLDS: Thresholds = {
  temperatureMax: 78,
  radiationMax: 0.42,
  energyMin: 28,
  signalMin: 61,
  latencyMax: 720,
  stabilityMin: 84,
  oxygenMin: 19.2
};

export const DEFAULT_PROFILE: MissionProfile = {
  missionName: 'Astra Sentinel-01',
  operator: 'FIAP Mission Control',
  orbit: 'LEO - Low Earth Orbit',
  vehicle: 'Orbital Analytics Lab',
  updatedAt: new Date().toISOString()
};

const BASE_SAMPLE: TelemetrySample = {
  id: 'seed-0',
  timestamp: new Date().toISOString(),
  temperature: 64,
  radiation: 0.22,
  energy: 74,
  solarInput: 82,
  signal: 91,
  latency: 280,
  orbitalStability: 96,
  oxygen: 20.7,
  cpuLoad: 48
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function round(value: number, decimals = 1): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function wave(index: number, amplitude: number, offset = 0): number {
  return Math.sin((index + offset) / 2.4) * amplitude;
}

export function buildInitialTelemetry(size = 18): TelemetrySample[] {
  return Array.from({ length: size }).map((_, index) => {
    const time = new Date(Date.now() - (size - index) * 3000).toISOString();
    return {
      ...BASE_SAMPLE,
      id: `seed-${index}`,
      timestamp: time,
      temperature: round(63 + wave(index, 5) + index * 0.12),
      radiation: round(0.21 + wave(index, 0.05, 2), 2),
      energy: round(77 - index * 0.45 + wave(index, 2, 4)),
      solarInput: round(82 + wave(index, 8, 1)),
      signal: round(92 + wave(index, 5, 7)),
      latency: round(280 + wave(index, 45, 5), 0),
      orbitalStability: round(96 + wave(index, 1.8, 3)),
      oxygen: round(20.8 + wave(index, 0.25, 8)),
      cpuLoad: round(49 + wave(index, 11, 6))
    };
  });
}

export function generateNextTelemetry(previous: TelemetrySample): TelemetrySample {
  const energyDrain = previous.solarInput > 78 ? 0.25 : 0.8;
  const timestamp = new Date().toISOString();
  const random = (range: number) => (Math.random() - 0.5) * range;

  const sample: TelemetrySample = {
    id: `sample-${Date.now()}`,
    timestamp,
    temperature: round(clamp(previous.temperature + random(5), 42, 88)),
    radiation: round(clamp(previous.radiation + random(0.08), 0.06, 0.55), 2),
    energy: round(clamp(previous.energy - energyDrain + random(3.2), 16, 100)),
    solarInput: round(clamp(previous.solarInput + random(9), 24, 100)),
    signal: round(clamp(previous.signal + random(8), 42, 100)),
    latency: round(clamp(previous.latency + random(120), 110, 900), 0),
    orbitalStability: round(clamp(previous.orbitalStability + random(4), 74, 100)),
    oxygen: round(clamp(previous.oxygen + random(0.5), 18.1, 21.8)),
    cpuLoad: round(clamp(previous.cpuLoad + random(15), 18, 94))
  };

  return sample;
}
