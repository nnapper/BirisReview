import { useSelector } from 'react-redux'
import { LoadingOverlay } from './components/LoadingOverlay'
import { NavBar } from './components/NavBar'
import './styles/App.css'
import { Outlet } from 'react-router'
import { apiLoading } from './store'

function App() {
  const isLoading = useSelector(apiLoading)
  return (
    <div className="App">
      {isLoading && <LoadingOverlay />}
      <NavBar />
      <br />
      <Outlet />
    </div>
  )
}

export default App
