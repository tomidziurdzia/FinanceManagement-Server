import { Request, Response } from "express";
import User from "../models/User";
import generateJWT from "../helpers/generateJWT";
import generateToken from "../helpers/generateToken";
import { RequestWithUser } from "../interfaces/user.interface";
import { googleVerify } from "../helpers/googleVerify";

const createUser = async (req: Request, res: Response) => {
  // Prevenir usuarios duplicados
  const { email } = req.body;
  const userExist = await User.findOne({ email });

  if (userExist) {
    const error = new Error("User already registered");
    return res.status(400).json({ msg: error.message });
  }

  // Registrar nuevo usuario
  try {
    const newUser = new User(req.body);
    // Generar token
    newUser.token = generateToken();

    // Almacenar nuevo usuario
    await newUser.save();

    res.json({ msg: "User successfully create, check your email" });
  } catch (error) {
    console.log(error);
  }
};

// Confirmar token de un solo uso para crear la cuenta
const confirmToken = async (req: Request, res: Response) => {
  const { token } = req.params;
  const userExist = await User.findOne({ token });

  if (!userExist) {
    const error = new Error("Invalid token");
    return res.status(403).json({ msg: error.message });
  }

  try {
    userExist.confirmed = true;
    userExist.token = "";
    await userExist.save();
    res.json({ msg: "Your account has been confirmed, you can sign in" });
  } catch (error) {
    console.log(error);
  }
};

const authenticateUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Comprobar si el usuario existe
  const userExist = await User.findOne({ email });
  if (!userExist) {
    const error = new Error("User doesn't exist");
    return res.status(404).json({ msg: error.message });
  }

  // Comprobar si el usuario esta confirmado
  if (!userExist.confirmed) {
    const error = new Error("Your account has not been confirmed");
    return res.status(404).json({ msg: error.message });
  }

  // Comprobar password
  if (await userExist.checkPassword(password)) {
    res.json({
      _id: userExist._id,
      name: userExist.name,
      surname: userExist.surname,
      email: userExist.email,
      token: generateJWT(userExist._id),
    });
  } else {
    const error = new Error("The password is incorrect");
    return res.status(403).json({ msg: error.message });
  }
};

const forgetPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  // Comprobar si el usuario existe
  const userExist = await User.findOne({ email });
  if (!userExist) {
    const error = new Error("User doesn't exist");
    return res.status(404).json({ msg: error.message });
  }

  try {
    userExist.token = generateToken();
    await userExist.save();

    res.json({ msg: "We have sent an email with instructions" });
  } catch (error) {
    console.log(error);
  }
};

// Compruebo el token de un solo uso para restablecer password
const checkToken = async (req: Request, res: Response) => {
  const { token } = req.params;

  const userExist = User.findOne({ token });

  if (!userExist) {
    const error = new Error("Invalid token");
    return res.status(403).json({ msg: error.message });
  } else {
    res.json({ msg: "Token valid, user exists" });
  }
};

// Almacenar nuevo password y resetear token
const newPassword = async (req: Request, res: Response) => {
  const { token } = req.params;
  const { password } = req.body;

  const userExist = await User.findOne({ token });

  if (userExist) {
    userExist.password = password;
    userExist.token = "";

    try {
      await userExist.save();
      res.json({ msg: "Password successfully modified" });
    } catch (error) {
      console.log(error);
    }
  } else {
    const error = new Error("Invalid token");
    return res.status(403).json({ msg: error.message });
  }
};

// Obtener perfil del usuario
const getUser = async (req: RequestWithUser, res: Response) => {
  const { user } = req;
  console.log(user);
  user!.token = generateJWT(user!._id);
  res.json(user);
};

// Login con google
const loginWithGoogle = async (req: Request, res: Response) => {
  const { id_token } = req.body;

  try {
    const { name, surname, picture, email } = await googleVerify(id_token);

    let user = await User.findOne({ email });

    if (!user) {
      const data = {
        name,
        surname,
        picture,
        email,
        confirmed: true,
        googleAcctount: true,
      };
      user = new User(data);
      await user.save();
    }
    user.token = generateJWT(user!._id);
    res.json(user);
  } catch (error: any) {
    return res.status(403).json({ msg: error.message });
  }
};

export {
  createUser,
  confirmToken,
  authenticateUser,
  forgetPassword,
  checkToken,
  newPassword,
  getUser,
  loginWithGoogle,
};
