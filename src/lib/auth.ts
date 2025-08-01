import bcrypt from 'bcryptjs';
import prisma from './prisma';

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return null;

  return { id: user.id, email: user.email, role: user.role };
}
