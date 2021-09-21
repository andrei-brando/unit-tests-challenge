import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { ICreateUserDTO } from "@modules/users/useCases/createUser/ICreateUserDTO";
import { CreateStatementUseCase } from "./../createStatement/CreateStatementUseCase";
import { ICreateStatementDTO } from "./../createStatement/ICreateStatementDTO";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let statementRepositoryInMemory: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let getBalanceUseCase: GetBalanceUseCase;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

const makeUser = (): ICreateUserDTO => {
  return {
    name: "any_name",
    email: "any_email",
    password: "any_password",
  };
};

const makeDepositStatement = (userId: string): ICreateStatementDTO => {
  return {
    user_id: userId,
    amount: 100,
    description: "any_description",
    type: OperationType.DEPOSIT,
  };
};

const makeWithdrawStatement = (userId: string): ICreateStatementDTO => {
  return {
    user_id: userId,
    amount: 50,
    description: "any_description",
    type: OperationType.WITHDRAW,
  };
};

describe("Get Balance UseCase", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementRepositoryInMemory = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      usersRepositoryInMemory,
      statementRepositoryInMemory
    );
    getBalanceUseCase = new GetBalanceUseCase(
      statementRepositoryInMemory,
      usersRepositoryInMemory
    );
  });

  it("Should not be able to get balance when user does not exists", async () => {
    expect(async () => {
      await getBalanceUseCase.execute({ user_id: "any_uid" });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });

  it("Should be able to get balance", async () => {
    const user = await usersRepositoryInMemory.create(makeUser());

    await createStatementUseCase.execute(makeDepositStatement(user.id));
    await createStatementUseCase.execute(makeWithdrawStatement(user.id));

    const response = await getBalanceUseCase.execute({ user_id: user.id });

    expect(response).toHaveProperty("statement");
    expect(response.statement).toHaveLength(2);
    expect(response).toHaveProperty("balance");
    expect(response.balance).toBe(50);
  });
});
