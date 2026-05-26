import React from 'react';
import { StyleSheet, View } from 'react-native';
import { MetricCard } from '@/components/MetricCard';
import { ProgressBar } from '@/components/ProgressBar';
import { Screen } from '@/components/Screen';
import { SectionCard } from '@/components/SectionCard';
import { TelemetryChart } from '@/components/TelemetryChart';
import { colors, spacing } from '@/constants/theme';
import { useMission } from '@/context/MissionContext';

export default function CommunicationScreen() {
  const { state, latest } = useMission();
  const linkQuality = Math.max(0, Math.min(100, (latest.signal * 0.7) + ((100 - latest.latency / 9) * 0.3)));

  return (
    <Screen>
      <SectionCard title="Dashboard de Comunicacao" subtitle="Telemetria, latencia, sinal e estabilidade orbital" icon="radio">
        <View style={styles.grid}>
          <MetricCard label="Sinal" value={`${latest.signal.toFixed(0)}%`} helper={`Min: ${state.thresholds.signalMin}%`} icon="radio" tone={latest.signal <= state.thresholds.signalMin ? 'red' : 'cyan'} />
          <MetricCard label="Latencia" value={`${latest.latency.toFixed(0)}ms`} helper={`Max: ${state.thresholds.latencyMax}ms`} icon="swap-horizontal" tone={latest.latency >= state.thresholds.latencyMax ? 'red' : 'primary'} />
          <MetricCard label="Link" value={`${linkQuality.toFixed(0)}%`} helper="Qualidade composta" icon="wifi" tone={linkQuality < 55 ? 'red' : 'green'} />
          <MetricCard label="Orbita" value={`${latest.orbitalStability.toFixed(0)}%`} helper={`Min: ${state.thresholds.stabilityMin}%`} icon="planet" tone={latest.orbitalStability <= state.thresholds.stabilityMin ? 'red' : 'yellow'} />
        </View>
      </SectionCard>

      <SectionCard title="Qualidade de sinal" subtitle="Variacao do link de telemetria" icon="radio">
        <TelemetryChart title="Sinal" values={state.telemetry.map((item) => item.signal)} min={0} max={100} suffix="%" stroke={colors.cyan} />
      </SectionCard>

      <SectionCard title="Latencia de resposta" subtitle="Tempo simulado de ida e volta dos pacotes" icon="timer">
        <TelemetryChart title="Latencia" values={state.telemetry.map((item) => item.latency)} min={0} max={900} suffix="ms" stroke={colors.primary} />
      </SectionCard>

      <SectionCard title="Estabilidade orbital" subtitle="Apoio preditivo para tomada de decisao" icon="planet">
        <View style={styles.progressGroup}>
          <ProgressBar label="Estabilidade" value={latest.orbitalStability} dangerBelow={state.thresholds.stabilityMin} />
          <ProgressBar label="Qualidade do link" value={linkQuality} dangerBelow={55} />
          <ProgressBar label="Sinal recebido" value={latest.signal} dangerBelow={state.thresholds.signalMin} />
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
