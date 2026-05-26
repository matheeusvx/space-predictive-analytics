import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '@/constants/theme';

type MetricTone = 'green' | 'cyan' | 'yellow' | 'red' | 'primary';

type Props = {
  label: string;
  value: string;
  helper?: string;
  icon: keyof typeof Ionicons.glyphMap;
  tone?: MetricTone;
};

const toneMap: Record<MetricTone, { color: string; background: string }> = {
  green: { color: colors.green, background: colors.greenSoft },
  cyan: { color: colors.cyan, background: colors.cyanSoft },
  yellow: { color: colors.yellow, background: colors.yellowSoft },
  red: { color: colors.red, background: colors.redSoft },
  primary: { color: colors.primary, background: colors.primarySoft }
};

export function MetricCard({ label, value, helper, icon, tone = 'cyan' }: Props) {
  const token = toneMap[tone];
  return (
    <View style={styles.card}>
      <View style={[styles.iconBox, { backgroundColor: token.background }]}>
        <Ionicons name={icon} size={18} color={token.color} />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
      {helper ? <Text style={styles.helper}>{helper}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: 7
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  value: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '900'
  },
  label: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8
  },
  helper: {
    color: colors.textDim,
    fontSize: 12,
    lineHeight: 16
  }
});
