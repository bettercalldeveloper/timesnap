import { motion } from 'framer-motion'
import { Upload, FileJson, FileSpreadsheet } from 'lucide-react'
import { useTimer } from '../context/TimerContext'
import { exportJSON, exportCSV, formatTimeShort } from '../utils/helpers'

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

function DataManager() {
  const { state, dispatch } = useTimer()

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string)
          dispatch({ type: 'LOAD_DATA', data })
        } catch {
          alert('Invalid file format')
        }
      }
      reader.readAsText(file)
    }
  }

  const totalTime = state.timers.reduce((acc, timer) => acc + timer.totalTime, 0)
  const activeTimers = state.timers.filter(t => !t.completedAt)
  const completedTimers = state.timers.filter(t => t.completedAt)
  const runningTimers = state.timers.filter(t => t.isRunning)

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.h2 variants={item} className="text-xl font-bold mb-4">
        Data Management
      </motion.h2>

      <motion.div variants={item} className="card">
        <h3 className="font-medium mb-4">Export Data</h3>
        <div className="flex gap-2">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => exportJSON(state)} 
            className="btn btn-blue"
          >
            <FileJson size={16} />
            Export JSON
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => exportCSV(state.timers, state.hourlyRate)} 
            className="btn btn-green"
          >
            <FileSpreadsheet size={16} />
            Export CSV
          </motion.button>
        </div>
      </motion.div>

      <motion.div variants={item} className="card">
        <h3 className="font-medium mb-4">Import Data</h3>
        <motion.label 
          whileHover={{ scale: 1.02 }}
          className="btn btn-gray cursor-pointer inline-flex"
        >
          <Upload size={16} />
          Import Backup
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </motion.label>
      </motion.div>

      <motion.div variants={item} className="card">
        <h3 className="font-medium mb-4">Statistics</h3>
        <div className="space-y-2 text-sm">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex justify-between"
          >
            <span className="text-gray-400">Total Timers:</span>
            <span>{state.timers.length}</span>
          </motion.div>
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="flex justify-between"
          >
            <span className="text-gray-400">Active Timers:</span>
            <span>{activeTimers.length}</span>
          </motion.div>
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex justify-between"
          >
            <span className="text-gray-400">Running Now:</span>
            <span className="text-green-400">{runningTimers.length}</span>
          </motion.div>
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="flex justify-between"
          >
            <span className="text-gray-400">Completed:</span>
            <span>{completedTimers.length}</span>
          </motion.div>
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-between border-t border-gray-800 pt-2 mt-2"
          >
            <span className="text-gray-400">Total Time Tracked:</span>
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.6 }}
            >
              {formatTimeShort(totalTime)}
            </motion.span>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default DataManager