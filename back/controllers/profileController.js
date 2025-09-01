// controllers/profileController.js
import {
  findProfileById
} from "../models/profileModel.js";

//Récupérer le profil (connecté)
export const getProfile = async (req, res) => {
  try {
    const user = await findProfileById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json({
      message: "Profil utilisateur",
      user,
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};