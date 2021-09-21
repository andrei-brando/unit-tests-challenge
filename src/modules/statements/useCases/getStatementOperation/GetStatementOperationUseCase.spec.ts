import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { ICreateUserDTO } from "@modules/users/useCases/createUser/ICreateUserDTO";
import { CreateStatementUseCase } from "./../createStatement/CreateStatementUseCase";
import { ICreateStatementDTO } from "./../createStatement/ICreateStatementDTO";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let statementRepositoryInMemory: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

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

describe("Get Statement Operation UseCase", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementRepositoryInMemory = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      usersRepositoryInMemory,
      statementRepositoryInMemory
    );
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      usersRepositoryInMemory,
      statementRepositoryInMemory
    );
  });

  it("Should not be able to get statement operation when user does not exists", async () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: "any_uid",
        statement_id: "any_statement_uid",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("Should not be able to get statement operation when stetament does not exists", async () => {
    expect(async () => {
      const user = await usersRepositoryInMemory.create(makeUser());

      await getStatementOperationUseCase.execute({
        user_id: user.id,
        statement_id: "any_statement_uid",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });

  it("Should be able to get statement operation", async () => {
    const user = await usersRepositoryInMemory.create(makeUser());

    const statement = await createStatementUseCase.execute(
      makeDepositStatement(user.id)
    );

    expect(statement).toHaveProperty("id");
    expect(statement.amount).toBe(100);
    expect(statement.user_id).toBe(user.id);
  });
});
