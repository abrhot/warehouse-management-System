// hash.ts (or hash.js if you're not using TypeScript)
import bcrypt from "bcrypt";

bcrypt.hash("your-password", 10).then((hash) => {
  console.log("Hashed password:", hash);
});
