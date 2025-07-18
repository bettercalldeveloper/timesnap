import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Clock, CheckCircle } from 'lucide-react'
import { useTimer } from '../context/TimerContext'
import TimerCard from './TimerCard'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
}

function TimerList() {
  const { state, dispatch } = useTimer()
  const [name, setName] = useState('')
  const [project, setProject] = useState('')

  const activeTimers = state.timers.filter(t => !t.completedAt)
  const completedTimers = state.timers.filter(t => t.completedAt)

  const handleAdd = () => {
    if (name.trim()) {
      dispatch({ type: 'ADD_TIMER', name, project: project || 'General' })
      setName('')
      setProject('')
    }
  }

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <h2 className="text-lg font-medium mb-4">Add New Timer</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Timer name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
            className="input flex-1"
          />
          <input
            type="text"
            placeholder="Project (optional)"
            value={project}
            onChange={(e) => setProject(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
            className="input flex-1"
          />
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAdd} 
            className="btn btn-blue w-full sm:w-auto"
          >
            <Plus size={16} />
            Add
          </motion.button>
        </div>
      </motion.div>

      {activeTimers.length === 0 && completedTimers.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 text-gray-500"
        >
          <Clock size={48} className="mx-auto mb-4 opacity-50" />
          <p>No timers yet. Add your first timer to get started!</p>
        </motion.div>
      ) : (
        <>
          <AnimatePresence>
            {activeTimers.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <Clock size={20} className="text-blue-400" />
                  Active Timers
                </h3>
                <motion.div 
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {activeTimers.map(timer => (
                    <motion.div key={timer.id} variants={item} layout>
                      <TimerCard timer={timer} />
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {completedTimers.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <CheckCircle size={20} className="text-green-400" />
                    Completed Tasks
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => dispatch({ type: 'CLEAR_COMPLETED' })}
                    className="text-sm text-gray-400 hover:text-red-400 transition-colors"
                  >
                    Clear All
                  </motion.button>
                </div>
                <motion.div 
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {completedTimers.map(timer => (
                    <motion.div key={timer.id} variants={item} layout>
                      <TimerCard timer={timer} isCompleted />
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  )
}

export default TimerList