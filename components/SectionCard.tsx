import React, { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow, spacing } from '@/constants/theme';

type Props = PropsWithChildren<{
  title: string;
  subtitle?: string;
  icon?: keyof typeof Ionicons.glyphMap;
}>;

export function SectionCard({ title, subtitle, icon, children }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        {icon ? (
          <View style={styles.iconBox}>
            <Ionicons name={icon} size={20} color={colors.cyan} />
          </View>
        ) : null}
        <View style={styles.headerText}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      </View>
      <View style={styles.body}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
    ...shadow
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: colors.cyanSoft,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerText: {
    flex: 1
  },
  title: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800'
  },
  subtitle: {
    color: colors.textMuted,
    marginTop: 3,
    fontSize: 12.5,
    lineHeight: 17
  },
  body: {
    marginTop: spacing.md
  }
});
