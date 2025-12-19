import bcrypt from "bcrypt";
// Hashing the password
const hashedPassword = await bcrypt.hash(password, 10);
// Comparing the hashed passwords
const isMatch = await bcrypt.compare(password, hashedPassword);
