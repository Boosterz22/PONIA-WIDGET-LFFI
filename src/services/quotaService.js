const QUOTA_LIMITS = {
  gratuit: {
    voiceCommands: 5,
    dailyActions: 20,
    maxProducts: 10,
    historyDays: 0
  },
  standard: {
    voiceCommands: Infinity,
    dailyActions: Infinity,
    maxProducts: Infinity,
    historyDays: 30
  },
  pro: {
    voiceCommands: Infinity,
    dailyActions: Infinity,
    maxProducts: Infinity,
    historyDays: 90
  }
}

export function getUserQuotas(userPlan = 'gratuit') {
  return QUOTA_LIMITS[userPlan] || QUOTA_LIMITS.gratuit
}

function getTodayKey() {
  return new Date().toISOString().split('T')[0]
}

export function getVoiceCommandsUsed() {
  const today = getTodayKey()
  const stored = localStorage.getItem('ponia_voice_quota')
  
  if (!stored) return 0
  
  const data = JSON.parse(stored)
  if (data.date !== today) return 0
  
  return data.count || 0
}

export function incrementVoiceCommands() {
  const today = getTodayKey()
  const current = getVoiceCommandsUsed()
  
  localStorage.setItem('ponia_voice_quota', JSON.stringify({
    date: today,
    count: current + 1
  }))
  
  return current + 1
}

export function canUseVoiceCommand(userPlan = 'gratuit') {
  const quotas = getUserQuotas(userPlan)
  const used = getVoiceCommandsUsed()
  
  return used < quotas.voiceCommands
}

export function getDailyActionsUsed() {
  const today = getTodayKey()
  const stored = localStorage.getItem('ponia_actions_quota')
  
  if (!stored) return 0
  
  const data = JSON.parse(stored)
  if (data.date !== today) return 0
  
  return data.count || 0
}

export function incrementDailyActions() {
  const today = getTodayKey()
  const current = getDailyActionsUsed()
  
  localStorage.setItem('ponia_actions_quota', JSON.stringify({
    date: today,
    count: current + 1
  }))
  
  return current + 1
}

export function canPerformAction(userPlan = 'gratuit') {
  const quotas = getUserQuotas(userPlan)
  const used = getDailyActionsUsed()
  
  return used < quotas.dailyActions
}

export function getQuotaStatus(userPlan = 'gratuit') {
  const quotas = getUserQuotas(userPlan)
  const voiceUsed = getVoiceCommandsUsed()
  const actionsUsed = getDailyActionsUsed()
  
  return {
    voice: {
      used: voiceUsed,
      limit: quotas.voiceCommands,
      remaining: quotas.voiceCommands === Infinity ? Infinity : quotas.voiceCommands - voiceUsed,
      canUse: voiceUsed < quotas.voiceCommands
    },
    actions: {
      used: actionsUsed,
      limit: quotas.dailyActions,
      remaining: quotas.dailyActions === Infinity ? Infinity : quotas.dailyActions - actionsUsed,
      canUse: actionsUsed < quotas.dailyActions
    },
    products: {
      limit: quotas.maxProducts
    },
    history: {
      days: quotas.historyDays
    }
  }
}
