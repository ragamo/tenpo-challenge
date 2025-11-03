import {
  serverAfter,
  serverBefore,
  serverError,
  serverListening,
} from '@api/configure'
import { handler } from '@api/handler'
import { endpoints } from '@api/routers'
import { loadEnv } from 'dotenv-local'
import express from 'express'

const server = express()
serverBefore(server)

const { HOST, PORT } = loadEnv({
  envPrefix: 'SERVER_',
  removeEnvPrefix: true,
  envInitial: {
    SERVER_HOST: 'localhost',
    SERVER_PORT: '3000',
  },
})

declare const API_ROUTES: {
  BASE: string
  BASE_API: string
  PUBLIC_DIR: string
}

const SERVER_URL = `http://${HOST}:${PORT}${API_ROUTES.BASE}`

server.use(API_ROUTES.BASE_API, handler)
server.use(API_ROUTES.BASE, express.static(API_ROUTES.PUBLIC_DIR))
server.use('/{*catchall}', (req, res) => {
  res.redirect(
    `${API_ROUTES.BASE}?redirect=${encodeURIComponent(req.originalUrl)}`,
  )
})

serverAfter(server)

const PORT_NRO = parseInt(PORT)
server
  .listen(PORT_NRO, HOST, () => {
    console.log(`Ready at ${SERVER_URL}`)
    serverListening(server, endpoints)
  })
  .on('error', (error) => {
    console.error(`Error at ${SERVER_URL}`, error)
    serverError(server, error)
  })
