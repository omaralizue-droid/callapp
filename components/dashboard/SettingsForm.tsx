'use client'

import { useState } from 'react'
import {
  Save,
  Shield,
  Key,
  Loader2,
  Plus,
  Trash2,
  Users,
  ShieldCheck,
  BarChart3,
  HardDrive,
  Wrench,
  CreditCard,
  PlusCircle,
  Globe,
  Settings2,
} from 'lucide-react'

export default function SettingsForm() {
  const [isSaving, setIsSaving] = useState(false)
  const [activeSubTab, setActiveSubTab] = useState<
    'profile' | 'rubric' | 'crm' | 'users' | 'permissions' | 'diagnostics' | 'analytics' | 'calls' | 'billing'
  >('profile')

  // Existing states
  const [firstName, setFirstName] = useState('Alex')
  const [lastName, setLastName] = useState('Rodriguez')
  const email = 'alex.r@company.com'
  const [orgName, setOrgName] = useState('Apex Global BPO')

  const [complianceItems, setComplianceItems] = useState([
    'Branded greeting used within first 5 seconds',
    'Recording disclosure stated explicitly',
    'Verify caller account identity and security tokens',
    'Refund policy guideline adherence',
  ])
  const [newItem, setNewItem] = useState('')

  const [hubspotKey, setHubspotKey] = useState('pat-na1-xxxx-xxxx-xxxx')
  const [salesforceUrl, setSalesforceUrl] = useState('https://apex-bpo.my.salesforce.com')

  // Enterprise Admin panel states
  // User states
  const [users, setUsers] = useState([
    { id: 'user-1', email: 'alex.r@company.com', firstName: 'Alex', lastName: 'Rodriguez', role: 'ADMIN', team: 'Retention Team' },
    { id: 'user-2', email: 'lisa.m@company.com', firstName: 'Lisa', lastName: 'Miller', role: 'AGENT', team: 'Retention Team' },
    { id: 'user-3', email: 'john.d@company.com', firstName: 'John', lastName: 'Doe', role: 'MANAGER', team: 'General Support' },
    { id: 'user-4', email: 'jane.s@company.com', firstName: 'Jane', lastName: 'Smith', role: 'QA', team: 'Quality Control' },
  ])
  const [newUserEmail, setNewUserEmail] = useState('')
  const [newUserFirstName, setNewUserFirstName] = useState('')
  const [newUserLastName, setNewUserLastName] = useState('')
  const [newUserRole, setNewUserRole] = useState('AGENT')
  const [newUserTeam, setNewUserTeam] = useState('Retention Team')

  // Team states
  const [teams, setTeams] = useState([
    { id: 'team-1', name: 'Retention Team', description: 'Handles subscription cancellations and disputes.', membersCount: 2 },
    { id: 'team-2', name: 'General Support', description: 'Assists with portal errors and invoicing issues.', membersCount: 1 },
    { id: 'team-3', name: 'Quality Control', description: 'Reviews and audits recorded conversations.', membersCount: 1 },
  ])
  const [newTeamName, setNewTeamName] = useState('')
  const [newTeamDesc, setNewTeamDesc] = useState('')

  // Storage and diagnostics states
  const [geminiModel, setGeminiModel] = useState('gemini-2.5-pro')
  const [geminiTemp, setGeminiTemp] = useState(0.2)
  const [webhookUrl, setWebhookUrl] = useState('https://hooks.salesforce.com/services/xxxx/xxxx')
  const apiKey = 'cp_live_pk_xxxxxxxxxxxxxx'
  const [showApiKey, setShowApiKey] = useState(false)

  // Call database states
  const [adminCalls, setAdminCalls] = useState([
    { id: 'call-1', title: 'Subscription Cancel Dispute', filename: 'cancel_dispute_cust_928.wav', duration: '3m 02s', size: '4.5 MB', qaScore: 94 },
    { id: 'call-2', title: 'Payment Processing Failure', filename: 'billing_failure_988.wav', duration: '2m 04s', size: '3.1 MB', qaScore: 82 },
    { id: 'call-3', title: 'Billing Address Change request', filename: 'addr_change_718.wav', duration: '1m 45s', size: '2.4 MB', qaScore: 88 },
  ])

  // Billing states
  const [selectedPlan, setSelectedPlan] = useState('enterprise')
  const billingHistory = [
    { invoice: 'INV-2026-06', date: 'Jun 1, 2026', amount: '$499.00', status: 'PAID' },
    { invoice: 'INV-2026-05', date: 'May 1, 2026', amount: '$499.00', status: 'PAID' },
    { invoice: 'INV-2026-04', date: 'Apr 1, 2026', amount: '$499.00', status: 'PAID' },
  ]

  // Handlers
  const handleAddRubricItem = () => {
    if (newItem.trim()) {
      setComplianceItems([...complianceItems, newItem.trim()])
      setNewItem('')
    }
  }

  const handleRemoveRubricItem = (index: number) => {
    setComplianceItems(complianceItems.filter((_, i) => i !== index))
  }

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault()
    if (newUserEmail && newUserFirstName && newUserLastName) {
      setUsers([
        ...users,
        {
          id: `user-${Date.now()}`,
          email: newUserEmail,
          firstName: newUserFirstName,
          lastName: newUserLastName,
          role: newUserRole,
          team: newUserTeam,
        },
      ])
      setNewUserEmail('')
      setNewUserFirstName('')
      setNewUserLastName('')
      alert('User invited successfully!')
    }
  }

  const handleDeleteUser = (id: string) => {
    if (confirm('Are you sure you want to delete this user profile?')) {
      setUsers(users.filter(u => u.id !== id))
    }
  }

  const handleUpdateUserRole = (id: string, newRole: string) => {
    setUsers(users.map(u => (u.id === id ? { ...u, role: newRole } : u)))
  }

  const handleAddTeam = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTeamName) {
      setTeams([
        ...teams,
        {
          id: `team-${Date.now()}`,
          name: newTeamName,
          description: newTeamDesc || 'No description provided.',
          membersCount: 0,
        },
      ])
      setNewTeamName('')
      setNewTeamDesc('')
      alert('Team created successfully!')
    }
  }

  const handleDeleteTeam = (id: string) => {
    if (confirm('Are you sure you want to delete this team?')) {
      setTeams(teams.filter(t => t.id !== id))
    }
  }

  const handleDeleteCall = (id: string) => {
    if (confirm('Are you sure you want to permanently delete this call record and all its associated QA analysis files?')) {
      setAdminCalls(adminCalls.filter(c => c.id !== id))
      alert('Call record deleted successfully.')
    }
  }

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      alert('Enterprise preferences updated successfully!')
    }, 1500)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 text-xs select-none">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-white tracking-tight">Enterprise Settings</h2>
        <p className="text-[10px] text-slate-500 mt-1">Configure user structures, compliance rubrics, AI models, and billing credentials</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Left Side Tab Selector Navigation */}
        <div className="md:col-span-1 flex flex-col gap-1.5">
          <span className="text-[8px] font-bold uppercase tracking-wider text-slate-500 px-3 pb-1">General</span>
          <button
            onClick={() => setActiveSubTab('profile')}
            type="button"
            className={`w-full text-left px-3.5 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'profile' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            Profile & Org
          </button>
          <button
            onClick={() => setActiveSubTab('rubric')}
            type="button"
            className={`w-full text-left px-3.5 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'rubric' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            QA Eval Rubrics
          </button>
          <button
            onClick={() => setActiveSubTab('crm')}
            type="button"
            className={`w-full text-left px-3.5 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'crm' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            CRM Connection
          </button>

          <span className="text-[8px] font-bold uppercase tracking-wider text-slate-500 px-3 pt-3 pb-1">Enterprise Admin</span>
          <button
            onClick={() => setActiveSubTab('users')}
            type="button"
            className={`w-full text-left px-3.5 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'users' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Users & Teams
          </button>
          <button
            onClick={() => setActiveSubTab('permissions')}
            type="button"
            className={`w-full text-left px-3.5 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'permissions' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Role Permissions
          </button>
          <button
            onClick={() => setActiveSubTab('diagnostics')}
            type="button"
            className={`w-full text-left px-3.5 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'diagnostics' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            Diagnostics & AI
          </button>
          <button
            onClick={() => setActiveSubTab('analytics')}
            type="button"
            className={`w-full text-left px-3.5 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'analytics' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Admin Analytics
          </button>
          <button
            onClick={() => setActiveSubTab('calls')}
            type="button"
            className={`w-full text-left px-3.5 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'calls' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            Manage Call Data
          </button>
          <button
            onClick={() => setActiveSubTab('billing')}
            type="button"
            className={`w-full text-left px-3.5 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'billing' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            Billing & Plans
          </button>
        </div>

        {/* Right Side Content Form Container */}
        <div className="md:col-span-3">
          <form onSubmit={handleSaveSettings} className="glass rounded-xl p-6 border border-white/5 space-y-6">
            
            {/* Tab 1: Profile & Org Settings */}
            {activeSubTab === 'profile' && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Profile Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-400">First Name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-400">Last Name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-400">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-slate-500 outline-none cursor-not-allowed"
                  />
                </div>
                <div className="pt-4 border-t border-white/5 space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Company Workspace</h3>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-400">Organization Name</label>
                    <input
                      type="text"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: QA Rubrics Configuration */}
            {activeSubTab === 'rubric' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-cyan-400" />
                    AI Compliance Directives
                  </h3>
                  <span className="bg-cyan-500/10 text-cyan-400 text-[9px] px-2 py-0.5 rounded border border-cyan-500/20 uppercase font-bold tracking-wider">
                    Prompt Config
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Customize the criteria CallPilot AI utilizes to audit and score compliance. Adding or removing lines here immediately alters scorecard configurations for future call analyses.
                </p>
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {complianceItems.map((item, idx) => (
                    <div key={idx} className="flex gap-2.5 items-center justify-between p-2.5 bg-slate-900 border border-white/5 rounded-lg text-slate-300">
                      <span className="leading-relaxed">{item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveRubricItem(idx)}
                        className="text-slate-500 hover:text-rose-400 transition-colors p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder="E.g., Explicitly confirm caller agreed to terms..."
                    className="flex-1 bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-cyan-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddRubricItem}
                    className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
              </div>
            )}

            {/* Tab 3: CRM Connections */}
            {activeSubTab === 'crm' && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-cyan-400" />
                  CRM Integration Settings
                </h3>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Enter API keys to enable direct sync buttons in Call Detail screens. Call summaries and action tasks will be pushed automatically into caller contact logs.
                </p>
                <div className="space-y-3 pt-2">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-400">HubSpot Private App Token</label>
                    <input
                      type="password"
                      value={hubspotKey}
                      onChange={(e) => setHubspotKey(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-400">Salesforce Instance URL</label>
                    <input
                      type="text"
                      value={salesforceUrl}
                      onChange={(e) => setSalesforceUrl(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Manage Users & Teams */}
            {activeSubTab === 'users' && (
              <div className="space-y-6">
                
                {/* 4.1 Users Management */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-cyan-400" />
                    Manage Users
                  </h3>
                  <div className="glass rounded-lg border border-white/5 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-950/40 text-slate-400 font-bold border-b border-white/5">
                          <th className="px-4 py-2 font-semibold">User</th>
                          <th className="px-4 py-2 font-semibold">Email</th>
                          <th className="px-4 py-2 font-semibold">Team</th>
                          <th className="px-4 py-2 font-semibold">Role</th>
                          <th className="px-4 py-2"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-slate-300">
                        {users.map(u => (
                          <tr key={u.id} className="hover:bg-white/[0.01]">
                            <td className="px-4 py-2.5 font-bold text-white">
                              {u.firstName} {u.lastName}
                            </td>
                            <td className="px-4 py-2.5 font-mono text-slate-400">{u.email}</td>
                            <td className="px-4 py-2.5">{u.team}</td>
                            <td className="px-4 py-2.5">
                              <select
                                value={u.role}
                                onChange={e => handleUpdateUserRole(u.id, e.target.value)}
                                className="bg-slate-900 border border-white/10 text-slate-300 rounded px-2 py-1 outline-none text-[10px]"
                              >
                                <option value="ADMIN">ADMIN</option>
                                <option value="MANAGER">MANAGER</option>
                                <option value="QA">QA</option>
                                <option value="AGENT">AGENT</option>
                              </select>
                            </td>
                            <td className="px-4 py-2.5 text-right">
                              <button
                                type="button"
                                onClick={() => handleDeleteUser(u.id)}
                                className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Invite User Form */}
                  <div className="bg-slate-950/40 border border-white/5 rounded-xl p-4 space-y-3">
                    <span className="font-bold text-slate-400 block">Invite New User</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        value={newUserFirstName}
                        onChange={e => setNewUserFirstName(e.target.value)}
                        placeholder="First Name"
                        className="bg-slate-900 border border-white/10 rounded px-2.5 py-1.5 text-white outline-none focus:border-cyan-500"
                      />
                      <input
                        type="text"
                        value={newUserLastName}
                        onChange={e => setNewUserLastName(e.target.value)}
                        placeholder="Last Name"
                        className="bg-slate-900 border border-white/10 rounded px-2.5 py-1.5 text-white outline-none focus:border-cyan-500"
                      />
                      <input
                        type="email"
                        value={newUserEmail}
                        onChange={e => setNewUserEmail(e.target.value)}
                        placeholder="Email Address"
                        className="bg-slate-900 border border-white/10 rounded px-2.5 py-1.5 text-white outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div className="flex gap-3 items-center">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-500 font-bold uppercase">Role:</span>
                        <select
                          value={newUserRole}
                          onChange={e => setNewUserRole(e.target.value)}
                          className="bg-slate-900 border border-white/10 text-slate-300 rounded px-2.5 py-1.5 outline-none"
                        >
                          <option value="AGENT">AGENT</option>
                          <option value="QA">QA</option>
                          <option value="MANAGER">MANAGER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-500 font-bold uppercase">Assign Team:</span>
                        <select
                          value={newUserTeam}
                          onChange={e => setNewUserTeam(e.target.value)}
                          className="bg-slate-900 border border-white/10 text-slate-300 rounded px-2.5 py-1.5 outline-none"
                        >
                          {teams.map(t => (
                            <option key={t.id} value={t.name}>{t.name}</option>
                          ))}
                        </select>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddUser}
                        className="ml-auto bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        Invite
                      </button>
                    </div>
                  </div>
                </div>

                {/* 4.2 Teams Management */}
                <div className="space-y-4 border-t border-white/5 pt-5">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-cyan-400" />
                    Manage Teams
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {teams.map(t => (
                      <div key={t.id} className="glass p-4 rounded-xl border border-white/5 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-white">{t.name}</span>
                            <button
                              type="button"
                              onClick={() => handleDeleteTeam(t.id)}
                              className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{t.description}</p>
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold border-t border-white/5 pt-2">
                          <span>MEMBERS: {t.membersCount}</span>
                          <span className="text-cyan-400 uppercase">Active</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Create Team Form */}
                  <div className="bg-slate-950/40 border border-white/5 rounded-xl p-4 space-y-3">
                    <span className="font-bold text-slate-400 block">Create New Team</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={newTeamName}
                        onChange={e => setNewTeamName(e.target.value)}
                        placeholder="Team Name (e.g. Inbound Support)"
                        className="bg-slate-900 border border-white/10 rounded px-2.5 py-1.5 text-white outline-none focus:border-cyan-500"
                      />
                      <input
                        type="text"
                        value={newTeamDesc}
                        onChange={e => setNewTeamDesc(e.target.value)}
                        placeholder="Team Description"
                        className="bg-slate-900 border border-white/10 rounded px-2.5 py-1.5 text-white outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleAddTeam}
                        className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Create Team
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* Tab 5: Role Permissions Matrix */}
            {activeSubTab === 'permissions' && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  Role Permissions Matrix
                </h3>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Enterprise Role-Based Access Control (RBAC) rules. Permissions map to database queries and UI components.
                </p>

                <div className="glass rounded-xl border border-white/5 overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-950/40 text-slate-400 font-bold border-b border-white/5 text-[10px]">
                        <th className="px-4 py-3 font-bold uppercase">Permission Feature</th>
                        <th className="px-4 py-3 text-center">ADMIN</th>
                        <th className="px-4 py-3 text-center">MANAGER</th>
                        <th className="px-4 py-3 text-center">QA</th>
                        <th className="px-4 py-3 text-center">AGENT</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                      <tr>
                        <td className="px-4 py-2.5 font-bold text-white">Upload / Process Audio logs</td>
                        <td className="px-4 py-2.5 text-center text-green-400">✓</td>
                        <td className="px-4 py-2.5 text-center text-green-400">✓</td>
                        <td className="px-4 py-2.5 text-center text-slate-600">-</td>
                        <td className="px-4 py-2.5 text-center text-slate-600">-</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-bold text-white">Conduct QA checklists & Scorecards</td>
                        <td className="px-4 py-2.5 text-center text-green-400">✓</td>
                        <td className="px-4 py-2.5 text-center text-green-400">✓</td>
                        <td className="px-4 py-2.5 text-center text-green-400">✓</td>
                        <td className="px-4 py-2.5 text-center text-slate-600">-</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-bold text-white">View team-wide AI Coach dashboard</td>
                        <td className="px-4 py-2.5 text-center text-green-400">✓</td>
                        <td className="px-4 py-2.5 text-center text-green-400">✓</td>
                        <td className="px-4 py-2.5 text-center text-green-400">✓</td>
                        <td className="px-4 py-2.5 text-center text-amber-500">Self Only</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-bold text-white">Modify compliance prompts & rubrics</td>
                        <td className="px-4 py-2.5 text-center text-green-400">✓</td>
                        <td className="px-4 py-2.5 text-center text-green-400">✓</td>
                        <td className="px-4 py-2.5 text-center text-slate-600">-</td>
                        <td className="px-4 py-2.5 text-center text-slate-600">-</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-bold text-white">Invite / Delete users and teams</td>
                        <td className="px-4 py-2.5 text-center text-green-400">✓</td>
                        <td className="px-4 py-2.5 text-center text-slate-600">-</td>
                        <td className="px-4 py-2.5 text-center text-slate-600">-</td>
                        <td className="px-4 py-2.5 text-center text-slate-600">-</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-bold text-white">Export call analysis payloads to CRM</td>
                        <td className="px-4 py-2.5 text-center text-green-400">✓</td>
                        <td className="px-4 py-2.5 text-center text-green-400">✓</td>
                        <td className="px-4 py-2.5 text-center text-green-400">✓</td>
                        <td className="px-4 py-2.5 text-center text-green-400">✓</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 6: System Diagnostics & Gemini Settings */}
            {activeSubTab === 'diagnostics' && (
              <div className="space-y-6">
                
                {/* 6.1 Storage Usage */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <HardDrive className="w-4 h-4 text-cyan-400" />
                    Storage Allocation Usage
                  </h3>
                  <div className="glass p-5 rounded-xl border border-white/5 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-300">Workspace Audio Files Storage</span>
                      <span className="font-mono text-slate-400">24.8 GB / 100.0 GB (24.8%)</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-white/5">
                      <div className="bg-cyan-500 h-full rounded-full" style={{ width: '24.8%' }} />
                    </div>
                    <div className="grid grid-cols-3 gap-4 pt-2 text-[10px] text-slate-500">
                      <div>
                        <span className="block font-bold text-slate-400">Total Audio Logs</span>
                        <span>1,832 recordings</span>
                      </div>
                      <div>
                        <span className="block font-bold text-slate-400">Average File Size</span>
                        <span>13.5 MB</span>
                      </div>
                      <div>
                        <span className="block font-bold text-slate-400">Storage Plan Limit</span>
                        <span>100 GB</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 6.2 API & Webhooks Settings */}
                <div className="space-y-4 border-t border-white/5 pt-5">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Wrench className="w-4 h-4 text-cyan-400" />
                    Webhooks & API Keys
                  </h3>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-400">Global Webhook URL Endpoint</label>
                      <div className="flex gap-2.5">
                        <input
                          type="text"
                          value={webhookUrl}
                          onChange={e => setWebhookUrl(e.target.value)}
                          className="flex-1 bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-cyan-500"
                        />
                      </div>
                      <span className="text-[9px] text-slate-500 mt-1 block">Triggered automatically when a call audit or QA review is finalized.</span>
                    </div>

                    <div className="space-y-1 pt-2">
                      <label className="font-semibold text-slate-400">CallPilot Developer API Key</label>
                      <div className="flex gap-2">
                        <input
                          type={showApiKey ? 'text' : 'password'}
                          value={apiKey}
                          disabled
                          className="flex-1 bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-slate-500 outline-none cursor-not-allowed font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 rounded-lg border border-white/5 cursor-pointer"
                        >
                          {showApiKey ? 'Hide' : 'Show'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 6.3 Gemini Settings */}
                <div className="space-y-4 border-t border-white/5 pt-5">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Settings2 className="w-4 h-4 text-cyan-400" />
                    Gemini AI Model Configurations
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-400">Default Audit LLM Model</label>
                      <select
                        value={geminiModel}
                        onChange={e => setGeminiModel(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 text-slate-300 rounded-lg px-3 py-2.5 outline-none focus:border-cyan-500"
                      >
                        <option value="gemini-2.5-pro">Gemini 2.5 Pro (Recommended)</option>
                        <option value="gemini-2.5-flash">Gemini 2.5 Flash (Fast & Cost-Efficient)</option>
                        <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="font-semibold text-slate-400">LLM Prompt Temperature</label>
                        <span className="font-mono text-cyan-400">{geminiTemp}</span>
                      </div>
                      <div className="pt-2">
                        <input
                          type="range"
                          min="0.0"
                          max="1.0"
                          step="0.1"
                          value={geminiTemp}
                          onChange={e => setGeminiTemp(parseFloat(e.target.value))}
                          className="w-full accent-cyan-500 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* Tab 7: Enterprise Admin Analytics */}
            {activeSubTab === 'analytics' && (
              <div className="space-y-6">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-cyan-400" />
                  Enterprise Usage Analytics
                </h3>

                {/* API Token Cost */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-950/40 p-4 border border-white/5 rounded-xl space-y-1">
                    <span className="text-[9px] uppercase font-bold text-slate-500">Gemini API Cost (MTD)</span>
                    <span className="block text-lg font-bold text-white font-mono">$184.23</span>
                    <span className="text-[8px] text-green-400 font-semibold">12% decrease vs last month</span>
                  </div>
                  <div className="bg-slate-950/40 p-4 border border-white/5 rounded-xl space-y-1">
                    <span className="text-[9px] uppercase font-bold text-slate-500">Total API Queries</span>
                    <span className="block text-lg font-bold text-white font-mono">14,832 calls</span>
                    <span className="text-[8px] text-cyan-400 font-semibold">99.98% success rate</span>
                  </div>
                  <div className="bg-slate-950/40 p-4 border border-white/5 rounded-xl space-y-1">
                    <span className="text-[9px] uppercase font-bold text-slate-500">User Active Sessions</span>
                    <span className="block text-lg font-bold text-white font-mono">94 sessions</span>
                    <span className="text-[8px] text-green-400 font-semibold">+8% increase this week</span>
                  </div>
                </div>

                {/* Team QA Statistics */}
                <div className="glass p-5 rounded-xl border border-white/5 space-y-4">
                  <span className="font-bold text-slate-300 block">Team QA Score Performance</span>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px] text-slate-400">
                        <span>Retention Team</span>
                        <span className="font-mono font-bold text-green-400">89.4% average</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-green-500 h-full rounded-full" style={{ width: '89.4%' }} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px] text-slate-400">
                        <span>General Support</span>
                        <span className="font-mono font-bold text-amber-400">83.1% average</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-amber-500 h-full rounded-full" style={{ width: '83.1%' }} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px] text-slate-400">
                        <span>Technical Assistance</span>
                        <span className="font-mono font-bold text-rose-400">77.5% average</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-rose-500 h-full rounded-full" style={{ width: '77.5%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 8: Delete Calls and Manage Data */}
            {activeSubTab === 'calls' && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Trash2 className="w-4 h-4 text-cyan-400" />
                  Manage Call Recordings Data
                </h3>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Permanently delete analyzed recordings to free up organization storage or fulfill customer data privacy requests. This deletes metadata, transcripts, and QA reports.
                </p>

                <div className="glass rounded-xl border border-white/5 overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-950/40 text-slate-400 font-bold border-b border-white/5 text-[10px]">
                        <th className="px-4 py-3 font-semibold">Recording</th>
                        <th className="px-4 py-3 font-semibold">Duration</th>
                        <th className="px-4 py-3 font-semibold">File Size</th>
                        <th className="px-4 py-3 font-semibold text-center">QA Score</th>
                        <th className="px-4 py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                      {adminCalls.map(c => (
                        <tr key={c.id} className="hover:bg-white/[0.01]">
                          <td className="px-4 py-2.5">
                            <span className="font-bold text-white block">{c.title}</span>
                            <span className="text-[9px] text-slate-500 font-mono">{c.filename}</span>
                          </td>
                          <td className="px-4 py-2.5 font-mono text-slate-400">{c.duration}</td>
                          <td className="px-4 py-2.5 font-mono text-slate-400">{c.size}</td>
                          <td className="px-4 py-2.5 text-center">
                            <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded text-[9px] font-bold">
                              {c.qaScore}%
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-right">
                            <button
                              type="button"
                              onClick={() => handleDeleteCall(c.id)}
                              className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 9: Billing Settings & Plans */}
            {activeSubTab === 'billing' && (
              <div className="space-y-6">
                
                {/* Plans Grid */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-cyan-400" />
                    Subscription Plan Settings
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    {/* Starter */}
                    <div
                      onClick={() => setSelectedPlan('starter')}
                      className={`glass p-4 rounded-xl border cursor-pointer transition-all ${
                        selectedPlan === 'starter' ? 'border-cyan-500 bg-cyan-950/5 shadow' : 'border-white/5 hover:border-white/10'
                      }`}
                    >
                      <span className="block font-bold text-white text-sm">Starter</span>
                      <span className="block text-slate-400 text-lg font-mono font-bold mt-1">$49<span className="text-[10px] font-normal">/mo</span></span>
                      <span className="block text-[9px] text-slate-500 mt-2">Up to 100 calls/mo • 10 GB Storage • Basic QA</span>
                    </div>

                    {/* Professional */}
                    <div
                      onClick={() => setSelectedPlan('professional')}
                      className={`glass p-4 rounded-xl border cursor-pointer transition-all ${
                        selectedPlan === 'professional' ? 'border-cyan-500 bg-cyan-950/5 shadow' : 'border-white/5 hover:border-white/10'
                      }`}
                    >
                      <span className="block font-bold text-white text-sm">Professional</span>
                      <span className="block text-slate-400 text-lg font-mono font-bold mt-1">$199<span className="text-[10px] font-normal">/mo</span></span>
                      <span className="block text-[9px] text-slate-500 mt-2">Up to 500 calls/mo • 50 GB Storage • Advanced CRM</span>
                    </div>

                    {/* Enterprise */}
                    <div
                      onClick={() => setSelectedPlan('enterprise')}
                      className={`glass p-4 rounded-xl border cursor-pointer transition-all relative overflow-hidden ${
                        selectedPlan === 'enterprise' ? 'border-cyan-500 bg-cyan-950/5 shadow' : 'border-white/5 hover:border-white/10'
                      }`}
                    >
                      <div className="absolute top-0 right-0 bg-cyan-500 text-slate-950 text-[7px] font-black px-2 py-0.5 rounded-bl uppercase tracking-wider">
                        Active
                      </div>
                      <span className="block font-bold text-white text-sm">Enterprise</span>
                      <span className="block text-slate-400 text-lg font-mono font-bold mt-1">$499<span className="text-[10px] font-normal">/mo</span></span>
                      <span className="block text-[9px] text-slate-500 mt-2">Unlimited calls • 100 GB Storage • Custom AI Coach</span>
                    </div>

                  </div>
                </div>

                {/* Billing History */}
                <div className="space-y-3 border-t border-white/5 pt-5">
                  <span className="font-bold text-slate-300 block">Billing Invoice History</span>
                  <div className="glass rounded-xl border border-white/5 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-950/40 text-slate-400 font-bold border-b border-white/5 text-[10px]">
                          <th className="px-4 py-2.5">Invoice ID</th>
                          <th className="px-4 py-2.5">Billing Date</th>
                          <th className="px-4 py-2.5">Amount</th>
                          <th className="px-4 py-2.5 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-slate-300 font-mono text-[10px]">
                        {billingHistory.map(b => (
                          <tr key={b.invoice}>
                            <td className="px-4 py-2.5 font-bold text-white">{b.invoice}</td>
                            <td className="px-4 py-2.5 text-slate-400">{b.date}</td>
                            <td className="px-4 py-2.5 text-slate-400">{b.amount}</td>
                            <td className="px-4 py-2.5 text-center">
                              <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full text-[8px] font-bold">
                                {b.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* Submit / Action Bar */}
            <div className="pt-4 border-t border-white/5 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.01]"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Settings
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

      </div>

    </div>
  )
}
