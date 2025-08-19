import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Button from '../components/ui/Button'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center text-3xl font-bold text-gray-900">
            <p>Exp</p>
            <img src="expense-logo.png" alt="expense-logo" className='size-15' />
            <p className='flex flex-col'>nse <span className='text-xs'>Tracker</span></p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">{user?.email}</span>
            <Button onClick={handleLogout}>Logout</Button>
          </div>
        </div>
      </header>
    </div>
  )
}