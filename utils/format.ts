export function formatTime(value: string): string {
  return new Date(value).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

export function formatDateTime(value: string): string {
  return new Date(value).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function percent(value: number): string {
  return `${Math.round(value)}%`;
}

export function riskLabel(score: number): string {
  if (score >= 76) return 'Critico';
  if (score >= 45) return 'Atencao';
  return 'Nominal';
}
