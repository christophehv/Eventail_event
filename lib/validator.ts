// Importation du module zod pour la validation de schémas.
import * as z from "zod"

// Définition d'un schéma Zod pour la validation des formulaires d'événements.
export const eventFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'), // Le titre doit avoir au moins 3 caractères.
  description: z.string().min(3, 'Description must be at least 3 characters').max(400, 'Description must be less than 400 characters'), // La description doit avoir entre 3 et 400 caractères.
  location: z.string().min(3, 'Location must be at least 3 characters').max(400, 'Location must be less than 400 characters'), // Le lieu doit avoir entre 3 et 400 caractères.
  imageUrl: z.string(), // L'URL de l'image, sans restriction de longueur.
  startDateTime: z.date(), // La date de début doit être un objet Date.
  endDateTime: z.date(), // La date de fin doit être un objet Date.
  categoryId: z.string(), // L'identifiant de la catégorie, requis.
  price: z.string(), // Le prix, sous forme de chaîne.
  isFree: z.boolean(), // Booléen indiquant si l'événement est gratuit.
  url: z.string().url() // L'URL de l'événement doit être une URL valide.
})
