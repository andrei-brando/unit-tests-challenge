import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { ICreateUserDTO } from "@modules/users/useCases/createUser/ICreateUserDTO";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { ICreateStatementDTO } from "./ICreateStatementDTO";

let usersRepositoryInMemory: InMemoryUsersRepository;
let statementRepositoryInMemory: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

const makeStatement = (): ICreateStatementDTO => {
  return {
    user_id: "any_uid",
    amount: 100,
    description: "any_description",
    type: OperationType.DEPOSIT,
  };
};

const makeUser = (): ICreateUserDTO => {
  return {
    name: "any_name",
    email: "any_email",
    password: "any_password",
  };
};

describe("Create Statement UseCase", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementRepositoryInMemory = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      usersRepositoryInMemory,
      statementRepositoryInMemory
    );
  });

  it("Should not be able to create statement when user not exists", async () => {
    expect(async () => {
      await createStatementUseCase.execute(makeStatement());
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("Should not be able to create statement with withdraw type when user hasn't money", async () => {
    expect(async () => {
      const user = await usersRepositoryInMemory.create(makeUser());

      await createStatementUseCase.execute({
        user_id: user.id,
        amount: 100,
        description: "any_desc",
        type: OperationType.WITHDRAW,
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });

  it("Should be able to create statement with deposit type", async () => {
    const user = await usersRepositoryInMemory.create(makeUser());

    const statement = await createStatementUseCase.execute({
      user_id: user.id,
      amount: 100,
      description: "any_desc",
      type: OperationType.DEPOSIT,
    });

    expect(statement).toHaveProperty("id");
    expect(statement).toHaveProperty("user_id");
    expect(statement.user_id).toEqual(user.id);
  });
});
