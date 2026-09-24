import { useState, useEffect } from 'react'
import { apiRequest } from './api.js'
import Onboarding from './screens/Onboarding.jsx'
import Auth from './screens/Auth.jsx'
import LevelMap from './screens/LevelMap.jsx'
import BeginnerLevel from './screens/BeginnerLevel.jsx'
import VideoPlayer from './screens/VideoPlayer.jsx'
import Quiz from './screens/Quiz.jsx'
import { BeginnerComplete, IntermediateComplete, UnlockAdvanced, AdvancedResult } from './screens/Completions.jsx'
import Intermediate from './screens/Intermediate.jsx'
import Simulation from './screens/Simulation.jsx'
import Advanced from './screens/Advanced.jsx'
import Navbar from './components/Navbar.jsx'
import Chatbot from './components/Chatbot.jsx'
import FloatingBlobs from './components/FloatingBlobs.jsx'
import AdminPanel from './screens/AdminPanel.jsx'
import OverworldCity from './screens/OverworldCity.jsx'
import LandingJourney from './screens/LandingJourney.jsx'
import AiAvatarSelector from './components/AiAvatarSelector.jsx'
import SavedSimulationsManager from './screens/SavedSimulationsManager.jsx'

const INITIAL_STATE = {
  user: null, xp: 30, lessonsWatched: ['video4'],
  completedModules: [],
  correctCount: 0, quizScore: 0,
  intermediateUnlocked: false, advancedUnlocked: false,
  currentVideo: null, currentModule: null,
  startingLevel: null,
  allocations: { PPF: 30, FD: 25, NSC: 20, SSY: 15, RD: 10 },
}

const getBgClass = (screen) => {
  if (['beginner','video','quiz','beg-complete'].includes(screen)) return 'bg-beginner'
  if (['intermediate','simulation','int-complete'].includes(screen)) return 'bg-intermediate'
  if (['advanced','unlock-adv','adv-result'].includes(screen)) return 'bg-advanced'
  if (screen === 'onboarding' || screen === 'auth') return 'bg-auth'
  return 'bg-intermediate'
}

const getColorThemeForScreen = (screenName) => {
  if (['beginner', 'video', 'quiz', 'beg-complete'].includes(screenName)) return 'emerald'
  if (['intermediate', 'simulation', 'int-complete'].includes(screenName)) return 'amethyst'
  if (['advanced', 'unlock-adv', 'adv-result'].includes(screenName)) return 'sunset'
  return 'classic'
}

export default function App() {
  const [screen, setScreen] = useState('onboarding')
  const [state, setState] = useState(INITIAL_STATE)
  const [chatOpen, setChatOpen] = useState(false)
  const [transitioning, setTransitioning] = useState(false)
  const [prevBg, setPrevBg] = useState('')
  const [currentBg, setCurrentBg] = useState('bg-auth')
  
  const [themeMode] = useState('dark')
  const [colorTheme, setColorTheme] = useState(() => getColorThemeForScreen('onboarding'))

  // Automatic Theme Color Change on Level Entry
  useEffect(() => {
    const autoTheme = getColorThemeForScreen(screen)
    setColorTheme(autoTheme)
    document.documentElement.setAttribute('data-color-theme', autoTheme)
    document.body.setAttribute('data-color-theme', autoTheme)
    document.documentElement.setAttribute('data-theme', 'dark')
    document.body.setAttribute('data-theme', 'dark')
  }, [screen])

  // Saved Simulations States
  const [savedSimulations, setSavedSimulations] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('l2i_savedSimulations')) || []
    } catch {
      return []
    }
  })

  const [savedPortfolioSimulations, setSavedPortfolioSimulations] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('l2i_savedPortfolioSimulations')) || []
    } catch {
      return []
    }
  })

  // Handlers for Lab Simulations
  const handleSaveSimulation = (sim) => {
    setSavedSimulations(prev => {
      const next = [sim, ...prev]
      localStorage.setItem('l2i_savedSimulations', JSON.stringify(next))
      return next
    })
  }

  const handleUpdateSavedSimulation = (updated) => {
    setSavedSimulations(prev => {
      const next = prev.map(s => s.id === updated.id ? updated : s)
      localStorage.setItem('l2i_savedSimulations', JSON.stringify(next))
      return next
    })
  }

  const handleDeleteSavedSimulation = (id) => {
    setSavedSimulations(prev => {
      const next = prev.filter(s => s.id !== id)
      localStorage.setItem('l2i_savedSimulations', JSON.stringify(next))
      return next
    })
  }

  // Handlers for Portfolio Simulations
  const handleSavePortfolio = (port) => {
    setSavedPortfolioSimulations(prev => {
      const next = [port, ...prev]
      localStorage.setItem('l2i_savedPortfolioSimulations', JSON.stringify(next))
      return next
    })
  }

  const handleUpdateSavedPortfolio = (updated) => {
    setSavedPortfolioSimulations(prev => {
      const next = prev.map(s => s.id === updated.id ? updated : s)
      localStorage.setItem('l2i_savedPortfolioSimulations', JSON.stringify(next))
      return next
    })
  }

  const handleDeleteSavedPortfolio = (id) => {
    setSavedPortfolioSimulations(prev => {
      const next = prev.filter(s => s.id !== id)
      localStorage.setItem('l2i_savedPortfolioSimulations', JSON.stringify(next))
      return next
    })
  }

  const [aiGuideAvatar, setAiGuideAvatarState] = useState(() => {
    return localStorage.getItem('l2i_aiAvatar') || 'female'
  })
  const [aiGuideName, setAiGuideNameState] = useState(() => {
    return localStorage.getItem('l2i_aiAvatarName') || (aiGuideAvatar === 'female' ? 'Luna' : 'Leo')
  })
  const [avatarModalOpen, setAvatarModalOpen] = useState(false)

  const setAiGuideAvatar = (avatarId, customName) => {
    setAiGuideAvatarState(avatarId)
    localStorage.setItem('l2i_aiAvatar', avatarId)
    if (customName) {
      setAiGuideNameState(customName)
      localStorage.setItem('l2i_aiAvatarName', customName)
    }
  }

  // Check persistent login on mount and restore state from backend
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('l2i_isLoggedIn')
    const token = localStorage.getItem('l2i_token')
    if (isLoggedIn === 'true' && token) {
      apiRequest('/api/state/load', 'GET')
        .then(data => {
          // Ensure video4 is always included in lessonsWatched so Quiz Hall is accessible
          const watchedList = Array.from(new Set([...(data.state?.lessonsWatched || []), 'video4']))
          const loadedState = { ...data.state, lessonsWatched: watchedList, user: data.user }
          setState(s => ({ ...s, ...loadedState }))
          setScreen('landing')
          setCurrentBg(getBgClass('landing'))
        })
        .catch(() => {
          localStorage.removeItem('l2i_isLoggedIn')
          localStorage.removeItem('l2i_token')
          localStorage.removeItem('l2i_currentUser')
          setScreen('auth')
        })
    } else {
      // Ensure video4 is marked in initial offline state
      setState(s => ({ ...s, lessonsWatched: Array.from(new Set([...s.lessonsWatched, 'video4'])) }))
    }
  }, [])

  // Save changes to backend on state update
  useEffect(() => {
    if (state.user && state.user.email) {
      const stateToSave = {
        xp: state.xp,
        lessonsWatched: state.lessonsWatched,
        completedModules: state.completedModules || [],
        correctCount: state.correctCount,
        quizScore: state.quizScore,
        intermediateUnlocked: state.intermediateUnlocked,
        advancedUnlocked: state.advancedUnlocked,
        allocations: state.allocations,
        startingLevel: state.startingLevel,
      }
      apiRequest('/api/state/save', 'POST', stateToSave)
        .catch(err => console.error('Failed to sync progress with server:', err))
    }
  }, [state.xp, state.lessonsWatched, state.completedModules, state.correctCount, state.quizScore, state.intermediateUnlocked, state.advancedUnlocked, state.allocations, state.startingLevel, state.user])

  const [historyStack, setHistoryStack] = useState([])

  const update = (patch) => setState(s => ({ ...s, ...patch }))
  const addXP = (amount) => setState(s => ({ ...s, xp: s.xp + amount }))

  const go = (s, options = {}) => {
    if (s === screen) return
    const newBg = getBgClass(s)
    if (newBg !== currentBg) {
      setTransitioning(true)
      setPrevBg(currentBg)
      setCurrentBg(newBg)
      setTimeout(() => setTransitioning(false), 600)
    }
    if (!options?.replace) {
      setHistoryStack(prev => [...prev, screen])
    }
    setScreen(s)
    window.scrollTo(0, 0)
  }

  const goBack = () => {
    if (historyStack.length > 0) {
      const target = historyStack[historyStack.length - 1]
      setHistoryStack(prev => prev.slice(0, prev.length - 1))
      const newBg = getBgClass(target)
      if (newBg !== currentBg) {
        setTransitioning(true)
        setPrevBg(currentBg)
        setCurrentBg(newBg)
        setTimeout(() => setTransitioning(false), 600)
      }
      setScreen(target)
      window.scrollTo(0, 0)
    } else {
      if (['video', 'quiz', 'beg-complete'].includes(screen)) go('beginner', { replace: true })
      else if (['simulation', 'int-complete'].includes(screen)) go('intermediate', { replace: true })
      else if (['unlock-adv', 'adv-result'].includes(screen)) go('advanced', { replace: true })
      else go('landing', { replace: true })
    }
  }

  const canGoBack = screen !== 'landing' && screen !== 'auth' && screen !== 'onboarding'

  const openAvatarModal = () => setAvatarModalOpen(true)

  const p = { go, goBack, canGoBack, state, update, addXP, aiGuideAvatar, aiGuideName, openAvatarModal, themeMode }


  const screens = {
    landing: <LandingJourney {...p} />,
    'level-map': <LevelMap {...p} />,
    overworld: <OverworldCity {...p} />,
    dashboard: <LevelMap {...p} />,
    beginner: <BeginnerLevel {...p} />,
    video: <VideoPlayer {...p} />,
    quiz: <Quiz {...p} />,
    'beg-complete': <BeginnerComplete {...p} />,
    intermediate: <Intermediate {...p} />,
    simulation: (
      <Simulation
        {...p}
        savedSimulations={savedSimulations}
        onSaveSimulation={handleSaveSimulation}
        onUpdateSavedSimulation={handleUpdateSavedSimulation}
        onDeleteSavedSimulation={handleDeleteSavedSimulation}
      />
    ),
    'int-complete': <IntermediateComplete {...p} />,
    'unlock-adv': <UnlockAdvanced {...p} />,
    advanced: (
      <Advanced
        {...p}
        savedPortfolioSimulations={savedPortfolioSimulations}
        onSavePortfolio={handleSavePortfolio}
        onUpdateSavedPortfolio={handleUpdateSavedPortfolio}
        onDeleteSavedPortfolio={handleDeleteSavedPortfolio}
      />
    ),
    'adv-result': <AdvancedResult {...p} />,
    'saved-simulations': (
      <SavedSimulationsManager
        {...p}
        savedSimulations={savedSimulations}
        savedPortfolioSimulations={savedPortfolioSimulations}
        onUpdateSavedSimulation={handleUpdateSavedSimulation}
        onDeleteSavedSimulation={handleDeleteSavedSimulation}
        onUpdateSavedPortfolio={handleUpdateSavedPortfolio}
        onDeleteSavedPortfolio={handleDeleteSavedPortfolio}
      />
    ),
    admin: <AdminPanel {...p} />,
  }

  const showHeaderAndNav = !['onboarding','auth'].includes(screen)

  return (
    <div className="portrait-app-shell" data-theme={themeMode} data-color-theme={colorTheme}>
      <div className={`theme-${themeMode}`} data-theme={themeMode} data-color-theme={colorTheme} style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
        <div
          className={currentBg}
          style={{
            position: 'fixed', inset: 0, zIndex: 0,
            transition: 'opacity 0.6s ease',
            opacity: transitioning ? 0.5 : 1,
          }}
        />
        <FloatingBlobs type={
          currentBg === 'bg-beginner' ? 'green' :
          currentBg === 'bg-intermediate' ? 'purple' :
          currentBg === 'bg-advanced' ? 'pink' : 'rainbow'
        } />
        <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          
          {screen === 'onboarding' && <Onboarding onDone={() => go('auth')} />}

          {screen === 'auth' && (
            <Auth onLogin={(user) => {
              apiRequest('/api/state/load', 'GET')
                .then(data => {
                  setState(s => ({ ...s, ...data.state, user: data.user }))
                })
                .catch(() => {
                  setState(s => ({ ...s, ...INITIAL_STATE, user }))
                })
              go('landing')
            }} />
          )}

          {showHeaderAndNav && (
            <>
              <Navbar
                user={state.user}
                xp={state.xp}
                currentScreen={screen}
                onChatToggle={() => setChatOpen(o => !o)}
                go={go}
                goBack={goBack}
                canGoBack={canGoBack}
                aiGuideAvatar={aiGuideAvatar}
                aiGuideName={aiGuideName}
                openAvatarModal={openAvatarModal}
              />
              <div key={screen} className="anim-fade" style={{ flex: 1 }}>
                {screens[screen] || <LandingJourney {...p} />}
              </div>

              <Chatbot
                open={chatOpen}
                onClose={() => setChatOpen(false)}
                user={state.user}
                xp={state.xp}
                currentScreen={screen}
                aiGuideAvatar={aiGuideAvatar}
                aiGuideName={aiGuideName}
              />
            </>
          )}

          <AiAvatarSelector
            isOpen={avatarModalOpen}
            onClose={() => setAvatarModalOpen(false)}
            currentAvatar={aiGuideAvatar}
            currentName={aiGuideName}
            onSelect={(avatarId, customName) => {
              setAiGuideAvatar(avatarId, customName)
            }}
          />
        </div>
      </div>
    </div>
  )
}
