// Importe les dépendances nécessaires, incluant les modèles, utilitaires, et composants React.
import { IEvent } from '@/lib/database/models/event.model';
import { formatDateTime } from '@/lib/utils';
import { auth } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { DeleteConfirmation } from './DeleteConfirmation';

// Définit les propriétés attendues par le composant Card.
type CardProps = {
  event: IEvent,
  hasOrderLink?: boolean,
  hidePrice?: boolean
}

// Le composant Card affiche un événement avec options pour éditer et supprimer si l'utilisateur est l'organisateur.
const Card = ({ event, hasOrderLink, hidePrice }: CardProps) => {
  // Authentification et récupération des informations de session de l'utilisateur.
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;

  // Vérifie si l'utilisateur connecté est l'organisateur de l'événement.
  const isEventCreator = event.organizer && userId === event.organizer._id.toString();

  // Structure principale du composant Card, utilisant un layout flex et des styles conditionnels.
  return (
    <div className="group relative flex min-h-[380px] w-full max-w-[400px] flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg md:min-h-[438px]">
      {/* Lien avec image en arrière-plan pointant vers la page détaillée de l'événement */}
      <Link 
        href={`/events/${event._id}`}
        style={{backgroundImage: `url(${event.imageUrl})`}}
        className="flex-center flex-grow bg-gray-50 bg-cover bg-center text-grey-500"
      />

      {/* Affiche les options d'édition et de suppression si l'utilisateur est l'organisateur et si le prix n'est pas caché */}
      {isEventCreator && !hidePrice && (
        <div className="absolute right-2 top-2 flex flex-col gap-4 rounded-xl bg-white p-3 shadow-sm transition-all">
          {/* Lien pour modifier l'événement */}
          <Link href={`/events/${event._id}/update`}>
            <Image src="/assets/icons/edit.svg" alt="edit" width={20} height={20} />
          </Link>

          {/* Composant pour la confirmation de suppression */}
          <DeleteConfirmation eventId={event._id} />
        </div>
      )}

      {/* Détails de l'événement incluant le prix, la catégorie, et la date */}
      <div className="flex min-h-[230px] flex-col gap-3 p-5 md:gap-4"> 
       {/* Affiche le prix si celui-ci n'est pas caché */}
       {!hidePrice && (
          <div className="flex gap-2">
            <span className="p-semibold-14 w-min rounded-full bg-green-100 px-4 py-1 text-green-60">
              {event.isFree ? 'Gratuit' : `$${event.price}`}
            </span>
            <p className="p-semibold-14 w-min rounded-full bg-grey-500/10 px-4 py-1 text-grey-500 line-clamp-1">
              {event.category.name}
            </p>
          </div>
        )}

        {/* Formate et affiche la date et l'heure de début de l'événement */}
        <p className="p-medium-16 p-medium-18 text-grey-500">
          {formatDateTime(event.startDateTime).dateTime}
        </p>

        {/* Lien vers la page de l'événement avec le titre comme texte cliquable */}
        <Link href={`/events/${event._id}`}>
          <p className="p-medium-16 md:p-medium-20 line-clamp-2 flex-1 text-black">{event.title}</p>
        </Link>

        {/* Affichage de l'organisateur et option pour voir les détails de la commande si applicable */}
        <div className="flex-between w-full">
          <p className="p-medium-14 md:p-medium-16 text-grey-600">
            {event.organizer ? `${event.organizer.firstName} ${event.organizer.lastName}` : 'Organisateur inconnu'}
          </p>

          {hasOrderLink && (
            <Link href={`/orders?eventId=${event._id}`} className="flex gap-2">
              <p className="text-primary-500">Détails de la commande</p>
              <Image src="/assets/icons/arrow.svg" alt="search" width={10} height={10} />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default Card
