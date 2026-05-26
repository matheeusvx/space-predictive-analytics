import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AlertCard } from '@/components/AlertCard';
import { Screen } from '@/components/Screen';
import { SectionCard } from '@/components/SectionCard';
import { colors, radius, spacing } from '@/constants/theme';
import { useMission } from '@/context/MissionContext';

export default function AlertsScreen() {
  const { activeAlerts, dismissAlert, clearAlerts } = useMission();
  const criticalCount = activeAlerts.filter((alert) => alert.severity === 'critical').length;
  const warningCount = activeAlerts.filter((alert) => alert.severity === 'warning').length;

  return (
    <Screen>
      <SectionCard title="Central de Alertas" subtitle="Eventos gerados automaticamente pela leitura dos dados simulados" icon="notifications">
        <View style={styles.counterRow}>
          <View style={styles.counterCard}>
            <Text style={styles.counterValue}>{activeAlerts.length}</Text>
            <Text style={styles.counterLabel}>Ativos</Text>
          </View>
          <View style={styles.counterCard}>
            <Text style={[styles.counterValue, { color: colors.red }]}>{criticalCount}</Text>
            <Text style={styles.counterLabel}>Criticos</Text>
          </View>
          <View style={styles.counterCard}>
            <Text style={[styles.counterValue, { color: colors.yellow }]}>{warningCount}</Text>
            <Text style={styles.counterLabel}>Atencao</Text>
          </View>
        </View>
        <Pressable onPress={clearAlerts} style={styles.clearButton}>
          <Ionicons name="checkmark-done" size={18} color={colors.background} />
          <Text style={styles.clearButtonText}>Limpar historico de alertas</Text>
        </Pressable>
      </SectionCard>

      <SectionCard title="Lista de ocorrencias" subtitle="Dispense um alerta quando a ocorrencia for tratada" icon="list">
        {activeAlerts.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="shield-checkmark" size={48} color={colors.green} />
            <Text style={styles.emptyTitle}>Operacao nominal</Text>
            <Text style={styles.emptyText}>Nenhum alerta ativo no momento. A simulacao continua monitorando os limiares configurados.</Text>
          </View>
        ) : (
          <View style={styles.list}>
            {activeAlerts.map((alert) => <AlertCard key={alert.id} alert={alert} onDismiss={() => dismissAlert(alert.id)} />)}
          </View>
        )}
      </SectionCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  counterRow: {
    flexDirection: 'row',
    gap: spacing.sm
  },
  counterCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center'
  },
  counterValue: {
    color: colors.cyan,
    fontSize: 28,
    fontWeight: '900'
  },
  counterLabel: {
    color: colors.textMuted,
    marginTop: 2,
    fontWeight: '800'
  },
  clearButton: {
    marginTop: spacing.md,
    backgroundColor: colors.cyan,
    borderRadius: 16,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8
  },
  clearButtonText: {
    color: colors.background,
    fontWeight: '900'
  },
  list: {
    gap: spacing.sm
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    gap: spacing.sm
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900'
  },
  emptyText: {
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20
  }
});
