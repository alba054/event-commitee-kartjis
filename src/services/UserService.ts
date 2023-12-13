import { NotFoundError } from "../exceptions/httpError/NotFoundError";
import { User } from "../models/User";
import { ERRORCODE, hashPassword } from "../utils";
import { IPostUsers } from "../utils/interfaces/User";

export class UserService {
  private userModel: User;

  constructor() {
    this.userModel = new User();
  }

  async addNewUsers(payload: IPostUsers[]) {
    const users = this.userModel.addUsers(
      payload.map(
        (p) =>
          ({
            password: hashPassword(p.password),
            username: p.username,
            email: p.email,
            eventId: p.eventId,
            name: p.name,
            phoneNumber: p.phoneNumber,
          } as IPostUsers)
      )
    );

    return users;
  }

  async getUserByUsername(username: string) {
    const user = await this.userModel.getUserByUsername(username);

    if (!user) {
      throw new NotFoundError(
        ERRORCODE.USER_NOT_FOUND_ERROR,
        "user's not found"
      );
    }

    return user;
  }
}
