// Importation de React et d'autres bibliothèques nécessaires.
import React, { useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Importation des modèles et composants locaux.
import { IEvent } from '@/lib/database/models/event.model';
import { Button } from '../ui/button';
import { checkoutOrder } from '@/lib/actions/order.actions';

// Initialisation de Stripe avec la clé publiable spécifiée dans les variables d'environnement.
loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Définition du composant Checkout qui gère le processus d'achat de tickets.
const Checkout = ({ event, userId }: { event: IEvent, userId: string }) => {
  // Écouteur d'événements pour détecter les retours de Stripe après tentative de paiement.
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) {
      console.log('Commande passée avec succès!');
    }

    if (query.get('canceled')) {
      console.log('Commande annulée.');
    }
  }, []);

  // Fonction appelée lors de la soumission du formulaire pour effectuer l'achat.
  const onCheckout = async () => {
    const order = {
      eventTitle: event.title,
      eventId: event._id,
      price: event.price,
      isFree: event.isFree,
      buyerId: userId
    };

    // Appel de la fonction checkoutOrder pour finaliser l'achat.
    await checkoutOrder(order);
  };

  // Rendu du formulaire avec un bouton pour l'achat ou l'obtention du ticket.
  return (
    <form action={onCheckout} method="post">
      <Button type="submit" role="link" size="lg" className="button sm:w-fit">
        {event.isFree ? 'Prendre Ticket' : 'Acheter Ticket'}
      </Button>
    </form>
  );
};

export default Checkout;
