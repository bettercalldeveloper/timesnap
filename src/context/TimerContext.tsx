import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Timer, TimerState, TimerAction, TimerContextType } from "../types";

const TimerContext = createContext<TimerContextType | undefined>(undefined);

const initialState: TimerState = {
  timers: [],
  goals: { daily: 8 * 60 * 60 * 1000, weekly: 40 * 60 * 60 * 1000 },
  focusMode: false,
  hourlyRate: 50,
};

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const timerReducer = (state: TimerState, action: TimerAction): TimerState => {
  switch (action.type) {
    case "START_TIMER":
      return {
        ...state,
        timers: state.timers.map((t) =>
          t.id === action.id
            ? { ...t, isRunning: true, startTime: Date.now() }
            : t
        ),
      };

    case "PAUSE_TIMER":
      return {
        ...state,
        timers: state.timers.map((t) =>
          t.id === action.id && t.isRunning
            ? {
                ...t,
                isRunning: false,
                totalTime: t.totalTime + (Date.now() - t.startTime!),
              }
            : t
        ),
      };

    case "STOP_TIMER":
      return {
        ...state,
        timers: state.timers.map((t) =>
          t.id === action.id
            ? {
                ...t,
                isRunning: false,
                totalTime: t.isRunning
                  ? t.totalTime + (Date.now() - t.startTime!)
                  : t.totalTime,
                startTime: null,
                completedAt: new Date().toISOString(),
              }
            : t
        ),
      };

    case "ADD_TIMER":
      return {
        ...state,
        timers: [
          ...state.timers,
          {
            id: Date.now(),
            name: action.name,
            project: action.project,
            isRunning: false,
            totalTime: 0,
            startTime: null,
            color: COLORS[state.timers.length % COLORS.length],
            createdAt: new Date().toISOString(),
            completedAt: null,
          },
        ],
      };

    case "DELETE_TIMER":
      return {
        ...state,
        timers: state.timers.filter((t) => t.id !== action.id),
      };

    case "UPDATE_GOALS":
      return {
        ...state,
        goals: { ...state.goals, ...action.goals },
      };

    case "UPDATE_HOURLY_RATE":
      return {
        ...state,
        hourlyRate: action.rate,
      };

    case "EDIT_TIMER_TIME":
      return {
        ...state,
        timers: state.timers.map((t) =>
          t.id === action.id ? { ...t, totalTime: action.newTime } : t
        ),
      };

    case "SET_FOCUS_MODE":
      return {
        ...state,
        focusMode: action.enabled,
      };

    case "RESTART_TIMER":
      return {
        ...state,
        timers: state.timers.map((t) =>
          t.id === action.id
            ? {
                ...t,
                totalTime: 0,
                completedAt: null,
                isRunning: true,
                startTime: Date.now(),
              }
            : t
        ),
      };

    case "CLEAR_COMPLETED":
      return {
        ...state,
        timers: state.timers.filter((t) => !t.completedAt),
      };

    case "LOAD_DATA":
      return action.data;

    default:
      return state;
  }
};

interface TimerProviderProps {
  children: ReactNode;
}

export function TimerProvider({ children }: TimerProviderProps) {
  const [state, dispatch] = useReducer(timerReducer, initialState, () => {
    const saved = localStorage.getItem("timesnap-data");
    return saved ? JSON.parse(saved) : initialState;
  });

  useEffect(() => {
    localStorage.setItem("timesnap-data", JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === "INPUT") return;

      if (e.key === " ") {
        e.preventDefault();
        const runningTimers = state.timers.filter((t) => t.isRunning);
        if (runningTimers.length > 0) {
          runningTimers.forEach((timer) => {
            dispatch({ type: "PAUSE_TIMER", id: timer.id });
          });
        } else {
          const firstActive = state.timers.find((t) => !t.completedAt);
          if (firstActive) {
            dispatch({ type: "START_TIMER", id: firstActive.id });
          }
        }
      } else if (e.key === "Escape") {
        dispatch({ type: "SET_FOCUS_MODE", enabled: false });
      } else if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        e.preventDefault();
        dispatch({ type: "SET_FOCUS_MODE", enabled: true });
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [state.timers]);

  return (
    <TimerContext.Provider value={{ state, dispatch }}>
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error("useTimer must be used within a TimerProvider");
  }
  return context;
}

export function useTimerDisplay(timer: Timer | null) {
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (!timer) return;

    const interval = setInterval(() => {
      setCurrentTime(
        timer.isRunning && timer.startTime
          ? timer.totalTime + (Date.now() - timer.startTime)
          : timer.totalTime
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  return currentTime;
}
