import { catchPrismaError } from "../utils";
import db from "../utils/database";
import { IPostUsers } from "../utils/interfaces/User";

export class User {
  async addUsers(payload: IPostUsers[]) {
    try {
      return await db.user.createMany({
        data: payload,
      });
    } catch (error) {
      catchPrismaError(error);
    }
  }

  async getUserByUsername(username: string) {
    return db.user.findUnique({
      where: {
        username,
      },
    });
  }
}
