import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { createUser, findUserByEmail } from "../models/userModel.js";

// Inscription
export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Vérifier si l'email existe déjà
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Cet email est déjà utilisé" });
    }

    // Hasher le mot de passe avant sauvegarde
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const newUser = await createUser({ username, email, password: hashedPassword });

    // Générer un token JWT (inscription --> connexion)
    const token = jwt.sign(
      { userId: newUser.user_id, email: newUser.email }, // userId cohérent
      config.jwtSecret,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      user: {
        userId: newUser.user_id, // uniforme avec le token
        username: newUser.username,
        email: newUser.email
      },
      token
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de l'inscription", error: err.message });
  }
};

// Connexion
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Email ou mot de passe incorrect" });
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Email ou mot de passe incorrect" });
    }

    // Générer un token JWT (connexion)
    const token = jwt.sign(
      { userId: user.user_id, email: user.email }, 
      config.jwtSecret,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Connexion réussie",
      user: {
        userId: user.user_id, 
        username: user.username,
        email: user.email
      },
      token
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la connexion", error: err.message });
  }
};
