// Importation des modules nécessaires de Mongoose.
import { Schema, model, models, Document } from 'mongoose'

// Définition de l'interface TypeScript pour une commande.
export interface IOrder extends Document {
  createdAt: Date;  // Date de création de la commande.
  stripeId: string;  // Identifiant Stripe associé à la commande.
  totalAmount: string;  // Montant total de la commande.
  event: {
    _id: string;  // Identifiant de l'événement associé à la commande.
    title: string;  // Titre de l'événement.
  }
  buyer: {
    _id: string;  // Identifiant de l'acheteur.
    firstName: string;  // Prénom de l'acheteur.
    lastName: string;  // Nom de l'acheteur.
  }
}

// Définition du schéma Mongoose pour une commande.
const OrderSchema = new Schema({
  createdAt: { type: Date, default: Date.now },  // Définition de la date de création avec valeur par défaut à maintenant.
  stripeId: { type: String, required: true, unique: true },  // Identifiant Stripe requis et unique.
  totalAmount: { type: String },  // Montant total de la commande.
  event: { type: Schema.Types.ObjectId, ref: 'Event' },  // Référence à un événement dans la base de données.
  buyer: { type: Schema.Types.ObjectId, ref: 'User' },  // Référence à un utilisateur (acheteur) dans la base de données.
})

// Création du modèle Mongoose 'Order' ou utilisation d'un modèle existant pour éviter les recompilations.
const Order = models.Order || model('Order', OrderSchema)

// Exportation du modèle pour utilisation dans d'autres parties de l'application.
export default Order;
