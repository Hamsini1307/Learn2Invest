import fs from 'fs'
import path from 'path'

const dbPath = path.resolve('local_db.json')

function readDb() {
  try {
    if (!fs.existsSync(dbPath)) {
      return { users: [], states: [] }
    }
    return JSON.parse(fs.readFileSync(dbPath, 'utf8'))
  } catch (err) {
    return { users: [], states: [] }
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8')
  } catch (err) {
    console.error('Failed to write local database:', err)
  }
}

export const localUser = {
  findOne: async ({ email }) => {
    const db = readDb()
    const lowerEmail = email.toLowerCase().trim()
    return db.users.find(u => u.email === lowerEmail) || null
  },
  create: async (userDoc) => {
    const db = readDb()
    const lowerEmail = userDoc.email.toLowerCase().trim()
    if (db.users.some(u => u.email === lowerEmail)) {
      throw new Error('User already exists')
    }
    const newDoc = { ...userDoc, email: lowerEmail }
    db.users.push(newDoc)
    writeDb(db)
    return newDoc
  },
  find: async () => {
    const db = readDb()
    return db.users
  },
  deleteOne: async ({ email }) => {
    const db = readDb()
    const lowerEmail = email.toLowerCase().trim()
    db.users = db.users.filter(u => u.email !== lowerEmail)
    writeDb(db)
    return { deletedCount: 1 }
  }
}

export const localUserState = {
  findOne: async ({ email }) => {
    const db = readDb()
    const lowerEmail = email.toLowerCase().trim()
    const state = db.states.find(s => s.email === lowerEmail)
    if (!state) return null
    
    const allocMap = new Map()
    if (state.allocations) {
      Object.entries(state.allocations).forEach(([k, v]) => allocMap.set(k, v))
    }
    
    return {
      ...state,
      allocations: allocMap,
      toObject: () => state
    }
  },
  create: async (stateDoc) => {
    const db = readDb()
    const lowerEmail = stateDoc.email.toLowerCase().trim()
    db.states = db.states.filter(s => s.email !== lowerEmail)
    const newDoc = {
      xp: 0,
      lessonsWatched: [],
      completedModules: [],
      correctCount: 0,
      quizScore: 0,
      intermediateUnlocked: false,
      advancedUnlocked: false,
      allocations: {},
      startingLevel: 'beginner',
      ...stateDoc,
      email: lowerEmail
    }
    db.states.push(newDoc)
    writeDb(db)
    
    return {
      ...newDoc,
      allocations: new Map(),
      toObject: () => newDoc
    }
  },
  findOneAndUpdate: async ({ email }, updateObj, options = {}) => {
    const db = readDb()
    const lowerEmail = email.toLowerCase().trim()
    let state = db.states.find(s => s.email === lowerEmail)
    if (!state) {
      if (options.upsert) {
        state = {
          email: lowerEmail,
          xp: 0,
          lessonsWatched: [],
          completedModules: [],
          correctCount: 0,
          quizScore: 0,
          intermediateUnlocked: false,
          advancedUnlocked: false,
          allocations: {},
          startingLevel: 'beginner'
        }
        db.states.push(state)
      } else {
        return null
      }
    }
    const actualUpdates = updateObj.$set || updateObj
    Object.keys(actualUpdates).forEach(k => {
      state[k] = actualUpdates[k]
    })
    writeDb(db)
    
    const allocMap = new Map()
    if (state.allocations) {
      Object.entries(state.allocations).forEach(([k, v]) => allocMap.set(k, v))
    }
    return {
      ...state,
      allocations: allocMap,
      toObject: () => state
    }
  },
  find: async () => {
    const db = readDb()
    return db.states.map(s => {
      const allocMap = new Map()
      if (s.allocations) {
        Object.entries(s.allocations).forEach(([k, v]) => allocMap.set(k, v))
      }
      return {
        ...s,
        allocations: allocMap,
        toObject: () => s
      }
    })
  },
  deleteOne: async ({ email }) => {
    const db = readDb()
    const lowerEmail = email.toLowerCase().trim()
    db.states = db.states.filter(s => s.email !== lowerEmail)
    writeDb(db)
    return { deletedCount: 1 }
  }
}
