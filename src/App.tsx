import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, BarChart3, Target, Download, Maximize } from "lucide-react";
import { TimerProvider, useTimer } from "./context/TimerContext";
import TimerList from "./components/TimerList";
import Analytics from "./components/Analytics";
import Goals from "./components/Goals";
import DataManager from "./components/DataManager";
import FocusMode from "./components/FocusMode";
import { NavItem } from "./types";
import logo from "./assets/logo.svg";

function AppContent() {
  const { state, dispatch } = useTimer();
  const [view, setView] = useState("timers");

  const activeTimers = state.timers.filter((t) => t.isRunning).length;

  const navItems: NavItem[] = [
    { id: "timers", label: "Timers", icon: Clock },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "goals", label: "Goals", icon: Target },
    { id: "data", label: "Data", icon: Download },
  ];

  return (
    <div className=" bg-black text-white">
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="border-b border-gray-900 bg-gray-950 "
      >
        <div className="container md:max-w-[90%] md:mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="">
                <img src={logo} className="h-8 sm:h-10" alt="" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold">TimeSnap</h1>
                <p className="text-xs sm:text-sm text-gray-400 hidden sm:block">
                  Track hours. Bill clients. Get paid.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <AnimatePresence>
                {activeTimers > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="text-xs sm:text-sm"
                  >
                    <span className="text-gray-400">Active:</span>{" "}
                    <span className="text-green-400 font-medium">
                      {activeTimers} timer{activeTimers > 1 ? "s" : ""}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  dispatch({ type: "SET_FOCUS_MODE", enabled: true })
                }
                className="btn btn-gray text-sm"
              >
                <Maximize size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span className="">Focus</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-[90%] mx-auto px-4 sm:px-6 py-4">
        <nav className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mt-4 mb-8">
          {navItems.map(({ id, label, icon: Icon }) => (
            <motion.button
              key={id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setView(id)}
              className={`btn text-sm ${view === id ? "btn-blue" : "btn-gray"}`}
            >
              <Icon size={16} />
              <span className="hidden sm:inline">{label}</span>
            </motion.button>
          ))}
        </nav>

        <AnimatePresence mode="wait">
          {view === "timers" && (
            <motion.div
              key="timers"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <TimerList />
            </motion.div>
          )}
          {view === "analytics" && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Analytics />
            </motion.div>
          )}
          {view === "goals" && (
            <motion.div
              key="goals"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Goals />
            </motion.div>
          )}
          {view === "data" && (
            <motion.div
              key="data"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <DataManager />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-4 bg-gray-950 rounded-lg border border-gray-900 hidden md:block"
        >
          <h3 className="font-medium mb-2">Keyboard Shortcuts</h3>
          <div className="text-sm text-gray-400 space-y-1">
            <p>
              <span className="text-blue-400">Space</span> - Start/Pause all
              timers
            </p>
            <p>
              <span className="text-blue-400">Ctrl+F</span> - Enter focus mode
            </p>
            <p>
              <span className="text-blue-400">Escape</span> - Exit focus mode
            </p>
          </div>
        </motion.div>
      </div>

      <FocusMode />
    </div>
  );
}

function App() {
  return (
    <TimerProvider>
      <AppContent />
    </TimerProvider>
  );
}

export default App;
