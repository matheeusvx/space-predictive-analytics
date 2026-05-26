import { MissionAlert, TelemetrySample, Thresholds } from '@/types/mission';

function createAlert(params: Omit<MissionAlert, 'id' | 'createdAt'>): MissionAlert {
  return {
    ...params,
    id: `${params.metric}-${Date.now()}-${Math.round(Math.random() * 10000)}`,
    createdAt: new Date().toISOString()
  };
}

export function detectAlerts(sample: TelemetrySample, thresholds: Thresholds): MissionAlert[] {
  const alerts: MissionAlert[] = [];

  if (sample.temperature >= thresholds.temperatureMax) {
    alerts.push(createAlert({
      title: 'Temperatura acima do limite',
      description: 'Modulo termico operando em faixa critica. Recomenda-se reduzir carga de processamento.',
      severity: sample.temperature >= thresholds.temperatureMax + 6 ? 'critical' : 'warning',
      metric: 'temperature',
      value: sample.temperature,
      threshold: thresholds.temperatureMax
    }));
  }

  if (sample.radiation >= thresholds.radiationMax) {
    alerts.push(createAlert({
      title: 'Radiacao elevada',
      description: 'Leitura de radiacao ultrapassou o limiar configurado para operacao nominal.',
      severity: sample.radiation >= thresholds.radiationMax + 0.07 ? 'critical' : 'warning',
      metric: 'radiation',
      value: sample.radiation,
      threshold: thresholds.radiationMax
    }));
  }

  if (sample.energy <= thresholds.energyMin) {
    alerts.push(createAlert({
      title: 'Energia baixa',
      description: 'Banco de baterias abaixo do minimo definido. Priorize sistemas essenciais.',
      severity: sample.energy <= thresholds.energyMin - 8 ? 'critical' : 'warning',
      metric: 'energy',
      value: sample.energy,
      threshold: thresholds.energyMin
    }));
  }

  if (sample.signal <= thresholds.signalMin) {
    alerts.push(createAlert({
      title: 'Perda de qualidade no sinal',
      description: 'Link de telemetria instavel. Ajuste de antena ou janela de transmissao recomendado.',
      severity: sample.signal <= thresholds.signalMin - 10 ? 'critical' : 'warning',
      metric: 'signal',
      value: sample.signal,
      threshold: thresholds.signalMin
    }));
  }

  if (sample.latency >= thresholds.latencyMax) {
    alerts.push(createAlert({
      title: 'Latencia critica',
      description: 'Atraso de comunicacao acima do toleravel para operacoes de resposta rapida.',
      severity: sample.latency >= thresholds.latencyMax + 120 ? 'critical' : 'warning',
      metric: 'latency',
      value: sample.latency,
      threshold: thresholds.latencyMax
    }));
  }

  if (sample.orbitalStability <= thresholds.stabilityMin) {
    alerts.push(createAlert({
      title: 'Estabilidade orbital reduzida',
      description: 'Desvio de estabilidade detectado no padrao orbital simulado.',
      severity: sample.orbitalStability <= thresholds.stabilityMin - 5 ? 'critical' : 'warning',
      metric: 'orbitalStability',
      value: sample.orbitalStability,
      threshold: thresholds.stabilityMin
    }));
  }

  if (sample.oxygen <= thresholds.oxygenMin) {
    alerts.push(createAlert({
      title: 'Oxigenio em nivel baixo',
      description: 'Suporte ambiental abaixo do padrao de seguranca configurado.',
      severity: sample.oxygen <= thresholds.oxygenMin - 0.5 ? 'critical' : 'warning',
      metric: 'oxygen',
      value: sample.oxygen,
      threshold: thresholds.oxygenMin
    }));
  }

  return alerts;
}

export function calculateMissionRisk(sample: TelemetrySample, thresholds: Thresholds): number {
  const temperatureRisk = Math.max(0, (sample.temperature - 58) / (thresholds.temperatureMax - 58));
  const energyRisk = Math.max(0, (thresholds.energyMin + 35 - sample.energy) / 35);
  const signalRisk = Math.max(0, (thresholds.signalMin + 30 - sample.signal) / 30);
  const latencyRisk = Math.max(0, sample.latency / thresholds.latencyMax - 0.45);
  const stabilityRisk = Math.max(0, (thresholds.stabilityMin + 12 - sample.orbitalStability) / 12);
  const radiationRisk = Math.max(0, sample.radiation / thresholds.radiationMax - 0.5);

  const score = (temperatureRisk + energyRisk + signalRisk + latencyRisk + stabilityRisk + radiationRisk) / 6;
  return Math.min(100, Math.round(score * 100));
}
