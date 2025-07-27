'use client'
import { signIn } from '@/lib/auth'

export default function LoginPage() {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await signIn('credentials', {
      email: 'admin@example.com',
      password: 'password',
      redirect: true,
      callbackUrl: '/dashboard'
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        <div className="mb-4">
          <label className="block mb-2">Email</label>
          <input 
            type="email" 
            className="w-full p-2 border rounded"
            defaultValue="admin@example.com"
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2">Password</label>
          <input 
            type="password" 
            className="w-full p-2 border rounded"
            defaultValue="password"
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Sign In
        </button>
      </form>
    </div>
  )
}