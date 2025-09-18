import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { financialService } from '@/services/financial.service'

const createTransactionSchema = z.object({
  amount: z.number(),
  description: z.string(),
  category: z.string(),
  type: z.enum(['income', 'expense']),
  date: z.string(),
})

const createCategorySchema = z.object({
  name: z.string(),
  type: z.enum(['income', 'expense']),
  color: z.string(),
})

export async function financialRoutes(fastify: FastifyInstance) {
  // Categories
  fastify.get('/categories', async () => {
    return financialService.getCategories()
  })

  fastify.post('/categories', async (request) => {
    const data = createCategorySchema.parse(request.body)
    return financialService.createCategory(data)
  })

  // Transactions
  fastify.get('/transactions', async () => {
    return financialService.getTransactions()
  })

  fastify.post('/transactions', async (request) => {
    const data = createTransactionSchema.parse(request.body)
    return financialService.createTransaction(data)
  })

  // Balance
  fastify.get('/balance', async () => {
    return financialService.getBalance()
  })
}