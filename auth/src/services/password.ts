import bcrypt from 'bcryptjs';

export class Password {
  static async toHash(password: string) {
    return await bcrypt.hash(password, 10);
  }

  static async compare(suppliedPassword: string, storedPassword: string) {
    return await bcrypt.compare(suppliedPassword, storedPassword);
  }
}
