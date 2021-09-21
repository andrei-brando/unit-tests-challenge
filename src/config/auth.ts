require("dotenv").config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});

export default {
  jwt: {
    secret: process.env.JWT_SECRET as string,
    expiresIn: "1d",
  },
};
