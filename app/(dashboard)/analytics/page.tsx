import { assertRole } from '@/lib/rbac'
import AnalyticsDashboardCharts from '@/components/dashboard/AnalyticsDashboardCharts'
import { AreaChart, Calendar } from 'lucide-react'

export default async function AnalyticsPage() {
  // Protect route - only Admin, Manager, and QA can access the analytics panel
  await assertRole(['ADMIN', 'MANAGER', 'QA'])

  return (
    <div className="space-y-6 text-xs">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <AreaChart className="w-5 h-5 text-cyan-400" />
            Performance Analytics
          </h2>
          <p className="text-[10px] text-slate-500 mt-1">Review team averages, volume metrics, and sentiment trends</p>
        </div>
        
        {/* Date Filter */}
        <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 border border-white/5 rounded-lg text-slate-400 font-mono">
          <Calendar className="w-3.5 h-3.5" />
          <span>Last 15 Days</span>
        </div>
      </div>

      {/* Render Recharts charts */}
      <AnalyticsDashboardCharts />

    </div>
  )
}
