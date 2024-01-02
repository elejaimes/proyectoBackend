// Definición del puerto en el que se ejecutará el servidor
export const PORT = 8080;

// export const MONGODB_CNX_STR =
//   "mongodb+srv://elejaimes:gatitos26@coderhouse.dwc12j1.mongodb.net/coderhouse"; // Conexión mongodb red
export const MONGODB_CNX_STR = "mongodb://127.0.0.1:27017/coderhouse"; // conexión mongodb local
export const SESSION_SECRET = "SecretCoder"; // ojo este es la palabra secreta para firmar la cookie deberia cambiarla y que sea segura en un caso real

export const githubAppId = "732786";
export const githubClientId = "Iv1.4a8f290ac81c977d";
export const githubClientSecret = "3f39f0af7ce8b51f7146f06f988bbb5968ea2a6c";
export const githubCallbackUrl = "http://localhost:8080/githubcallback";
