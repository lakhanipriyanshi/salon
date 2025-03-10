const bcrypt = require("bcrypt");
require("dotenv").config();

const encryption = async (value) => {
  const salt = await bcrypt.genSaltSync(
     parseInt(process.env.ENCRYPTION_SALT_ROUNDS)
  );
  const hash = await bcrypt.hashSync(value, salt);
  return hash;
};

const decryption = async (value, hash) => {
  const result = await bcrypt.compare(value, hash);  
  return result;
};

module.exports = {
  encryption,
  decryption,
};
