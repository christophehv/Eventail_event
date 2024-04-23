'use client'
// Importation des modules et composants nécessaires, incluant les modèles de données, authentification, et UI.
import { IEvent } from '@/lib/database/models/event.model';
import { SignedIn, SignedOut, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import React from 'react';
import { Button } from '../ui/button';
import Checkout from './Checkout';

// Définition du composant CheckoutButton qui gère l'affichage conditionnel des options d'achat de tickets.
const CheckoutButton = ({ event }: { event: IEvent }) => {
  // Récupération de l'utilisateur actuellement connecté et extraction sécurisée de l'ID.
  const { user } = useUser();
  const userId = user?.publicMetadata.userId as string;
  
  // Vérification si l'événement est déjà terminé pour désactiver l'achat de tickets.
  const hasEventFinished = new Date(event.endDateTime) < new Date();

  // Rendu conditionnel basé sur l'état de l'événement.
  return (
    <div className="flex items-center gap-3">
      {hasEventFinished ? (
        // Affichage d'un message si l'événement est terminé.
        <p className="p-2 text-red-400">Désolé, il n&apos;y a plus de tickets disponibles</p>
      ) : (
        // Affichage conditionnel des boutons selon l'état de connexion de l'utilisateur.
        <>
          <SignedOut>
            {/* // Bouton pour inciter à se connecter afin d'acheter un ticket. */}
            <Button asChild className="button rounded-full" size="lg">
              <Link href="/sign-in">
                Prendre Ticket
              </Link>
            </Button>
          </SignedOut>

          <SignedIn>
            
            <Checkout event={event} userId={userId} />
          </SignedIn>
        </>
      )}
    </div>
  );
};

export default CheckoutButton;
