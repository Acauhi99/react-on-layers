import { IAccountRepository } from "../../domain/repositories/account.repository.interface.js";
import { AuthDomainService } from "../../domain/services/auth.domain-service.js";
import { generateUUID } from "../../utils/uuid.js";

export interface RegisterAccountRequest {
  email: string;
  name: string;
  password: string;
}

export interface RegisterAccountResponse {
  token: string;
  account: {
    id: string;
    email: string;
    name: string;
  };
}

export class RegisterAccountUseCase {
  constructor(private accountRepository: IAccountRepository) {}

  async execute(
    request: RegisterAccountRequest
  ): Promise<RegisterAccountResponse> {
    const existingAccount = await this.accountRepository.findByEmail(
      request.email
    );
    if (existingAccount) {
      throw new Error("Account with this email already exists");
    }

    const hashedPassword = await AuthDomainService.hashPassword(
      request.password
    );
    const account = AuthDomainService.createAccountFromRegistration(
      generateUUID(),
      request.email,
      request.name,
      hashedPassword
    );

    await this.accountRepository.save(account);
    const token = AuthDomainService.generateToken(account.id);

    return {
      token,
      account: {
        id: account.id,
        email: account.email,
        name: account.name,
      },
    };
  }
}
