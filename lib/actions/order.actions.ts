'use server'
// Importation des bibliothèques nécessaires et des modèles de données.
import Stripe from 'stripe'; // Bibliothèque Stripe pour le paiement
import { CheckoutOrderParams, CreateOrderParams, GetOrdersByEventParams, GetOrdersByUserParams } from "@/types" // Types personnalisés
import { redirect } from 'next/navigation'; // Utilitaire de redirection Next.js
import { handleError } from '../utils'; // Fonction pour gérer les erreurs
import { connectToDatabase } from '../database'; // Fonction pour se connecter à la base de données
import Order from '../database/models/order.model'; // Modèle de données pour les commandes
import Event from '../database/models/event.model'; // Modèle de données pour les événements
import { ObjectId } from 'mongodb'; // Utilitaire MongoDB pour manipuler les IDs
import User from '../database/models/user.model'; // Modèle de données pour les utilisateurs

// Fonction pour créer une session de paiement Stripe pour une commande
export const checkoutOrder = async (order: CheckoutOrderParams) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!); // Initialisation de l'API Stripe
  const price = order.isFree ? 0 : Number(order.price) * 100; // Calcul du prix en centimes

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [{
        price_data: {
          currency: 'usd',
          unit_amount: price,
          product_data: { name: order.eventTitle }
        },
        quantity: 1
      }],
      metadata: { eventId: order.eventId, buyerId: order.buyerId },
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/profile`,
      cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/`,
    });

    redirect(session.url!); // Redirige l'utilisateur vers la session de paiement Stripe
  } catch (error) {
    throw error; // Propagation des erreurs pour gestion externe
  }
};

// Fonction pour créer une commande dans la base de données
export const createOrder = async (order: CreateOrderParams) => {
  try {
    await connectToDatabase(); // Connexion à la base de données
    
    const newOrder = await Order.create({
      ...order,
      event: order.eventId,
      buyer: order.buyerId,
    });

    return JSON.parse(JSON.stringify(newOrder)); // Sérialisation de l'objet pour éviter les problèmes liés aux types MongoDB
  } catch (error) {
    handleError(error); // Gestion centralisée des erreurs
  }
};

// Fonction pour obtenir les commandes associées à un événement
export async function getOrdersByEvent({ searchString, eventId }: GetOrdersByEventParams) {
  try {
    await connectToDatabase(); // Connexion à la base de données
    if (!eventId) throw new Error('Event ID is required'); // Validation de l'ID de l'événement
    const eventObjectId = new ObjectId(eventId); // Conversion de l'ID en objet MongoDB

    const orders = await Order.aggregate([
      { $lookup: { from: 'users', localField: 'buyer', foreignField: '_id', as: 'buyer' } },
      { $unwind: '$buyer' },
      { $lookup: { from: 'events', localField: 'event', foreignField: '_id', as: 'event' } },
      { $unwind: '$event' },
      { $project: { _id: 1, totalAmount: 1, createdAt: 1, eventTitle: '$event.title', eventId: '$event._id', buyer: { $concat: ['$buyer.firstName', ' ', '$buyer.lastName'] } } },
      { $match: { $and: [{ eventId: eventObjectId }, { buyer: { $regex: RegExp(searchString, 'i') } }] } },
    ]);

    return JSON.parse(JSON.stringify(orders)); // Sérialisation pour une manipulation plus aisée en JavaScript
  } catch (error) {
    handleError(error); // Gestion centralisée des erreurs
  }
};

// Fonction pour obtenir les commandes effectuées par un utilisateur
export async function getOrdersByUser({ userId, limit = 3, page }: GetOrdersByUserParams) {
  try {
    await connectToDatabase(); // Connexion à la base de données
    const skipAmount = (Number(page) - 1) * limit; // Calcul du nombre d'éléments à ignorer pour la pagination
    const conditions = { buyer: userId }; // Filtre pour les commandes de l'utilisateur

    const orders = await Order.distinct('event._id')
      .find(conditions)
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit)
      .populate({
        path: 'event',
        model: Event,
        populate: {
          path: 'organizer',
          model: User,
          select: '_id firstName lastName',
        },
      });

    const ordersCount = await Order.distinct('event._id').countDocuments(conditions);

    return { data: JSON.parse(JSON.stringify(orders)), totalPages: Math.ceil(ordersCount / limit) }; // Retour des données paginées et total des pages
  } catch (error) {
    handleError(error); // Gestion centralisée des erreurs
  }
};
