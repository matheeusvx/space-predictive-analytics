import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { colors, radius, shadow, spacing } from '@/constants/theme';
import { MissionProfile } from '@/types/mission';

type Props = {
  profile: MissionProfile;
  simulationEnabled: boolean;
  riskScore: number;
  activeAlertsCount: number;
  onToggleSimulation: () => void;
};

export function HeaderHero({
  profile,
  simulationEnabled,
  riskScore,
  activeAlertsCount,
  onToggleSimulation
}: Props) {
  const statusLabel = riskScore >= 76 ? 'Crítico' : riskScore >= 45 ? 'Atenção' : 'Nominal';
  const statusIcon = riskScore >= 76 ? 'warning' : riskScore >= 45 ? 'alert-circle' : 'shield-checkmark';

  return (
    <View style={styles.hero}>
      <View style={styles.topRow}>
        <View style={styles.badge}>
          <Ionicons name="rocket" color={colors.cyan} size={16} />
          <Text style={styles.badgeText}>Space Predictive Analytics</Text>
        </View>
        <Pressable onPress={onToggleSimulation} style={styles.pauseButton}>
          <Ionicons name={simulationEnabled ? 'pause' : 'play'} size={18} color={colors.text} />
        </Pressable>
      </View>
      <Text style={styles.title}>{profile.missionName}</Text>
      <Text style={styles.subtitle}>{profile.vehicle} | {profile.orbit}</Text>
      <View style={styles.actions}>
        <Link href="/settings" asChild>
          <Pressable style={styles.actionPrimary}>
            <Ionicons name="options" size={18} color={colors.background} />
            <Text style={styles.actionPrimaryText}>Configurar limiares</Text>
          </Pressable>
        </Link>
        <Link href="/(tabs)/alerts" asChild>
          <Pressable style={styles.actionSecondary}>
            <Ionicons name="notifications" size={18} color={colors.cyan} />
            <Text style={styles.actionSecondaryText}>Alertas</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadow
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.cyanSoft,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  badgeText: {
    color: colors.cyan,
    fontWeight: '900',
    fontSize: 12
  },
  pauseButton: {
    width: 42,
    height: 42,
    borderRadius: 18,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    color: colors.text,
    fontSize: 31,
    lineHeight: 36,
    fontWeight: '900'
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap'
  },
  actionPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.cyan,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12
  },
  actionPrimaryText: {
    color: colors.background,
    fontWeight: '900'
  },
  actionSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.cyanSoft,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12
  },
  actionSecondaryText: {
    color: colors.cyan,
    fontWeight: '900'
  }
});
