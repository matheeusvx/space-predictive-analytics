import React, { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Screen } from '@/components/Screen';
import { SectionCard } from '@/components/SectionCard';
import { colors, radius, spacing } from '@/constants/theme';
import { useMission } from '@/context/MissionContext';
import { MissionProfile, Thresholds } from '@/types/mission';

type FormValues = Record<keyof Thresholds, string>;
type FormErrors = Partial<Record<keyof Thresholds | 'missionName' | 'operator', string>>;

function toFormValues(thresholds: Thresholds): FormValues {
  return {
    temperatureMax: String(thresholds.temperatureMax),
    radiationMax: String(thresholds.radiationMax),
    energyMin: String(thresholds.energyMin),
    signalMin: String(thresholds.signalMin),
    latencyMax: String(thresholds.latencyMax),
    stabilityMin: String(thresholds.stabilityMin),
    oxygenMin: String(thresholds.oxygenMin)
  };
}

function parseNumber(value: string): number {
  return Number(value.replace(',', '.'));
}

export default function SettingsScreen() {
  const { state, updateProfile, updateThresholds } = useMission();
  const [profile, setProfile] = useState<MissionProfile>(state.profile);
  const [values, setValues] = useState<FormValues>(toFormValues(state.thresholds));
  const [errors, setErrors] = useState<FormErrors>({});

  const fields = useMemo(() => ([
    { key: 'temperatureMax' as const, label: 'Temperatura maxima (C)', helper: 'Recomendado: 70 a 82' },
    { key: 'radiationMax' as const, label: 'Radiacao maxima', helper: 'Recomendado: 0.35 a 0.48' },
    { key: 'energyMin' as const, label: 'Energia minima (%)', helper: 'Recomendado: 25 a 35' },
    { key: 'signalMin' as const, label: 'Sinal minimo (%)', helper: 'Recomendado: 55 a 70' },
    { key: 'latencyMax' as const, label: 'Latencia maxima (ms)', helper: 'Recomendado: 650 a 800' },
    { key: 'stabilityMin' as const, label: 'Estabilidade minima (%)', helper: 'Recomendado: 82 a 90' },
    { key: 'oxygenMin' as const, label: 'Oxigenio minimo (%)', helper: 'Recomendado: 18.8 a 19.5' }
  ]), []);

  function validate(): { valid: boolean; thresholds?: Thresholds } {
    const nextErrors: FormErrors = {};

    if (profile.missionName.trim().length < 3) {
      nextErrors.missionName = 'Informe um nome de missao com pelo menos 3 caracteres.';
    }

    if (profile.operator.trim().length < 3) {
      nextErrors.operator = 'Informe o operador responsavel pela missao.';
    }

    const parsed = Object.fromEntries(
      Object.entries(values).map(([key, value]) => [key, parseNumber(value)])
    ) as Thresholds;

    fields.forEach((field) => {
      const parsedValue = parsed[field.key];
      if (Number.isNaN(parsedValue)) {
        nextErrors[field.key] = 'Use apenas numeros.';
      }
    });

    if (!Number.isNaN(parsed.temperatureMax) && (parsed.temperatureMax < 45 || parsed.temperatureMax > 95)) {
      nextErrors.temperatureMax = 'Informe um valor entre 45 e 95.';
    }
    if (!Number.isNaN(parsed.radiationMax) && (parsed.radiationMax < 0.1 || parsed.radiationMax > 0.8)) {
      nextErrors.radiationMax = 'Informe um valor entre 0.10 e 0.80.';
    }
    if (!Number.isNaN(parsed.energyMin) && (parsed.energyMin < 10 || parsed.energyMin > 60)) {
      nextErrors.energyMin = 'Informe um valor entre 10 e 60.';
    }
    if (!Number.isNaN(parsed.signalMin) && (parsed.signalMin < 30 || parsed.signalMin > 95)) {
      nextErrors.signalMin = 'Informe um valor entre 30 e 95.';
    }
    if (!Number.isNaN(parsed.latencyMax) && (parsed.latencyMax < 200 || parsed.latencyMax > 1200)) {
      nextErrors.latencyMax = 'Informe um valor entre 200 e 1200.';
    }
    if (!Number.isNaN(parsed.stabilityMin) && (parsed.stabilityMin < 60 || parsed.stabilityMin > 99)) {
      nextErrors.stabilityMin = 'Informe um valor entre 60 e 99.';
    }
    if (!Number.isNaN(parsed.oxygenMin) && (parsed.oxygenMin < 16 || parsed.oxygenMin > 21)) {
      nextErrors.oxygenMin = 'Informe um valor entre 16 e 21.';
    }

    setErrors(nextErrors);
    return { valid: Object.keys(nextErrors).length === 0, thresholds: parsed };
  }

  function handleSubmit() {
    const result = validate();
    if (!result.valid || !result.thresholds) return;

    updateProfile({
      ...profile,
      missionName: profile.missionName.trim(),
      operator: profile.operator.trim(),
      orbit: profile.orbit.trim() || 'LEO - Low Earth Orbit',
      vehicle: profile.vehicle.trim() || 'Orbital Analytics Lab',
      updatedAt: new Date().toISOString()
    });
    updateThresholds(result.thresholds);
    Alert.alert('Configuracoes salvas', 'Os limiares foram persistidos com AsyncStorage.');
    router.back();
  }

  return (
    <Screen>
      <SectionCard title="Cadastro da Missao" subtitle="Inputs controlados com validacao e feedback visual" icon="create">
        <View style={styles.formGroup}>
          <Input
            label="Nome da missao"
            value={profile.missionName}
            onChangeText={(text) => setProfile((current) => ({ ...current, missionName: text }))}
            error={errors.missionName}
          />
          <Input
            label="Operador"
            value={profile.operator}
            onChangeText={(text) => setProfile((current) => ({ ...current, operator: text }))}
            error={errors.operator}
          />
          <Input
            label="Orbita"
            value={profile.orbit}
            onChangeText={(text) => setProfile((current) => ({ ...current, orbit: text }))}
          />
          <Input
            label="Veiculo / Modulo"
            value={profile.vehicle}
            onChangeText={(text) => setProfile((current) => ({ ...current, vehicle: text }))}
          />
        </View>
      </SectionCard>

      <SectionCard title="Limiar de Alertas" subtitle="Ajuste os parametros que geram avisos automaticos" icon="warning">
        <View style={styles.formGroup}>
          {fields.map((field) => (
            <Input
              key={field.key}
              label={field.label}
              helper={field.helper}
              keyboardType="decimal-pad"
              value={values[field.key]}
              onChangeText={(text) => setValues((current) => ({ ...current, [field.key]: text }))}
              error={errors[field.key]}
            />
          ))}
        </View>
      </SectionCard>

      <Pressable style={styles.saveButton} onPress={handleSubmit}>
        <Ionicons name="save" size={20} color={colors.background} />
        <Text style={styles.saveButtonText}>Salvar configuracoes</Text>
      </Pressable>
    </Screen>
  );
}

type InputProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
  helper?: string;
  keyboardType?: 'default' | 'decimal-pad';
};

function Input({ label, value, onChangeText, error, helper, keyboardType = 'default' }: InputProps) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        placeholderTextColor={colors.textDim}
        style={[styles.input, error ? styles.inputError : undefined]}
      />
      {helper && !error ? <Text style={styles.helper}>{helper}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  formGroup: {
    gap: spacing.md
  },
  inputGroup: {
    gap: 7
  },
  label: {
    color: colors.text,
    fontWeight: '800',
    fontSize: 13
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 13,
    fontSize: 15,
    fontWeight: '700'
  },
  inputError: {
    borderColor: colors.red
  },
  helper: {
    color: colors.textDim,
    fontSize: 12
  },
  error: {
    color: colors.red,
    fontWeight: '700',
    fontSize: 12
  },
  saveButton: {
    backgroundColor: colors.cyan,
    borderRadius: radius.md,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10
  },
  saveButtonText: {
    color: colors.background,
    fontWeight: '900',
    fontSize: 15
  }
});
