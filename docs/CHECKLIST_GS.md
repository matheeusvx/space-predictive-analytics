# Checklist de Aderencia aos Criterios da GS

## 1. Navegacao com Expo Router - 10 pts

Atendido em:
- app/_layout.tsx
- app/(tabs)/_layout.tsx
- app/(tabs)/index.tsx
- app/(tabs)/sensors.tsx
- app/(tabs)/energy.tsx
- app/(tabs)/communication.tsx
- app/(tabs)/alerts.tsx
- app/settings.tsx

## 2. Dashboards de Dados Espaciais - 20 pts

Atendido com 4 dashboards:
- Home: visao geral da missao.
- Sensores: temperatura, radiacao, oxigenio e CPU.
- Energia: bateria, entrada solar, autonomia e consumo.
- Comunicacao: sinal, latencia, link e estabilidade orbital.

## 3. Gerenciamento de Estado - 15 pts

Atendido em:
- context/MissionContext.tsx
- useReducer para estado global.
- useEffect para simulacao e persistencia.
- useState no formulario app/settings.tsx.
- Context API consumida em multiplas telas.

## 4. Persistencia com AsyncStorage - 10 pts

Atendido em:
- context/MissionContext.tsx
- Persistencia de limiares, perfil da missao e historico de alertas.

## 5. Formularios e Inputs - 10 pts

Atendido em:
- app/settings.tsx
- Inputs controlados, validacao numerica, mensagens de erro e submissao.

## 6. Sistema de Alertas - 10 pts

Atendido em:
- utils/alerts.ts
- app/(tabs)/alerts.tsx
- Alertas por temperatura, radiacao, energia, sinal, latencia, estabilidade e oxigenio.

## 7. Qualidade Visual e UX - 10 pts

Atendido por:
- Tema dark mode espacial.
- Cards, graficos, progresso, icones e alertas visuais.
- Layout com componentes reutilizaveis.

## 8. Organizacao do Codigo - 10 pts

Atendido por:
- Pastas app, components, context, data, utils, types, constants e docs.
- TypeScript em todo o projeto.
- Componentes reutilizaveis.

## 9. Video de Demonstracao - 5 pts

Pendente de gravacao pelo grupo.
Roteiro incluido em docs/VIDEO_ROTEIRO.md.
