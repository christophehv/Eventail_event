// Importation des modules nécessaires de Mongoose et du type Organization de Clerk pour une utilisation future.
import { Document, Schema, model, models } from "mongoose";

// Définition de l'interface TypeScript pour un événement.
export interface IEvent extends Document {
  _id: string;  // Identifiant unique de l'événement.
  title: string;  // Titre de l'événement.
  description?: string;  // Description de l'événement, facultative.
  location?: string;  // Lieu de l'événement, facultatif.
  createdAt: Date;  // Date de création de l'événement.
  imageUrl?: string;  // URL de l'image de l'événement, facultative.
  startDateTime: Date;  // Date et heure de début de l'événement.
  endDateTime: Date;  // Date et heure de fin de l'événement.
  price: string;  // Prix de l'événement.
  isFree: boolean;  // Indique si l'événement est gratuit.
  url?: string;  // URL de l'événement, facultative.
  category: { _id: string, name: string };  // Catégorie de l'événement.
  organizer: { _id: string, firstName: string, lastName: string };  // Organisateur de l'événement.
}

// Schéma Mongoose pour un événement, définissant la structure des données.
const EventSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  location: { type: String },
  createdAt: { type: Date, default: Date.now },
  imageUrl: { type: String, required: false },
  startDateTime: { type: Date, default: Date.now },
  endDateTime: { type: Date, default: Date.now },
  price: { type: String },
  isFree: { type: Boolean, default: false },
  url: { type: String },
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
  organizer: { type: Schema.Types.ObjectId, ref: 'User' },
})

// Création du modèle Mongoose 'Event' ou utilisation d'un modèle existant pour éviter les recompilations.
const Event = models.Event || model('Event', EventSchema);

// Exportation du modèle pour utilisation dans d'autres parties de l'application.
export default Event;
