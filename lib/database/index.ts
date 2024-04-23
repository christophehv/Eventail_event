// Importation du module mongoose pour interagir avec MongoDB.
import mongoose from 'mongoose';

// Récupération de l'URI de connexion à MongoDB à partir des variables d'environnement.
const MONGODB_URI = process.env.MONGODB_URI;

// Initialisation d'un cache pour stocker la connexion et la promesse de connexion, utilisable globalement.
let cached = (global as any).mongoose || { conn: null, promise: null };

// Fonction asynchrone pour établir ou récupérer une connexion existante à la base de données.
export const connectToDatabase = async () => {
  if (cached.conn) return cached.conn; // Si la connexion est déjà établie, la retourner directement.

  if(!MONGODB_URI) throw new Error('MONGODB_URI is missing'); // Vérifier si l'URI de MongoDB est fournie, sinon lancer une erreur.

  // Si la promesse de connexion n'existe pas, créer une nouvelle promesse de connexion.
  cached.promise = cached.promise || mongoose.connect(MONGODB_URI, {
    dbName: 'Cluster0', // Nom spécifique de la base de données à utiliser.
    bufferCommands: false, // Désactivation du buffering des commandes si la connexion n'est pas établie.
  })

  // Attendre la résolution de la promesse de connexion et stocker le résultat dans le cache.
  cached.conn = await cached.promise;

  return cached.conn; // Retourner la connexion établie.
}
