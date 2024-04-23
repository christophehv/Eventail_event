"use server"
// Importations des types nécessaires, des utilitaires pour la gestion des erreurs et la connexion à la base de données.
import { CreateCategoryParams } from "@/types"; // Types TypeScript pour la structure des données de catégorie.
import { handleError } from "../utils"; // Fonction utilitaire pour gérer les erreurs de manière centralisée.
import { connectToDatabase } from "../database"; // Fonction pour établir une connexion à la base de données MongoDB.
import Category from "../database/models/category.model"; // Modèle Mongoose pour la collection des catégories.

export const createCategory = async ({ categoryName }: CreateCategoryParams) => {
  try {
    await connectToDatabase(); // S'assure que la connexion à la base de données est établie.
    
    // Crée une nouvelle catégorie en utilisant le modèle Category avec le nom fourni.
    const newCategory = await Category.create({ name: categoryName });

    // Convertit l'objet Mongoose en JSON pour une manipulation ou une réponse API plus simple.
    return JSON.parse(JSON.stringify(newCategory));
  } catch (error) {
    handleError(error); // Appelle handleError pour gérer et enregistrer les erreurs.
  }
};

export const getAllCategories = async () => {
  try {
    await connectToDatabase(); // Assure que la connexion à la base de données est active.
    
    // Récupère toutes les catégories disponibles en utilisant le modèle Category.
    const categories = await Category.find();

    // Convertit les résultats en JSON pour faciliter la réponse via API.
    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    handleError(error); // Gestion des erreurs rencontrées pendant la requête.
  }
};
