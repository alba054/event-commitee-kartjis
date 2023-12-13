import { hashPassword } from "../utils";
import db from "../utils/database";

const main = async () => {
  const eventId = "e495fb2c-f422-43bf-a815-2eb6967293e5";

  await db.user.create({
    data: {
      username: "commiteekockditangkis",
      password: hashPassword("randompassword"),
      name: "panitia 1",
      email: "panitia1@mail.com",
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
