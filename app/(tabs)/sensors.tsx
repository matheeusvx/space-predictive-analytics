import React from 'react';
import { StyleSheet, View } from 'react-native';
import { MetricCard } from '@/components/MetricCard';
import { ProgressBar } from '@/components/ProgressBar';
import { Screen } from '@/components/Screen';
import { SectionCard } from '@/components/SectionCard';
import { TelemetryChart } from '@/components/TelemetryChart';
import { colors, spacing } from '@/constants/theme';
import { useMission } from '@/context/MissionContext';

export default function SensorsScreen() {
  const { state, latest } = useMission();

  return (
    <Screen>
      <SectionCard title="Dashboard de Sensores" subtitle="Temperatura, radiacao, suporte ambiental e carga computacional" icon="pulse">
        <View style={styles.grid}>
          <MetricCard label="Temp." value={`${latest.temperature.toFixed(1)}C`} helper={`Max: ${state.thresholds.temperatureMax}C`} icon="thermometer" tone={latest.temperature >= state.thresholds.temperatureMax ? 'red' : 'yellow'} />
          <MetricCard label="Radiacao" value={latest.radiation.toFixed(2)} helper={`Max: ${state.thresholds.radiationMax}`} icon="nuclear" tone={latest.radiation >= state.thresholds.radiationMax ? 'red' : 'primary'} />
          <MetricCard label="Oxigenio" value={`${latest.oxygen.toFixed(1)}%`} helper={`Min: ${state.thresholds.oxygenMin}%`} icon="leaf" tone={latest.oxygen <= state.thresholds.oxygenMin ? 'red' : 'green'} />
          <MetricCard label="CPU" value={`${latest.cpuLoad.toFixed(0)}%`} helper="Processamento" icon="hardware-chip" tone={latest.cpuLoad >= 88 ? 'red' : 'cyan'} />
        </View>
      </SectionCard>

      <SectionCard title="Leituras termicas" subtitle="Variacao da temperatura nos ultimos ciclos" icon="thermometer">
        <TelemetryChart title="Temperatura" values={state.telemetry.map((item) => item.temperature)} min={40} max={90} suffix="C" stroke={colors.yellow} />
      </SectionCard>

      <SectionCard title="Radiacao orbital" subtitle="Monitoramento de particulas e exposicao" icon="nuclear">
        <TelemetryChart title="Radiacao" values={state.telemetry.map((item) => item.radiation)} min={0} max={0.6} stroke={colors.primary} />
      </SectionCard>

      <SectionCard title="Saude ambiental" subtitle="Indicadores de suporte de vida simulado" icon="leaf">
        <View style={styles.progressGroup}>
          <ProgressBar label="Oxigenio" value={latest.oxygen} suffix="%" dangerBelow={state.thresholds.oxygenMin} />
          <ProgressBar label="Carga de CPU" value={latest.cpuLoad} dangerAbove={88} />
        </View>
      </SectionCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm
  },
  progressGroup: {
    gap: spacing.md
  }
});
