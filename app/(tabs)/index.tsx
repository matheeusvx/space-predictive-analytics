import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AlertCard } from '@/components/AlertCard';
import { HeaderHero } from '@/components/HeaderHero';
import { MetricCard } from '@/components/MetricCard';
import { ProgressBar } from '@/components/ProgressBar';
import { Screen } from '@/components/Screen';
import { SectionCard } from '@/components/SectionCard';
import { TelemetryChart } from '@/components/TelemetryChart';
import { colors, spacing } from '@/constants/theme';
import { useMission } from '@/context/MissionContext';
import { calculateMissionRisk } from '@/utils/alerts';
import { formatTime, riskLabel } from '@/utils/format';

export default function HomeScreen() {
  const { state, latest, activeAlerts, toggleSimulation } = useMission();
  const riskScore = calculateMissionRisk(latest, state.thresholds);

  return (
    <Screen>
      <HeaderHero
        profile={state.profile}
        simulationEnabled={state.simulationEnabled}
        riskScore={riskScore}
        activeAlertsCount={activeAlerts.length}
        onToggleSimulation={toggleSimulation}
/>
      <View style={styles.grid}>
        <MetricCard label="Energia" value={`${latest.energy.toFixed(0)}%`} helper="Banco de baterias" icon="battery-half" tone={latest.energy <= state.thresholds.energyMin ? 'red' : 'green'} />
        <MetricCard label="Sinal" value={`${latest.signal.toFixed(0)}%`} helper="Telemetria ativa" icon="radio" tone={latest.signal <= state.thresholds.signalMin ? 'red' : 'cyan'} />
        <MetricCard label="Temperatura" value={`${latest.temperature.toFixed(1)}C`} helper="Modulo central" icon="thermometer" tone={latest.temperature >= state.thresholds.temperatureMax ? 'red' : 'yellow'} />
        <MetricCard label="Risco" value={`${riskScore}%`} helper={riskLabel(riskScore)} icon="shield-checkmark" tone={riskScore >= 76 ? 'red' : riskScore >= 45 ? 'yellow' : 'primary'} />
      </View>

      <SectionCard title="Resumo operacional" subtitle={`Ultima leitura simulada as ${formatTime(latest.timestamp)}`} icon="analytics">
        <View style={styles.progressGroup}>
          <ProgressBar label="Estabilidade orbital" value={latest.orbitalStability} dangerBelow={state.thresholds.stabilityMin} />
          <ProgressBar label="Oxigenio ambiental" value={latest.oxygen} suffix="%" dangerBelow={state.thresholds.oxygenMin} />
          <ProgressBar label="Carga de processamento" value={latest.cpuLoad} dangerAbove={88} />
        </View>
      </SectionCard>

      <SectionCard title="Tendencia de energia" subtitle="Historico em tempo real simulado" icon="trending-up">
        <TelemetryChart title="Bateria da missao" values={state.telemetry.map((item) => item.energy)} min={0} max={100} suffix="%" stroke={colors.green} />
      </SectionCard>

      <SectionCard title="Alertas recentes" subtitle="Gerados automaticamente por limiares criticos" icon="notifications">
        {activeAlerts.length === 0 ? (
          <Text style={styles.empty}>Nenhum alerta ativo. Sistemas nominais.</Text>
        ) : (
          <View style={styles.alertsList}>
            {activeAlerts.slice(0, 2).map((alert) => <AlertCard key={alert.id} alert={alert} />)}
          </View>
        )}
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
  },
  alertsList: {
    gap: spacing.sm
  },
  empty: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20
  }
});
