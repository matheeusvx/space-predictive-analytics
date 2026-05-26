import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '@/constants/theme';

type Props = {
  label: string;
  value: number;
  suffix?: string;
  dangerBelow?: number;
  dangerAbove?: number;
};

export function ProgressBar({ label, value, suffix = '%', dangerBelow, dangerAbove }: Props) {
  const percentValue = Math.max(0, Math.min(100, value));
  const isDanger = dangerBelow !== undefined && value <= dangerBelow || dangerAbove !== undefined && value >= dangerAbove;
  const color = isDanger ? colors.red : value >= 80 ? colors.green : colors.cyan;

  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, { color }]}>{value.toFixed(value % 1 === 0 ? 0 : 1)}{suffix}</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percentValue}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 8
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  label: {
    color: colors.textMuted,
    fontWeight: '700',
    fontSize: 13
  },
  value: {
    fontWeight: '900',
    fontSize: 13
  },
  track: {
    height: 10,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceAlt,
    overflow: 'hidden'
  },
  fill: {
    height: 10,
    borderRadius: radius.sm
  }
});
