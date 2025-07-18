import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Minimize, ChevronLeft, ChevronRight } from 'lucide-react'
import { useTimer, useTimerDisplay } from '../context/TimerContext'
import { formatTime } from '../utils/helpers'

function FocusMode() {
  const { state, dispatch } = useTimer()
  const runningTimers = state.timers.filter(t => t.isRunning)
  const [currentIndex, setCurrentIndex] = useState(0)
  
  const currentTimer = runningTimers[currentIndex] || null
  const currentTime = useTimerDisplay(currentTimer)

  useEffect(() => {
    if (currentIndex >= runningTimers.length && runningTimers.length > 0) {
      setCurrentIndex(0)
    }
  }, [runningTimers.length, currentIndex])

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % runningTimers.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + runningTimers.length) % runningTimers.length)
  }

  return (
    <AnimatePresence>
      {state.focusMode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black z-50 flex items-center justify-center"
        >
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="text-center"
          >
            <motion.div
              key={currentTime}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="text-4xl sm:text-5xl md:text-6xl font-mono font-bold text-white mb-4"
            >
              {formatTime(currentTime)}
            </motion.div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTimer?.id || 'no-timer'}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-lg sm:text-xl text-gray-400 mb-2"
              >
                {currentTimer ? currentTimer.name : 'No active timer'}
              </motion.div>
            </AnimatePresence>
            
            {currentTimer && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-gray-500 mb-8"
              >
                {currentTimer.project}
              </motion.div>
            )}
            
            <AnimatePresence>
              {runningTimers.length > 1 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="flex items-center justify-center gap-4 mb-8"
                >
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handlePrev}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <ChevronLeft size={24} />
                  </motion.button>
                  <span className="text-gray-400 text-sm sm:text-base">
                    {currentIndex + 1} of {runningTimers.length}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleNext}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <ChevronRight size={24} />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => dispatch({ type: 'SET_FOCUS_MODE', enabled: false })}
              className="btn btn-gray mx-auto text-sm sm:text-base"
            >
              <Minimize size={18} className="sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Exit Focus Mode</span>
              <span className="sm:hidden">Exit</span>
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default FocusMode;