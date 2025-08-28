import {
  getCategoriesDb,
  createCategoryDb,
  updateCategoryDb,
  deleteCategoryDb
} from "../models/categoriesModel.js"; 

// Lister les catégories d’un utilisateur
export const getCategories = async (req, res) => {
  try {
    const userId = req.userId; 
    const categories = await getCategoriesDb(userId);
    res.json(categories.rows); 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Créer une catégorie
export const createCategory = async (req, res) => {
  try {
    const userId = req.userId;
    const { name } = req.body;

    // Vérification du nom
    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Le nom de la catégorie est requis" });
    }

    const result = await createCategoryDb(userId, name);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mettre à jour une catégorie
export const updateCategory = async (req, res) => {
  try {
    const userId = req.userId;
    const categoryId = req.params.id; // récupéré de l’URL /categories/:id
    const { name } = req.body;

    // Vérification du nom
    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Le nom de la catégorie est requis" });
    }

    const updated = await updateCategoryDb(categoryId, userId, name);

    if (!updated) {
      return res.status(404).json({ message: "Catégorie introuvable ou non autorisée" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Supprimer une catégorie
export const deleteCategory = async (req, res) => {
  try {
    const userId = req.userId;
    const categoryId = req.params.id;

    const deleted = await deleteCategoryDb(categoryId, userId);

    if (!deleted) {
      return res.status(404).json({ message: "Catégorie introuvable ou non autorisée" });
    }

    res.json({ message: "Catégorie supprimée avec succès", category: deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
