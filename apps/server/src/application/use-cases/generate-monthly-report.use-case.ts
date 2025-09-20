import { IMonthlyBalanceRepository } from '../../domain/repositories/monthly-balance.repository.interface.js'
import { ITransactionRepository } from '../../domain/repositories/transaction.repository.interface.js'
import { IInvestmentRepository } from '../../domain/repositories/investment.repository.interface.js'
import { MonthlyBalance } from '../../domain/entities/monthly-balance.entity.js'

export interface GenerateMonthlyReportRequest {
  accountId: string
  year: number
  month: number
}

export class GenerateMonthlyReportUseCase {
  constructor(
    private monthlyBalanceRepository: IMonthlyBalanceRepository,
    private transactionRepository: ITransactionRepository,
    private investmentRepository: IInvestmentRepository
  ) {}

  async execute(request: GenerateMonthlyReportRequest): Promise<MonthlyBalance> {
    let balance = await this.monthlyBalanceRepository.findByAccountAndMonth(
      request.accountId,
      request.year,
      request.month
    )

    if (!balance) {
      const transactionTotals = await this.transactionRepository.getMonthlyTotals(
        request.accountId,
        request.year,
        request.month
      )

      const investmentTotal = await this.investmentRepository.getAccountTotal(request.accountId)

      balance = MonthlyBalance.create(
        `${request.accountId}-${request.year}-${request.month}`,
        request.accountId,
        request.year,
        request.month,
        transactionTotals.income,
        transactionTotals.expenses,
        investmentTotal
      )

      await this.monthlyBalanceRepository.save(balance)
    }

    return balance
  }
}