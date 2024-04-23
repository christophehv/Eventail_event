"use server"
// Importations des dépendances nécessaires pour la gestion des chemins de cache, la connexion à la base de données, et la gestion des erreurs.
import { revalidatePath } from 'next/cache';
import { connectToDatabase } from '@/lib/database';
import Event from '@/lib/database/models/event.model';
import User from '@/lib/database/models/user.model';
import Category from '@/lib/database/models/category.model';
import { handleError } from '@/lib/utils';
import {
  CreateEventParams,
  UpdateEventParams,
  DeleteEventParams,
  GetAllEventsParams,
  GetEventsByUserParams,
  GetRelatedEventsByCategoryParams,
} from '@/types';

// Fonction pour récupérer une catégorie par nom avec une recherche insensible à la casse.
const getCategoryByName = async (name: string) => {
  return Category.findOne({ name: { $regex: name, $options: 'i' } });
};

// Fonction pour peupler un document d'événement avec des références détaillées à l'organisateur et à la catégorie.
const populateEvent = (query: any) => {
  return query
    .populate({ path: 'organizer', model: User, select: '_id firstName lastName' })
    .populate({ path: 'category', model: Category, select: '_id name' });
};

// Fonction pour créer un nouvel événement.
export async function createEvent({ userId, event, path }: CreateEventParams) {
  try {
    await connectToDatabase();
    const organizer = await User.findById(userId);
    if (!organizer) throw new Error('Organizer not found');

    const newEvent = await Event.create({ ...event, category: event.categoryId, organizer: userId });
    revalidatePath(path); // Revalide le chemin spécifié pour le cache Next.js.
    return JSON.parse(JSON.stringify(newEvent));
  } catch (error) {
    handleError(error);
  }
}

// Fonction pour obtenir un événement par son ID.
export async function getEventById(eventId: string) {
  try {
    await connectToDatabase();
    const event = await populateEvent(Event.findById(eventId));
    if (!event) throw new Error('Event not found');
    return JSON.parse(JSON.stringify(event));
  } catch (error) {
    handleError(error);
  }
}

// Fonction pour mettre à jour un événement existant.
export async function updateEvent({ userId, event, path }: UpdateEventParams) {
  try {
    await connectToDatabase();
    const eventToUpdate = await Event.findById(event._id);
    if (!eventToUpdate || eventToUpdate.organizer.toHexString() !== userId) {
      throw new Error('Unauthorized or event not found');
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      event._id,
      { ...event, category: event.categoryId },
      { new: true }
    );
    revalidatePath(path);
    return JSON.parse(JSON.stringify(updatedEvent));
  } catch (error) {
    handleError(error);
  }
}

// Fonction pour supprimer un événement.
export async function deleteEvent({ eventId, path }: DeleteEventParams) {
  try {
    await connectToDatabase();
    const deletedEvent = await Event.findByIdAndDelete(eventId);
    if (deletedEvent) revalidatePath(path);
  } catch (error) {
    handleError(error);
  }
}

// Fonction pour obtenir tous les événements avec pagination et filtres optionnels.
export async function getAllEvents({ query, limit = 6, page, category }: GetAllEventsParams) {
  try {
    await connectToDatabase();
    const titleCondition = query ? { title: { $regex: query, $options: 'i' } } : {};
    const categoryCondition = category ? await getCategoryByName(category) : null;
    const conditions = {
      $and: [titleCondition, categoryCondition ? { category: categoryCondition._id } : {}],
    };

    const skipAmount = (Number(page) - 1) * limit;
    const eventsQuery = Event.find(conditions)
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit);

    const events = await populateEvent(eventsQuery);
    const eventsCount = await Event.countDocuments(conditions);
    return {
      data: JSON.parse(JSON.stringify(events)),
      totalPages: Math.ceil(eventsCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
}

// Fonction pour obtenir les événements organisés par un utilisateur spécifique.
export async function getEventsByUser({ userId, limit = 6, page }: GetEventsByUserParams) {
  try {
    await connectToDatabase();
    const conditions = { organizer: userId };
    const skipAmount = (page - 1) * limit;

    const eventsQuery = Event.find(conditions)
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit);

    const events = await populateEvent(eventsQuery);
    const eventsCount = await Event.countDocuments(conditions);
    return { data: JSON.parse(JSON.stringify(events)), totalPages: Math.ceil(eventsCount / limit) };
  } catch (error) {
    handleError(error);
  }
}

// Fonction pour obtenir des événements relatifs par catégorie, excluant l'événement spécifié.
export async function getRelatedEventsByCategory({
  categoryId,
  eventId,
  limit = 3,
  page = 1,
}: GetRelatedEventsByCategoryParams) {
  try {
    await connectToDatabase();
    const skipAmount = (Number(page) - 1) * limit;
    const conditions = { $and: [{ category: categoryId }, { _id: { $ne: eventId } }] };

    const eventsQuery = Event.find(conditions)
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit);

    const events = await populateEvent(eventsQuery);
    const eventsCount = await Event.countDocuments(conditions);

    return { data: JSON.parse(JSON.stringify(events)), totalPages: Math.ceil(eventsCount / limit) };
  } catch (error) {
    handleError(error);
  }
}
