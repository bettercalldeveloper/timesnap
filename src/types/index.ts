export interface Timer {
  id: number;
  name: string;
  project: string;
  isRunning: boolean;
  totalTime: number;
  startTime: number | null;
  color: string;
  createdAt: string;
  completedAt: string | null;
}

export interface TimerState {
  timers: Timer[];
  goals: Goals;
  focusMode: boolean;
  hourlyRate: number;
}

export interface Goals {
  daily: number;
  weekly: number;
}

export type TimerAction =
  | { type: "START_TIMER"; id: number }
  | { type: "PAUSE_TIMER"; id: number }
  | { type: "STOP_TIMER"; id: number }
  | { type: "ADD_TIMER"; name: string; project: string }
  | { type: "DELETE_TIMER"; id: number }
  | { type: "UPDATE_GOALS"; goals: Partial<Goals> }
  | { type: "UPDATE_HOURLY_RATE"; rate: number }
  | { type: "EDIT_TIMER_TIME"; id: number; newTime: number }
  | { type: "SET_FOCUS_MODE"; enabled: boolean }
  | { type: "RESTART_TIMER"; id: number }
  | { type: "CLEAR_COMPLETED" }
  | { type: "LOAD_DATA"; data: TimerState };

export interface TimerContextType {
  state: TimerState;
  dispatch: React.Dispatch<TimerAction>;
}

export interface TimerCardProps {
  timer: Timer;
  isCompleted?: boolean;
}

export interface NavigationProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

export interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
}
