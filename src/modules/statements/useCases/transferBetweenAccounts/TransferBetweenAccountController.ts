import { Request, Response } from "express";
import { container } from "tsyringe";
import { TransferBetweenAccountsUseCase } from "./TransferBetweenAccountsUseCase";

class TransferBetweenAccountsController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const { amount, description } = request.body;
    const { id: sender_id } = request.user;
    const { user_id: recipient_id } = request.params;

    const transferBetweenAccountsUseCase = container.resolve(
      TransferBetweenAccountsUseCase
    );

    const transfer = await transferBetweenAccountsUseCase.execute({
      amount,
      description,
      recipient_id,
      sender_id,
    });

    return response.json(transfer);
  }
}

export { TransferBetweenAccountsController };
