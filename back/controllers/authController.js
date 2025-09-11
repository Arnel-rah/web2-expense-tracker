import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { createUser, findUserByEmail, findUserById, updatePassword } from "../models/userModel.js";

// Inscription
export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'email existe déjà
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Cet email est déjà utilisé" });
    }

    // Hasher le mot de passe avant sauvegarde
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const newUser = await createUser({ email, password: hashedPassword });

    // Générer un token JWT (inscription --> connexion)
    const token = jwt.sign(
      { userId: newUser.user_id, email: newUser.email },
      config.jwtSecret,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      user: {
        userId: newUser.user_id,
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
        email: user.email
      },
      token
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la connexion", error: err.message });
  }
};

export const changePassword = async (req, res) => {
  const userId = req.userId;
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await findUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters." })
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return res.status(400).json({ message: "Current password is incorrect." })
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    res.json({ message: "Password up to date." });

    updatePassword(userId, hashedNewPassword);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error server", error: error.message })
  }
}