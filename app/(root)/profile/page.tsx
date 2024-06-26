// Importation des composants nécessaires pour l'affichage.
import Collection from '@/components/shared/Collection';
import { Button } from '@/components/ui/button';

// Importation des actions pour récupérer les événements et commandes par utilisateur.
import { getEventsByUser } from '@/lib/actions/event.actions';
import { getOrdersByUser } from '@/lib/actions/order.actions';

// Importation des types de données.
import { IOrder } from '@/lib/database/models/order.model';
import { SearchParamProps } from '@/types';

// Importation des outils d'authentification et de navigation.
import { auth } from '@clerk/nextjs';
import Link from 'next/link';
import React from 'react';

// Définition du composant ProfilePage pour afficher les événements et commandes d'un utilisateur.
const ProfilePage = async ({ searchParams }: SearchParamProps) => {
  // Authentification et récupération de l'ID de l'utilisateur.
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;

  // Récupération des pages spécifiques pour les commandes et événements à partir des paramètres de recherche.
  const ordersPage = Number(searchParams?.ordersPage) || 1;
  const eventsPage = Number(searchParams?.eventsPage) || 1;

  // Appels asynchrones pour obtenir les commandes et les événements organisés par l'utilisateur.
  const orders = await getOrdersByUser({ userId, page: ordersPage });
  const orderedEvents = orders?.data.map((order: IOrder) => order.event) || [];
  const organizedEvents = await getEventsByUser({ userId, page: eventsPage });

  // Structure du JSX pour l'affichage.
  return (
    <>
      {/* Section des tickets de l'utilisateur avec un bouton pour voir plus d'événements. */}
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className='h3-bold text-center sm:text-left'>Mes tickets</h3>
          <Button asChild size="lg" className="button hidden sm:flex">
            <Link href="/#events">
              Plus d&apos;événements
            </Link>
          </Button>
        </div>
      </section>

      {/* Affichage des événements auxquels l'utilisateur a commandé des tickets. */}
      <section className="wrapper my-8">
        <Collection 
          data={orderedEvents}
          emptyTitle="Pas de tickets achetés pour le moment"
          emptyStateSubtext="Allez en acheter maintenant"
          collectionType="My_Tickets"
          limit={3}
          page={ordersPage}
          urlParamName="ordersPage"
          totalPages={orders?.totalPages}
        />
      </section>

      {/* Section des événements organisés par l'utilisateur. */}
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className='h3-bold text-center sm:text-left'>Organiser des événements</h3>
          <Button asChild size="lg" className="button hidden sm:flex">
            <Link href="/events/create">
              Créer un événement
            </Link>
          </Button>
        </div>
      </section>

      {/* Affichage des événements organisés par l'utilisateur. */}
      <section className="wrapper my-8">
        <Collection 
          data={organizedEvents?.data}
          emptyTitle="Pas d'événements organisés pour le moment"
          emptyStateSubtext="Créez un événement maintenant"
          collectionType="Events_Organized"
          limit={3}
          page={eventsPage}
          urlParamName="eventsPage"
          totalPages={organizedEvents?.totalPages}
        />
      </section>
    </>
  )
}

export default ProfilePage;
