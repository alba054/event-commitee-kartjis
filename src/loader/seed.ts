import { hashPassword } from "../utils";
import db from "../utils/database";

const main = async () => {
  const eventId = "e0306093-b0ce-4f31-bb1e-ab8d1089095e";

  await db.user.create({
    data: {
      username: "yoyo101",
      password: await hashPassword("randompassword"),
      name: "yoyo jr",
      email: "yoyo@mail.com",
      eventId,
    },
  });
};

main()
  .then((v) => {
    console.log("success");
  })
  .catch((r) => {
    console.error("error");
  });
