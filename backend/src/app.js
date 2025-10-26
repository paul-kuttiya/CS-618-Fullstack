import express from 'express'
import cors from 'cors'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@as-integrations/express5'
import { postsRoutes } from './routes/posts.js'
import { userRoutes } from './routes/users.js'
import { eventRoutes } from './routes/events.js'
import { typeDefs, resolvers } from './graphql/index.js'
import { optionalAuth } from './middleware/jwt.js'

const app = express()

app.use(cors())
app.use(express.json())

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
})

await apolloServer.start()

app.use(
  '/graphql',
  cors(),
  express.json(),
  optionalAuth,
  expressMiddleware(apolloServer, {
    context: async ({ req }) => {
      return { auth: req.auth }
    },
  }),
)

postsRoutes(app)
userRoutes(app)
eventRoutes(app)

app.get('/', (_req, res) => {
  res.send('Hello from Express Nodemon!')
})

export { app }
