import React, { useMemo } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Svg, { Circle, Line, Path, Text as SvgText } from 'react-native-svg';
import { colors } from '@/constants/theme';

type Props = {
  title: string;
  values: number[];
  min?: number;
  max?: number;
  suffix?: string;
  stroke?: string;
};

function buildPath(values: number[], width: number, height: number, min: number, max: number): string {
  if (values.length === 0) return '';
  const range = Math.max(max - min, 1);
  const step = width / Math.max(values.length - 1, 1);
  return values.map((value, index) => {
    const x = index * step;
    const normalized = (value - min) / range;
    const y = height - Math.min(Math.max(normalized, 0), 1) * height;
    return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(' ');
}

export function TelemetryChart({ title, values, min, max, suffix = '', stroke = colors.cyan }: Props) {
  const dimensions = useWindowDimensions();
  const chartWidth = Math.max(280, dimensions.width - 64);
  const chartHeight = 132;
  const actualMin = min ?? Math.min(...values);
  const actualMax = max ?? Math.max(...values);
  const latest = values[values.length - 1] ?? 0;

  const path = useMemo(() => buildPath(values, chartWidth, chartHeight, actualMin, actualMax), [values, chartWidth, chartHeight, actualMin, actualMax]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        <Text style={styles.title}>{title}</Text>
        <Text style={[styles.latest, { color: stroke }]}>{latest.toFixed(latest % 1 === 0 ? 0 : 1)}{suffix}</Text>
      </View>
      <Svg width={chartWidth} height={chartHeight + 24}>
        <Line x1="0" y1="10" x2={chartWidth} y2="10" stroke={colors.border} strokeWidth="1" />
        <Line x1="0" y1={chartHeight / 2} x2={chartWidth} y2={chartHeight / 2} stroke={colors.border} strokeWidth="1" strokeDasharray="6 6" />
        <Line x1="0" y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke={colors.border} strokeWidth="1" />
        <Path d={path} stroke={stroke} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <Circle cx={chartWidth} cy={chartHeight - ((latest - actualMin) / Math.max(actualMax - actualMin, 1)) * chartHeight} r="5" fill={stroke} />
        <SvgText x="0" y={chartHeight + 20} fill={colors.textDim} fontSize="10">t-24</SvgText>
        <SvgText x={chartWidth - 36} y={chartHeight + 20} fill={colors.textDim} fontSize="10">agora</SvgText>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 10
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800'
  },
  latest: {
    fontSize: 16,
    fontWeight: '900'
  }
});
