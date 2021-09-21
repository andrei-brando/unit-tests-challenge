import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { CreateUserError } from "./CreateUserError";

let userRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User UseCase", () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepository);
  });

  it("Should be able to create a user", async () => {
    const user = {
      name: "any_name",
      email: "any_email",
      password: "any_password",
    };

    await createUserUseCase.execute(user);

    const createdUser = await userRepository.findByEmail("any_email");

    expect(createdUser).toHaveProperty("id");
  });

  it("Should not be able to create a user when user already exists", async () => {
    expect(async () => {
      const user = {
        name: "any_name",
        email: "any_email",
        password: "any_password",
      };

      await createUserUseCase.execute(user);

      await createUserUseCase.execute(user);
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
