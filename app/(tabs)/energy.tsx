import React from 'react';
import { StyleSheet, View } from 'react-native';
import { MetricCard } from '@/components/MetricCard';
import { ProgressBar } from '@/components/ProgressBar';
import { Screen } from '@/components/Screen';
import { SectionCard } from '@/components/SectionCard';
import { TelemetryChart } from '@/components/TelemetryChart';
import { colors, spacing } from '@/constants/theme';
import { useMission } from '@/context/MissionContext';

export default function EnergyScreen() {
  const { state, latest } = useMission();
  const estimatedAutonomy = Math.max(1, Math.round(latest.energy / Math.max(1, 100 - latest.solarInput + latest.cpuLoad / 2) * 18));

  return (
    <Screen>
      <SectionCard title="Dashboard de Energia" subtitle="Baterias, paineis solares e consumo operacional" icon="battery-charging">
        <View style={styles.grid}>
          <MetricCard label="Bateria" value={`${latest.energy.toFixed(0)}%`} helper={`Min: ${state.thresholds.energyMin}%`} icon="battery-half" tone={latest.energy <= state.thresholds.energyMin ? 'red' : 'green'} />
          <MetricCard label="Solar" value={`${latest.solarInput.toFixed(0)}%`} helper="Entrada dos paineis" icon="sunny" tone="yellow" />
          <MetricCard label="Autonomia" value={`${estimatedAutonomy}h`} helper="Estimativa preditiva" icon="time" tone="cyan" />
          <MetricCard label="Consumo" value={`${latest.cpuLoad.toFixed(0)}%`} helper="Carga media" icon="flash" tone={latest.cpuLoad >= 88 ? 'red' : 'primary'} />
        </View>
      </SectionCard>

      <SectionCard title="Curva de bateria" subtitle="Amostras simuladas em tempo real" icon="trending-down">
        <TelemetryChart title="Nivel de energia" values={state.telemetry.map((item) => item.energy)} min={0} max={100} suffix="%" stroke={colors.green} />
      </SectionCard>

      <SectionCard title="Painel solar" subtitle="Entrada de energia por janela orbital" icon="sunny">
        <TelemetryChart title="Entrada solar" values={state.telemetry.map((item) => item.solarInput)} min={0} max={100} suffix="%" stroke={colors.yellow} />
      </SectionCard>

      <SectionCard title="Balanco energetico" subtitle="Pontos criticos de decisao" icon="calculator">
        <View style={styles.progressGroup}>
          <ProgressBar label="Bateria disponivel" value={latest.energy} dangerBelow={state.thresholds.energyMin} />
          <ProgressBar label="Captacao solar" value={latest.solarInput} />
          <ProgressBar label="Carga dos sistemas" value={latest.cpuLoad} dangerAbove={88} />
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
