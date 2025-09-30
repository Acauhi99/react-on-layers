import { IAccountRepository } from "@/domain/repositories/account.repository.interface";
import { AuthDomainService } from "@/domain/services/auth.domain-service";

export interface LoginAccountRequest {
  email: string;
  password: string;
}

export interface LoginAccountResponse {
  token: string;
}

export class LoginAccountUseCase {
  constructor(private readonly accountRepository: IAccountRepository) {}

  async execute(request: LoginAccountRequest): Promise<LoginAccountResponse> {
    const account = await this.accountRepository.findByEmail(request.email);
    if (!account) {
      throw new Error("Invalid credentials");
    }

    const isValidPassword = await AuthDomainService.verifyPassword(
      request.password,
      account.password
    );
    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }

    const token = AuthDomainService.generateToken({
      id: account.id,
      email: account.email,
      name: account.name,
    });

    return { token };
  }
}
