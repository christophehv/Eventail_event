'use server'
// Importation des outils nécessaires à la gestion des utilisateurs et des événements.
import { revalidatePath } from 'next/cache'; // Fonction pour forcer la réactualisation du cache
import { connectToDatabase } from '@/lib/database'; // Connexion à la base de données
import User from '@/lib/database/models/user.model'; // Modèle utilisateur
import Order from '@/lib/database/models/order.model'; // Modèle commande
import Event from '@/lib/database/models/event.model'; // Modèle événement
import { handleError } from '@/lib/utils'; // Gestion des erreurs

// Importation des types pour la création et la mise à jour des utilisateurs.
import { CreateUserParams, UpdateUserParams } from '@/types';

// Fonction pour créer un nouvel utilisateur
export async function createUser(user: CreateUserParams) {
  try {
    await connectToDatabase(); // Connexion à la base de données
    const newUser = await User.create(user); // Création de l'utilisateur dans la base de données
    console.log('User created:', newUser); // Affichage de confirmation
    return JSON.parse(JSON.stringify(newUser)); // Retour de l'utilisateur créé après sérialisation
  } catch (error) {
    handleError(error); // Gestion des erreurs
  }
};

// Fonction pour obtenir les détails d'un utilisateur par son ID
export async function getUserById(userId: string) {
  try {
    await connectToDatabase(); // Connexion à la base de données
    const user = await User.findById(userId); // Recherche de l'utilisateur par ID

    if (!user) throw new Error('User not found'); // Gestion de l'erreur si l'utilisateur n'est pas trouvé
    return JSON.parse(JSON.stringify(user)); // Retour de l'utilisateur trouvé
  } catch (error) {
    handleError(error); // Gestion des erreurs
  }
};

// Fonction pour mettre à jour les informations d'un utilisateur
export async function updateUser(clerkId: string, user: UpdateUserParams) {
  try {
    await connectToDatabase(); // Connexion à la base de données
    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, { new: true }); // Mise à jour de l'utilisateur

    if (!updatedUser) throw new Error('User update failed'); // Gestion de l'erreur si la mise à jour échoue
    return JSON.parse(JSON.stringify(updatedUser)); // Retour de l'utilisateur mis à jour
  } catch (error) {
    handleError(error); // Gestion des erreurs
  }
};

// Fonction pour supprimer un utilisateur
export async function deleteUser(clerkId: string) {
  try {
    await connectToDatabase(); // Connexion à la base de données
    const userToDelete = await User.findOne({ clerkId }); // Recherche de l'utilisateur à supprimer

    if (!userToDelete) {
      throw new Error('User not found'); // Gestion de l'erreur si l'utilisateur n'est pas trouvé
    }

    // Suppression des références à l'utilisateur dans les collections liées
    await Promise.all([
      Event.updateMany({ _id: { $in: userToDelete.events } }, { $pull: { organizer: userToDelete._id } }),
      Order.updateMany({ _id: { $in: userToDelete.orders } }, { $unset: { buyer: 1 } }),
    ]);

    // Suppression de l'utilisateur
    const deletedUser = await User.findByIdAndDelete(userToDelete._id);
    revalidatePath('/'); // Réactualisation du cache pour refléter les changements

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null; // Retour de l'utilisateur supprimé, s'il existe
  } catch (error) {
    handleError(error); // Gestion des erreurs
  }
};
