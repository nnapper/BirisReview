import { NavBar } from './components/NavBar'
import './styles/App.css'
import { Outlet } from 'react-router'

function App() {
  return (
    <div className="App">
      <NavBar />
      <br />
      <Outlet />
    </div>
  )
}

export default App
