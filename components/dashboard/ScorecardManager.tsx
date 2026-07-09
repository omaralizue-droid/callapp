'use client'

import { useState } from 'react'
import {
  Plus,
  Trash2,
  Copy,
  Archive,
  Edit2,
  Users,
  AlertCircle,
  X,
} from 'lucide-react'
import {
  createScorecardAction,
  editScorecardAction,
  duplicateScorecardAction,
  archiveScorecardAction,
  assignScorecardToTeamAction,
} from '@/actions/scorecards'

interface Team {
  id: string
  name: string
  qaScorecardId: string | null
}

interface Scorecard {
  id: string
  name: string
  description: string | null
  version: number
  isArchived: boolean
  complianceItems: any // Json array of strings
  softSkillItems: any // Json array of strings
  parentId: string | null
  createdAt: Date | string
  updatedAt: Date | string
}

interface ScorecardManagerProps {
  scorecards: Scorecard[]
  teams: Team[]
}

export default function ScorecardManager({ scorecards: initialScorecards, teams: initialTeams }: ScorecardManagerProps) {
  const [scorecards, setScorecards] = useState<Scorecard[]>(initialScorecards)
  const [teams, setTeams] = useState<Team[]>(initialTeams)
  
  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingScorecard, setEditingScorecard] = useState<Scorecard | null>(null)
  
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [complianceItems, setComplianceItems] = useState<string[]>([])
  const [newComplianceItem, setNewComplianceItem] = useState('')
  const [softSkillItems, setSoftSkillItems] = useState<string[]>([])
  const [newSoftSkillItem, setNewSoftSkillItem] = useState('')

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Team assignment states
  const [assigningTeam, setAssigningTeam] = useState<Team | null>(null)

  const showMsg = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type })
    setTimeout(() => setMessage(null), 4000)
  }

  const openCreateForm = () => {
    setEditingScorecard(null)
    setName('')
    setDescription('')
    setComplianceItems([
      'Branded greeting used within first 5 seconds',
      'Recording disclosure stated explicitly',
      'Verify caller account identity and security tokens',
      'Offer standard recap and cancellation timelines',
    ])
    setSoftSkillItems([
      'Active Listening & Tone',
      'Professionalism & Empathy',
      'Resolution Speed',
    ])
    setIsFormOpen(true)
  }

  const openEditForm = (sc: Scorecard) => {
    setEditingScorecard(sc)
    setName(sc.name)
    setDescription(sc.description || '')
    setComplianceItems(sc.complianceItems as string[] || [])
    setSoftSkillItems(sc.softSkillItems as string[] || [])
    setIsFormOpen(true)
  }

  const handleAddCompliance = () => {
    if (!newComplianceItem.trim()) return
    setComplianceItems([...complianceItems, newComplianceItem.trim()])
    setNewComplianceItem('')
  }

  const handleAddSoftSkill = () => {
    if (!newSoftSkillItem.trim()) return
    setSoftSkillItems([...softSkillItems, newSoftSkillItem.trim()])
    setNewSoftSkillItem('')
  }

  const handleRemoveCompliance = (idx: number) => {
    setComplianceItems(complianceItems.filter((_, i) => i !== idx))
  }

  const handleRemoveSoftSkill = (idx: number) => {
    setSoftSkillItems(softSkillItems.filter((_, i) => i !== idx))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return showMsg('Name is required', 'error')
    
    setIsSubmitting(true)
    try {
      const input = {
        name: name.trim(),
        description: description.trim() || undefined,
        complianceItems,
        softSkillItems,
      }

      let res
      if (editingScorecard) {
        res = await editScorecardAction(editingScorecard.id, input)
      } else {
        res = await createScorecardAction(input)
      }

      if (res.error) {
        showMsg(res.error, 'error')
      } else {
        showMsg(
          editingScorecard 
            ? 'Scorecard updated and new version registered successfully' 
            : 'Custom scorecard created successfully',
          'success'
        )
        // Refresh local lists
        if (editingScorecard) {
          const updatedSc = res.scorecard as Scorecard
          setScorecards(scorecards.map(s => s.id === editingScorecard.id ? { ...s, isArchived: true } : s).concat(updatedSc))
        } else {
          setScorecards([...scorecards, res.scorecard as Scorecard])
        }
        setIsFormOpen(false)
      }
    } catch {
      showMsg('Transaction failed', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDuplicate = async (id: string) => {
    try {
      const res = await duplicateScorecardAction(id)
      if (res.error) {
        showMsg(res.error, 'error')
      } else {
        showMsg('Scorecard duplicated successfully', 'success')
        setScorecards([...scorecards, res.scorecard as Scorecard])
      }
    } catch {
      showMsg('Failed to duplicate', 'error')
    }
  }

  const handleArchive = async (id: string) => {
    if (!confirm('Are you sure you want to archive this scorecard? It will no longer be assignable to new teams.')) return
    try {
      const res = await archiveScorecardAction(id)
      if (res.error) {
        showMsg(res.error, 'error')
      } else {
        showMsg('Scorecard archived successfully', 'success')
        setScorecards(scorecards.map(s => s.id === id ? { ...s, isArchived: true } : s))
      }
    } catch {
      showMsg('Failed to archive', 'error')
    }
  }

  const handleAssignTeam = async (scorecardId: string | null) => {
    if (!assigningTeam) return
    try {
      const res = await assignScorecardToTeamAction(scorecardId, assigningTeam.id)
      if (res.error) {
        showMsg(res.error, 'error')
      } else {
        showMsg('Scorecard assigned to team successfully', 'success')
        setTeams(teams.map(t => t.id === assigningTeam.id ? { ...t, qaScorecardId: scorecardId } : t))
        setAssigningTeam(null)
      }
    } catch {
      showMsg('Failed to assign scorecard', 'error')
    }
  }

  const activeScorecards = scorecards.filter(s => !s.isArchived)
  const archivedScorecards = scorecards.filter(s => s.isArchived)

  return (
    <div className="space-y-6">
      
      {/* Toast Messages */}
      {message && (
        <div className={`fixed bottom-5 right-5 z-50 p-4 rounded-xl flex items-center gap-3 border shadow-2xl animate-fade-in ${
          message.type === 'success' 
            ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-300' 
            : 'bg-rose-950/90 border-rose-500/30 text-rose-300'
        }`}>
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="text-xs font-semibold">{message.text}</span>
        </div>
      )}

      {/* Title & Add Button */}
      <div className="flex justify-between items-center bg-slate-900/40 p-4 rounded-2xl border border-white/5">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Custom scorecard templates</h3>
          <p className="text-[10px] text-slate-400 mt-1">Design customizable evaluations & compliance rubrics for agent audits.</p>
        </div>
        <button
          onClick={openCreateForm}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          Create Scorecard
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Templates List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest pl-1">Active Templates ({activeScorecards.length})</h4>
            
            {activeScorecards.length === 0 ? (
              <div className="p-8 text-center bg-slate-950/40 border border-white/5 rounded-2xl text-slate-500 text-xs">
                No custom scorecard templates configured. Create one to customize audits.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeScorecards.map(sc => {
                  const assignedTeams = teams.filter(t => t.qaScorecardId === sc.id)
                  
                  return (
                    <div
                      key={sc.id}
                      className="p-5 rounded-2xl flex flex-col justify-between space-y-4 transition-all hover:bg-slate-900/40"
                      style={{
                        background: 'rgba(13,21,53,0.5)',
                        border: '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-start gap-2">
                          <span className="font-bold text-white text-xs block truncate max-w-[160px]">{sc.name}</span>
                          <span className="bg-indigo-500/10 text-indigo-400 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-indigo-500/20">
                            v{sc.version}
                          </span>
                        </div>
                        {sc.description && <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">{sc.description}</p>}
                        
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          <span className="bg-slate-800 text-slate-300 text-[9px] font-semibold px-2 py-0.5 rounded">
                            {(sc.complianceItems as string[] || []).length} Compliance Items
                          </span>
                          <span className="bg-slate-800 text-slate-300 text-[9px] font-semibold px-2 py-0.5 rounded">
                            {(sc.softSkillItems as string[] || []).length} Soft Skills
                          </span>
                        </div>
                      </div>

                      {/* Teams assigned */}
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-bold uppercase tracking-wider block text-slate-500">Assigned Teams</span>
                        {assignedTeams.length === 0 ? (
                          <span className="text-[10px] text-slate-500 italic block">None (General default fallback)</span>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {assignedTeams.map(t => (
                              <span key={t.id} className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[9px] font-medium px-2 py-0.5 rounded">
                                {t.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t border-white/5">
                        <span className="text-[8px] text-slate-500 font-mono">
                          Updated: {new Date(sc.updatedAt).toLocaleDateString()}
                        </span>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditForm(sc)}
                            title="Edit / New Version"
                            className="p-1.5 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDuplicate(sc.id)}
                            title="Duplicate"
                            className="p-1.5 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleArchive(sc.id)}
                            title="Archive"
                            className="p-1.5 hover:bg-white/5 rounded-lg text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                          >
                            <Archive className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Archived list */}
          {archivedScorecards.length > 0 && (
            <div className="space-y-2 pt-2">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Archived Templates</h4>
              <div className="bg-slate-950/30 rounded-2xl border border-white/5 overflow-hidden text-xs">
                <table className="w-full text-left">
                  <tbody>
                    {archivedScorecards.map(sc => (
                      <tr key={sc.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.01]">
                        <td className="px-4 py-3 font-semibold text-slate-400">{sc.name} <span className="text-[9px] text-slate-500 font-normal">v{sc.version}</span></td>
                        <td className="px-4 py-3 text-[10px] text-slate-500">{new Date(sc.createdAt).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-right text-slate-500">Archived</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Team Assignments Sidebar */}
        <div className="space-y-4">
          <div
            className="p-5 rounded-2xl space-y-4"
            style={{
              background: 'rgba(13,21,53,0.5)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Team Rubrics Assignment</h4>
            </div>
            <p className="text-[10px] leading-relaxed text-slate-400">
              Assign scorecards directly to agent teams. When calls are analyzed, the queue processor applies the scorecard assigned to the agent's team.
            </p>
            
            <div className="space-y-2 pt-1 text-xs">
              {teams.length === 0 ? (
                <div className="text-slate-500 italic text-[10px]">No teams found in your organization.</div>
              ) : (
                teams.map(team => {
                  const activeSc = activeScorecards.find(s => s.id === team.qaScorecardId)
                  
                  return (
                    <div key={team.id} className="flex justify-between items-center py-2.5 border-b border-white/5 last:border-0">
                      <div>
                        <span className="font-semibold text-slate-200 block text-xs">{team.name}</span>
                        <span className="text-[9px] text-slate-500 block truncate max-w-[140px]">
                          Active: {activeSc ? activeSc.name : 'General default'}
                        </span>
                      </div>
                      
                      <button
                        onClick={() => setAssigningTeam(team)}
                        className="bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white px-2.5 py-1 rounded-xl text-[9px] font-bold border border-white/10 transition-all cursor-pointer"
                      >
                        Assign
                      </button>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create / Edit Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-slate-950 border border-white/10 rounded-2xl w-full max-w-lg p-6 max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl relative text-xs">
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                {editingScorecard ? `Edit Scorecard (creates v${editingScorecard.version + 1})` : 'New QA Scorecard Template'}
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Custom compliance checkmarks are graded by the AI queue processor.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block">Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Inbound Support Audit"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white outline-none select-text focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block">Description (Optional)</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Details about scorecard scope or target team requirements..."
                  rows={2}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white outline-none select-text focus:border-indigo-500 transition-colors"
                />
              </div>

              {/* Compliance Items Builder */}
              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block">Compliance Rubric Checkpoints</label>
                <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                  {complianceItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-white/5 border border-white/5 rounded-xl px-3 py-1.5 gap-2">
                      <span className="text-[10px] text-slate-300 leading-normal">{item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCompliance(idx)}
                        className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newComplianceItem}
                    onChange={e => setNewComplianceItem(e.target.value)}
                    placeholder="Add a compliance checkpoint rule..."
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white outline-none select-text focus:border-indigo-500 text-[10px] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={handleAddCompliance}
                    className="bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 px-3.5 rounded-xl flex items-center justify-center cursor-pointer transition-all shrink-0"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Soft Skill Items Builder */}
              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block">Soft Skill Metrics</label>
                <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1">
                  {softSkillItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-white/5 border border-white/5 rounded-xl px-3 py-1.5 gap-2">
                      <span className="text-[10px] text-slate-300 leading-normal">{item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSoftSkill(idx)}
                        className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSoftSkillItem}
                    onChange={e => setNewSoftSkillItem(e.target.value)}
                    placeholder="Add soft skill name..."
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white outline-none select-text focus:border-indigo-500 text-[10px] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={handleAddSoftSkill}
                    className="bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 px-3.5 rounded-xl flex items-center justify-center cursor-pointer transition-all shrink-0"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="bg-white/5 hover:bg-white/10 text-slate-300 px-4 py-2 rounded-xl font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl font-bold transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Saving...' : 'Save Template'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Team Modal */}
      {assigningTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-slate-950 border border-white/10 rounded-2xl w-full max-w-sm p-6 space-y-4 shadow-2xl relative text-xs">
            <button
              onClick={() => setAssigningTeam(null)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Assign Scorecard</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Assign template for team: <strong className="text-indigo-400">{assigningTeam.name}</strong></p>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block">Select Template</label>
                <select
                  defaultValue={assigningTeam.qaScorecardId || ''}
                  onChange={e => {
                    const val = e.target.value === '' ? null : e.target.value
                    handleAssignTeam(val)
                  }}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white outline-none"
                >
                  <option value="">General default fallback (System standard)</option>
                  {activeScorecards.map(sc => (
                    <option key={sc.id} value={sc.id}>{sc.name} (v{sc.version})</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
