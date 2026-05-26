import jwt from "jsonwebtoken";

const generateToken = (id, role) => {
  const secret = process.env.JWT_SECRET || "luxora_secret_key_default_123456";
  const expiresIn = process.env.JWT_EXPIRE || "30d";

  return jwt.sign({ id, role }, secret, {
    expiresIn,
  });
};

export default generateToken;
