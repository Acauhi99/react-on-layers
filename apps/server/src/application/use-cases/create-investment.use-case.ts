import { IInvestmentRepository } from "../../domain/repositories/investment.repository.interface.js";
import { IAccountRepository } from "../../domain/repositories/account.repository.interface.js";
import { Investment } from "../../domain/entities/investment.entity.js";
import { generateUUID } from "../../utils/uuid.js";

export interface CreateInvestmentRequest {
  accountId: string;
  name: string;
  investmentTypeId: string;
  amount: number;
  date: Date;
}

export class CreateInvestmentUseCase {
  constructor(
    private investmentRepository: IInvestmentRepository,
    private accountRepository: IAccountRepository
  ) {}

  async execute(request: CreateInvestmentRequest): Promise<Investment> {
    const account = await this.accountRepository.findById(request.accountId);
    if (!account) {
      throw new Error("Account not found");
    }

    const investment = Investment.create(
      generateUUID(),
      request.accountId,
      request.name,
      request.investmentTypeId,
      request.amount,
      request.date
    );

    await this.investmentRepository.save(investment);
    return investment;
  }
}
