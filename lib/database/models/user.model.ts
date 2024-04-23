// Importation des modules nécessaires de Mongoose.
import {Schema, models, model} from 'mongoose';

// Définition du schéma Mongoose pour un utilisateur.
const UserSchema = new Schema({
    clerkId: { type: String, required: true, unique: true },  // Identifiant unique Clerk requis pour chaque utilisateur.
    email: { type: String, required: true, unique: true },  // Email de l'utilisateur, requis et unique.
    username: { type: String, required: true, unique: true },  // Nom d'utilisateur, requis et unique.
    firstName: { type: String, required: true },  // Prénom de l'utilisateur, requis.
    lastName: { type: String, required: true },  // Nom de l'utilisateur, requis.
    photo: { type: String, required: true },  // Photo de profil de l'utilisateur, requise.

});

// Création du modèle Mongoose 'User' ou utilisation d'un modèle existant pour éviter les recompilations.
const User = models.User || model('User', UserSchema);

// Exportation du modèle pour utilisation dans d'autres parties de l'application.
export default User;
