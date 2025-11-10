import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import { Blog } from './pages/Blog.jsx'
import { Chat } from './pages/Chat.jsx'
import { Signup } from './pages/Signup.jsx'
import { Login } from './pages/Login.jsx'
import { AuthContextProvider } from './contexts/AuthContext.jsx'
// import { io } from 'socket.io-client'
import { SocketIOContextProvider } from './contexts/SocketIOContext.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
/* const socket = io(import.meta.env.VITE_SOCKET_HOST, {
  query: 'room=' + new URLSearchParams(window.location.search).get('room'),
  auth: {
    token: new URLSearchParams(window.location.search).get('token'),
  },
}) */
const queryClient = new QueryClient()
const router = createBrowserRouter([
  {
    path: '/',
    element: <Chat />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/login',
    element: <Login />,
  },
])
/* socket.on('connect', async () => {
  console.log('connected to socket.io as', socket.id)
  socket.emit(
    'chat.message',
    new URLSearchParams(window.location.search).get('mymessage'),
  )
  const userInfo = await socket.emitWithAck('user.info', socket.id)
  console.log('user info', userInfo)
})
socket.on('connect_error', (err) => {
  console.error('socket.io connect error:', err)
})
socket.on('chat.message', (msg) => {
  console.log(`${msg.username}: ${msg.message}`)
}) */
export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <SocketIOContextProvider>
          <RouterProvider router={router} />
        </SocketIOContextProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  )
}
