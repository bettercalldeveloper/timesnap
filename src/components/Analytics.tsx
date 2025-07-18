import { motion } from 'framer-motion'
import { Clock, Calendar, BarChart3, DollarSign } from 'lucide-react'
import { useTimer } from '../context/TimerContext'
import { getTodayTime, getWeekTime, getProjectBreakdown, formatTimeShort } from '../utils/helpers'

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

function Analytics() {
  const { state } = useTimer()
  const todayTime = getTodayTime(state.timers)
  const weekTime = getWeekTime(state.timers)
  const projectBreakdown = getProjectBreakdown(state.timers)
  
  const todayEarnings = (todayTime / 3600000) * state.hourlyRate
  const weekEarnings = (weekTime / 3600000) * state.hourlyRate

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.h2 variants={item} className="text-xl font-bold mb-4">Analytics</motion.h2>

      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="card"
        >
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-blue-400" />
            <h3 className="font-medium">Today</h3>
          </div>
          <p className="text-2xl font-bold text-blue-400">{formatTimeShort(todayTime)}</p>
          <div className="mt-2 h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((todayTime / state.goals.daily) * 100, 100)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-blue-500"
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {Math.round((todayTime / state.goals.daily) * 100)}% of daily goal
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="card"
        >
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-green-400" />
            <h3 className="font-medium">This Week</h3>
          </div>
          <p className="text-2xl font-bold text-green-400">{formatTimeShort(weekTime)}</p>
          <div className="mt-2 h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((weekTime / state.goals.weekly) * 100, 100)}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
              className="h-full bg-green-500"
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {Math.round((weekTime / state.goals.weekly) * 100)}% of weekly goal
          </p>
        </motion.div>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="card"
        >
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-yellow-400" />
            <h3 className="font-medium">Today's Earnings</h3>
          </div>
          <motion.p 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="text-2xl font-bold text-yellow-400"
          >
            ${todayEarnings.toFixed(2)}
          </motion.p>
          <p className="text-xs text-gray-400 mt-1">
            at ${state.hourlyRate}/hour
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="card"
        >
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-green-400" />
            <h3 className="font-medium">Week's Earnings</h3>
          </div>
          <motion.p 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="text-2xl font-bold text-green-400"
          >
            ${weekEarnings.toFixed(2)}
          </motion.p>
          <p className="text-xs text-gray-400 mt-1">
            at ${state.hourlyRate}/hour
          </p>
        </motion.div>
      </motion.div>

      <motion.div variants={item} className="card">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5" />
          <h3 className="font-medium">Project Breakdown</h3>
        </div>
        <div className="space-y-3">
          {Object.entries(projectBreakdown).length === 0 ? (
            <p className="text-gray-400 text-sm">No time tracked yet</p>
          ) : (
            Object.entries(projectBreakdown).map(([project, time], index) => {
              const projectEarnings = (time / 3600000) * state.hourlyRate
              return (
                <motion.div
                  key={project}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex justify-between items-center"
                >
                  <span className="text-gray-300">{project}</span>
                  <div className="text-right">
                    <span className="font-mono block">{formatTimeShort(time)}</span>
                    <motion.span 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 + index * 0.05 }}
                      className="text-xs text-green-400"
                    >
                      ${projectEarnings.toFixed(2)}
                    </motion.span>
                  </div>
                </motion.div>
              )
            })
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Analytics