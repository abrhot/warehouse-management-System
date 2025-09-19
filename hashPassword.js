import bcrypt from 'bcrypt';

const password = '123qwe'; // plain password
const hashed = await bcrypt.hash(password, 10);
console.log(hashed);
