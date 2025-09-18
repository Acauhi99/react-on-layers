import Fastify from 'fastify'
import cors from '@fastify/cors'
import { financialRoutes } from '@/routes/financial.routes'

const fastify = Fastify({ logger: true })

// CORS
await fastify.register(cors, {
  origin: ['http://localhost:3001'],
  credentials: true,
})

// Routes
await fastify.register(financialRoutes, { prefix: '/api' })

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' })
    console.log('🚀 Server running on http://localhost:3000')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()