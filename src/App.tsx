import './components/components.css'
import { SceneRouter } from './scenes/SceneRouter'
import { AppStateProvider } from './state/AppStateContext'

function App() {
  return (
    <AppStateProvider>
      <SceneRouter />
    </AppStateProvider>
  )
}

export default App
