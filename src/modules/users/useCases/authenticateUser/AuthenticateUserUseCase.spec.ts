import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let userRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

const makeRequest = () => {
  return {
    email: "any_user",
    password: "any_pass",
  };
};

describe("Authenticate User UseCase", () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(userRepository);
  });

  it("Should not be able to authenticate user when user was not exists", async () => {
    expect(async () => {
      await authenticateUserUseCase.execute(makeRequest());
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("Should not be able to authenticate user when password was incorrect", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "any_name",
        email: "any_email",
        password: "any_pass",
      });

      await authenticateUserUseCase.execute({
        email: "any_email",
        password: "123456",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("Should be able to authenticate user", async () => {
    await createUserUseCase.execute({
      name: "any_name",
      email: "any_email",
      password: "any_pass",
    });

    const signIn = await authenticateUserUseCase.execute({
      email: "any_email",
      password: "any_pass",
    });

    expect(signIn).toHaveProperty("user");
    expect(signIn.user).toHaveProperty("id");
    expect(signIn).toHaveProperty("token");
  });
});
