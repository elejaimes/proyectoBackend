import { compare, genSalt, hash } from "bcrypt";

//Función para hashear contraseña

export async function hashearPassword(password) {
  const salt = await genSalt(10);
  const hashear = await hash(password, salt);
  return hashear;
}

//Función para comparar una contraseña con un hash almacenado

export async function comparePassword(password, storedHash) {
  return await compare(password, storedHash);
}
