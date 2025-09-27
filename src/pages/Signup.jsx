import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate, Link } from 'react-router-dom'
import { signup } from '../api/users.js'
export function Signup() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const signupMutation = useMutation({
    mutationFn: () => signup({ username: username.trim(), password }),
    onSuccess: () => navigate('/login'),
    onError: () => alert('Failed to sign up!'),
  })
  const handleSubmit = (e) => {
    e.preventDefault()
    signupMutation.mutate()
  }
  const isDisabled =
    !username.trim() || !password || signupMutation.isPending
  return (
    <form onSubmit={handleSubmit}>
      <Link to='/'>Back to main page</Link>
      <hr />
      <br />
      <div>
        <label htmlFor='create-username'>Username: </label>
        <input
          type='text'
          id='create-username'
          name='create-username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      <br />

      <div>
        <label htmlFor='create-password'>Password: </label>
        <input
          type='password'
          id='create-password'
          name='create-password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <br />

      <input
        type='submit'
        value={signupMutation.isPending ? 'Signing up...' : 'Sign Up'}
        disabled={isDisabled}
      />
    </form>
  )
}
