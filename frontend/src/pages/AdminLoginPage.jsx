import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logoImg from '/src/assets/images/Logo.svg'
import backImg from '/src/assets/images/rpt_back.svg'

function AdminLoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('token', data.access_token)
        localStorage.setItem('user', JSON.stringify(data.user))
        navigate('/admin-dashboard')
      } else {
        setError(data.error || 'Login failed')
      }
    } catch (err) {
      setError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center py-8 relative">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 p-2 flex items-center gap-2 text-gray-600 hover:text-blue-900"
      >
        <img src={backImg} alt="Back" className="w-5 h-5" />
        <span className="text-sm font-medium">Back</span>
      </button>
      {/* Logo */}
      <div className="mb-6">
        <img 
          className="w-64 h-28 object-contain" 
          src={logoImg} 
          alt="SafeMap" 
        />
      </div>

      {/* Login Card */}
      <form onSubmit={handleLogin} className="w-96 max-w-[90vw] bg-white rounded-tl-[70px] rounded-tr-[70px] shadow-xl pb-8 overflow-hidden">
        
        {/* Welcome Text */}
        <div className="px-8 pt-12 pb-6">
          <h1 className="text-xl font-bold text-zinc-800 font-['DM_Sans']">Welcome Back!</h1>
          <p className="text-sm text-gray-500 mt-1 font-['DM_Sans']">Authorized LGU Officers only</p>
        </div>

        {/* Email Field */}
        <div className="px-8 py-3">
          <label className="block text-xs font-medium text-neutral-600 font-['DM_Sans'] mb-2">
            Employee ID or Email
          </label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your credentials"
            className="w-full h-12 px-4 bg-white rounded-xl border border-gray-300 outline-none text-sm font-['DM_Sans'] focus:border-blue-500"
            required
          />
        </div>

        {/* Password Field */}
        <div className="px-8 py-3">
          <label className="block text-xs font-medium text-neutral-600 font-['DM_Sans'] mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full h-12 px-4 pr-12 bg-white rounded-xl border border-gray-300 outline-none text-sm font-['DM_Sans'] focus:border-blue-500"
              required
            />
            {/* Eye icon */}
            <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
          {/* Forgot Password */}
          <div className="text-right mt-2">
            <a href="#" className="text-blue-900 text-xs font-semibold font-['DM_Sans']">
              Forgot Password?
            </a>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-8 p-3 bg-red-50 text-red-600 text-sm rounded-lg font-['DM_Sans']">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <div className="px-8 pt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-blue-900 rounded-2xl text-white text-base font-bold font-['DM_Sans'] hover:bg-blue-800 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminLoginPage
