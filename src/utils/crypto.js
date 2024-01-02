import { compareSync, genSaltSync, hashSync } from "bcrypt";

//Función para hashear contraseña

export async function hashearPassword(password) {
  const salt = await genSaltSync(10);
  const hashear = await hashSync(password, salt);
  return hashear;
}

//Función para comparar una contraseña con un hash almacenado

export async function comparePassword(password, storedHash) {
  return await compareSync(password, storedHash);
}
