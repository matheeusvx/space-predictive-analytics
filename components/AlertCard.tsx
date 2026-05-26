import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '@/constants/theme';
import { MissionAlert } from '@/types/mission';
import { formatDateTime } from '@/utils/format';

type Props = {
  alert: MissionAlert;
  onDismiss?: () => void;
};

const severityMap = {
  critical: { color: colors.red, background: colors.redSoft, icon: 'warning' as const, label: 'Critico' },
  warning: { color: colors.yellow, background: colors.yellowSoft, icon: 'alert-circle' as const, label: 'Atencao' },
  info: { color: colors.cyan, background: colors.cyanSoft, icon: 'information-circle' as const, label: 'Info' }
};

export function AlertCard({ alert, onDismiss }: Props) {
  const severity = severityMap[alert.severity];

  return (
    <View style={[styles.card, { borderColor: severity.color }]}> 
      <View style={styles.header}>
        <View style={[styles.iconBox, { backgroundColor: severity.background }]}> 
          <Ionicons name={severity.icon} size={20} color={severity.color} />
        </View>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>{alert.title}</Text>
          <Text style={[styles.badge, { color: severity.color }]}>{severity.label}</Text>
        </View>
        {onDismiss ? (
          <Pressable onPress={onDismiss} style={styles.dismiss}>
            <Ionicons name="close" size={18} color={colors.textMuted} />
          </Pressable>
        ) : null}
      </View>
      <Text style={styles.description}>{alert.description}</Text>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Valor: {alert.value}</Text>
        <Text style={styles.footerText}>Limiar: {alert.threshold}</Text>
        <Text style={styles.footerText}>{formatDateTime(alert.createdAt)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center'
  },
  titleWrap: {
    flex: 1
  },
  title: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '900'
  },
  badge: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.6
  },
  dismiss: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center'
  },
  description: {
    color: colors.textMuted,
    lineHeight: 19
  },
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  footerText: {
    color: colors.textDim,
    fontSize: 12,
    fontWeight: '700'
  }
});
