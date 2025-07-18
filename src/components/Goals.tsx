import { useState } from 'react'
import { motion } from 'framer-motion'
import { Target, DollarSign } from 'lucide-react'
import { useTimer } from '../context/TimerContext'

function Goals() {
  const { state, dispatch } = useTimer()
  const [daily, setDaily] = useState(state.goals.daily / 3600000)
  const [weekly, setWeekly] = useState(state.goals.weekly / 3600000)
  const [rate, setRate] = useState(state.hourlyRate)

  const handleSave = () => {
    dispatch({
      type: 'UPDATE_GOALS',
      goals: {
        daily: daily * 3600000,
        weekly: weekly * 3600000
      }
    })
    dispatch({
      type: 'UPDATE_HOURLY_RATE',
      rate: rate
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <motion.h2 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="text-xl font-bold mb-4"
      >
        Goals & Settings
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-blue-400" />
          <h3 className="font-medium">Time Goals</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Daily Goal (hours)
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="number"
              value={daily}
              onChange={(e) => setDaily(Number(e.target.value))}
              className="input w-full max-w-xs"
              min="1"
              max="24"
              step="0.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Weekly Goal (hours)
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="number"
              value={weekly}
              onChange={(e) => setWeekly(Number(e.target.value))}
              className="input w-full max-w-xs"
              min="1"
              max="168"
              step="1"
            />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-5 h-5 text-yellow-400" />
          <h3 className="font-medium">Billing Settings</h3>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Hourly Rate ($)
          </label>
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="number"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="input w-full max-w-xs"
            min="0"
            step="5"
            placeholder="50"
          />
          <p className="text-xs text-gray-400 mt-1">
            Used to calculate earnings in analytics
          </p>
        </div>
      </motion.div>

      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSave} 
        className="btn btn-blue w-full sm:w-auto"
      >
        Save Settings
      </motion.button>
    </motion.div>
  )
}

export default Goals