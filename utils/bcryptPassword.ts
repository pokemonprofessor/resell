import bcrypt from 'bcrypt'


export const hashPassword = async (password: string) : Promise<string> => {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hashed = await bcrypt.hash(password.trim(), salt);
  return hashed;
}

export const comparePassword = (password: string, hashedPassword: string) : boolean => {
  return bcrypt.compareSync(password, hashedPassword);
}
