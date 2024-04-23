// Importation des modules nécessaires de Mongoose pour la modélisation de données.
import { Document, Schema, model, models } from "mongoose";

// Définition de l'interface TypeScript pour une catégorie.
export interface ICategory extends Document {
  _id: string;  // Identifiant unique de la catégorie.
  name: string;  // Nom de la catégorie.
}

// Schéma Mongoose pour une catégorie, définissant la structure des données.
const CategorySchema = new Schema({
  name: { type: String, required: true, unique: true }, // Nom de la catégorie, requis et unique.
})

// Création du modèle Mongoose 'Category' ou utilisation d'un modèle existant pour éviter les recompilations.
const Category = models.Category || model('Category', CategorySchema);

// Exportation du modèle pour utilisation dans d'autres parties de l'application.
export default Category;
