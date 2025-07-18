import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Square, X, Edit2, Check } from "lucide-react";
import { useTimer, useTimerDisplay } from "../context/TimerContext";
import { formatTime } from "../utils/helpers";
import { TimerCardProps } from "../types";

function TimerCard({ timer, isCompleted = false }: TimerCardProps) {
  const { dispatch } = useTimer();
  const currentTime = useTimerDisplay(timer);
  const [isEditing, setIsEditing] = useState(false);
  const [editHours, setEditHours] = useState(0);
  const [editMinutes, setEditMinutes] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleEdit = () => {
    const hours = Math.floor(currentTime / 3600000);
    const minutes = Math.floor((currentTime % 3600000) / 60000);
    setEditHours(hours);
    setEditMinutes(minutes);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    const newTime = editHours * 3600000 + editMinutes * 60000;
    dispatch({ type: "EDIT_TIMER_TIME", id: timer.id, newTime });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={(_, info) => {
        setIsDragging(false);
        if (Math.abs(info.offset.x) > 100) {
          dispatch({ type: "DELETE_TIMER", id: timer.id });
        }
      }}
      whileHover={{ scale: isDragging ? 1 : 1.02 }}
      whileTap={{ scale: 0.98 }}
      animate={{
        x: isDragging ? 0 : 0,
        opacity: isDragging ? 0.8 : 1,
      }}
      className={`card cursor-move ${
        timer.isRunning ? "border-blue-500 shadow-lg" : ""
      } ${isCompleted ? "border-green-900 bg-gray-950/50" : ""}`}
    >
      <div className="flex justify-between mb-3">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{
              scale: timer.isRunning ? [1, 1.2, 1] : 1,
            }}
            transition={{
              duration: 2,
              repeat: timer.isRunning ? Infinity : 0,
            }}
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: timer.color }}
          />
          <div>
            <h3 className="font-medium">{timer.name}</h3>
            <p className="text-sm text-gray-400">{timer.project}</p>
            {isCompleted && timer.completedAt && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-green-400 mt-1"
              >
                Completed {new Date(timer.completedAt).toLocaleTimeString()}
              </motion.p>
            )}
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => dispatch({ type: "DELETE_TIMER", id: timer.id })}
          className="text-gray-500 hover:text-red-400 transition-colors"
        >
          <X size={16} />
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            key="editing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mb-4"
          >
            <div className="flex gap-2 justify-center items-center">
              <input
                type="number"
                value={editHours}
                onChange={(e) =>
                  setEditHours(Math.max(0, parseInt(e.target.value) || 0))
                }
                className="w-16 px-2 py-1 bg-black border border-gray-800 rounded text-center"
                min="0"
              />
              <span className="text-gray-400">h</span>
              <input
                type="number"
                value={editMinutes}
                onChange={(e) =>
                  setEditMinutes(
                    Math.max(0, Math.min(59, parseInt(e.target.value) || 0))
                  )
                }
                className="w-16 px-2 py-1 bg-black border border-gray-800 rounded text-center"
                min="0"
                max="59"
              />
              <span className="text-gray-400">m</span>
            </div>
            <div className="flex justify-center gap-2 mt-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleSaveEdit}
                className="btn btn-green btn-sm"
              >
                <Check size={14} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCancelEdit}
                className="btn btn-gray btn-sm"
              >
                <X size={14} />
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="display"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mb-4"
          >
            <motion.div
              animate={{
                scale: timer.isRunning ? [1, 1.02, 1] : 1,
              }}
              transition={{
                duration: 1,
                repeat: timer.isRunning ? Infinity : 0,
              }}
              className={`text-3xl font-mono font-bold text-center ${
                timer.isRunning ? "text-blue-400" : ""
              }`}
            >
              {formatTime(currentTime)}
            </motion.div>
            {!timer.isRunning && !isCompleted && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={handleEdit}
                className="text-xs text-gray-500 hover:text-gray-300 mx-auto block mt-1"
              >
                <Edit2 size={12} className="inline mr-1" />
                Edit time
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-center gap-2">
        {isCompleted ? null : (
          <>
            {!timer.isRunning ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => dispatch({ type: "START_TIMER", id: timer.id })}
                className="btn btn-blue"
              >
                <Play size={16} />
                Start
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => dispatch({ type: "PAUSE_TIMER", id: timer.id })}
                className="btn btn-yellow"
              >
                <Pause size={16} />
                Pause
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => dispatch({ type: "STOP_TIMER", id: timer.id })}
              className="btn btn-red"
            >
              <Square size={16} />
              Stop
            </motion.button>
          </>
        )}
      </div>
    </motion.div>
  );
}

export default TimerCard;
