import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, PropsWithChildren, useContext, useEffect, useMemo, useReducer } from 'react';
import { DEFAULT_PROFILE, DEFAULT_THRESHOLDS, buildInitialTelemetry, generateNextTelemetry } from '@/data/defaults';
import { detectAlerts } from '@/utils/alerts';
import { MissionAlert, MissionProfile, MissionState, Thresholds } from '@/types/mission';

const STORAGE_KEYS = {
  thresholds: '@space_predictive/thresholds',
  profile: '@space_predictive/profile',
  alerts: '@space_predictive/alerts'
};

type MissionAction =
  | { type: 'LOAD_STATE'; payload: Partial<MissionState> }
  | { type: 'TICK' }
  | { type: 'SET_THRESHOLDS'; payload: Thresholds }
  | { type: 'SET_PROFILE'; payload: MissionProfile }
  | { type: 'DISMISS_ALERT'; payload: string }
  | { type: 'CLEAR_ALERTS' }
  | { type: 'TOGGLE_SIMULATION' };

const initialTelemetry = buildInitialTelemetry();

const initialState: MissionState = {
  telemetry: initialTelemetry,
  alerts: detectAlerts(initialTelemetry[initialTelemetry.length - 1], DEFAULT_THRESHOLDS),
  thresholds: DEFAULT_THRESHOLDS,
  profile: DEFAULT_PROFILE,
  isLoaded: false,
  simulationEnabled: true
};

function missionReducer(state: MissionState, action: MissionAction): MissionState {
  switch (action.type) {
    case 'LOAD_STATE':
      return {
        ...state,
        ...action.payload,
        isLoaded: true
      };
    case 'TICK': {
      const previous = state.telemetry[state.telemetry.length - 1];
      const next = generateNextTelemetry(previous);
      const newAlerts = detectAlerts(next, state.thresholds);
      return {
        ...state,
        telemetry: [...state.telemetry.slice(-23), next],
        alerts: [...newAlerts, ...state.alerts].slice(0, 40)
      };
    }
    case 'SET_THRESHOLDS':
      return {
        ...state,
        thresholds: action.payload,
        alerts: [...detectAlerts(state.telemetry[state.telemetry.length - 1], action.payload), ...state.alerts].slice(0, 40)
      };
    case 'SET_PROFILE':
      return {
        ...state,
        profile: action.payload
      };
    case 'DISMISS_ALERT':
      return {
        ...state,
        alerts: state.alerts.map((alert) => alert.id === action.payload ? { ...alert, dismissed: true } : alert)
      };
    case 'CLEAR_ALERTS':
      return {
        ...state,
        alerts: []
      };
    case 'TOGGLE_SIMULATION':
      return {
        ...state,
        simulationEnabled: !state.simulationEnabled
      };
    default:
      return state;
  }
}

type MissionContextValue = {
  state: MissionState;
  latest: MissionState['telemetry'][number];
  activeAlerts: MissionAlert[];
  updateThresholds: (thresholds: Thresholds) => void;
  updateProfile: (profile: MissionProfile) => void;
  dismissAlert: (id: string) => void;
  clearAlerts: () => void;
  toggleSimulation: () => void;
};

const MissionContext = createContext<MissionContextValue | undefined>(undefined);

export function MissionProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(missionReducer, initialState);

  useEffect(() => {
    async function loadPersistedState() {
      try {
        const [thresholdsValue, profileValue, alertsValue] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.thresholds),
          AsyncStorage.getItem(STORAGE_KEYS.profile),
          AsyncStorage.getItem(STORAGE_KEYS.alerts)
        ]);

        dispatch({
          type: 'LOAD_STATE',
          payload: {
            thresholds: thresholdsValue ? JSON.parse(thresholdsValue) as Thresholds : DEFAULT_THRESHOLDS,
            profile: profileValue ? JSON.parse(profileValue) as MissionProfile : DEFAULT_PROFILE,
            alerts: alertsValue ? JSON.parse(alertsValue) as MissionAlert[] : initialState.alerts
          }
        });
      } catch (error) {
        dispatch({ type: 'LOAD_STATE', payload: {} });
      }
    }

    loadPersistedState();
  }, []);

  useEffect(() => {
    if (!state.isLoaded) return;

    AsyncStorage.multiSet([
      [STORAGE_KEYS.thresholds, JSON.stringify(state.thresholds)],
      [STORAGE_KEYS.profile, JSON.stringify(state.profile)],
      [STORAGE_KEYS.alerts, JSON.stringify(state.alerts.slice(0, 20))]
    ]).catch(() => undefined);
  }, [state.thresholds, state.profile, state.alerts, state.isLoaded]);

  useEffect(() => {
    if (!state.isLoaded || !state.simulationEnabled) return;

    const interval = setInterval(() => {
      dispatch({ type: 'TICK' });
    }, 3000);

    return () => clearInterval(interval);
  }, [state.isLoaded, state.simulationEnabled]);

  const latest = state.telemetry[state.telemetry.length - 1];
  const activeAlerts = useMemo(() => state.alerts.filter((alert) => !alert.dismissed), [state.alerts]);

  const value = useMemo<MissionContextValue>(() => ({
    state,
    latest,
    activeAlerts,
    updateThresholds: (thresholds: Thresholds) => dispatch({ type: 'SET_THRESHOLDS', payload: thresholds }),
    updateProfile: (profile: MissionProfile) => dispatch({ type: 'SET_PROFILE', payload: profile }),
    dismissAlert: (id: string) => dispatch({ type: 'DISMISS_ALERT', payload: id }),
    clearAlerts: () => dispatch({ type: 'CLEAR_ALERTS' }),
    toggleSimulation: () => dispatch({ type: 'TOGGLE_SIMULATION' })
  }), [activeAlerts, latest, state]);

  return (
    <MissionContext.Provider value={value}>
      {children}
    </MissionContext.Provider>
  );
}

export function useMission() {
  const context = useContext(MissionContext);
  if (!context) {
    throw new Error('useMission must be used inside MissionProvider');
  }
  return context;
}
