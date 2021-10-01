import { IStatementsRepository } from "../../../../modules/statements/repositories/IStatementsRepository";
import { inject, injectable } from "tsyringe";
import { ICreateTransferDTO } from "./ICreateTransferDTO";
import { TransferBetweenAccountError } from "./TransferBetweenAccountError";

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
  TRANSFER = "transfer",
}

@injectable()
class TransferBetweenAccountsUseCase {
  constructor(
    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository
  ) {}

  public async execute({
    amount,
    recipient_id,
    sender_id,
    description,
  }: ICreateTransferDTO): Promise<void> {
    const userBalance = await this.statementsRepository.getUserBalance({
      user_id: sender_id,
    });

    const { balance } = userBalance;

    console.log(userBalance);

    if (balance < amount)
      throw new TransferBetweenAccountError.InsufficientFunds();

    await this.statementsRepository.create({
      amount,
      description,
      type: OperationType.TRANSFER,
      user_id: recipient_id,
      sender_id: sender_id,
    });
  }
}

export { TransferBetweenAccountsUseCase };
