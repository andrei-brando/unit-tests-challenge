import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./../authenticateUser/AuthenticateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let userRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

const makeRequest = () => {
  return {
    email: "any_user",
    password: "any_pass",
  };
};

describe("Show User Profile UseCase", () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(userRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(userRepository);
  });

  it("Should not be able to show user profile when user not exists", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute("any_uid");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });

  it("Should be able to show user profile", async () => {
    const newUser = await createUserUseCase.execute({
      name: "any_name",
      email: "any_email",
      password: "any_pass",
    });

    const user = await showUserProfileUseCase.execute(newUser.id);

    expect(user).toHaveProperty("name");
    expect(user.name).toBe("any_name");
    expect(user).toHaveProperty("email");
    expect(user.email).toBe("any_email");
  });
});
