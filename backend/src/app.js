import express from 'express'
//import { postsRoutes } from './routes/posts.js'
import { userRoutes } from './routes/users.js'
import bodyParser from 'body-parser'
import cors from 'cors'
import { createServer } from 'node:http'
import { Server } from 'socket.io'
import { handleSocket } from './socket.js'
const app = express()
app.use(bodyParser.json())
app.use(cors())
//postsRoutes(app)
userRoutes(app)
app.get('/', (req, res) => {
  res.send('Hello from Express Nodemon!')
})
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*',
  },
})
handleSocket(io)
/* io.on('connection', (socket) => {
  console.log('user connected:', socket.id)
  socket.on('disconnect', () => {
    console.log('user disconnected:', socket.id)
  })
}) */
export { server as app }
// export { app }
