// Importation des composants partagés pour l'affichage et les interactions.
import CheckoutButton from '@/components/shared/CheckoutButton';
import Collection from '@/components/shared/Collection';

// Importation des fonctions pour la récupération des données des événements.
import { getEventById, getRelatedEventsByCategory } from '@/lib/actions/event.actions';

// Importation de l'utilitaire pour le formatage de date.
import { formatDateTime } from '@/lib/utils';

// Importation des types utilisés dans ce fichier.
import { SearchParamProps } from '@/types';

// Importation du composant Image de Next.js pour un affichage optimisé des images.
import Image from 'next/image';

// Définition du composant fonctionnel EventDetails qui utilise les props de type SearchParamProps.
const EventDetails = async ({ params: { id }, searchParams }: SearchParamProps) => {
  // Récupération des détails de l'événement par son ID.
  const event = await getEventById(id);

  // Récupération des événements liés par catégorie, utilisant le même identifiant de catégorie.
  const relatedEvents = await getRelatedEventsByCategory({
    categoryId: event.category._id,
    eventId: event._id,
    page: searchParams.page as string,
  });

  // Rendu du composant, structuré en plusieurs sections pour une organisation claire.
  return (
    <>
      <section className="flex justify-center bg-primary-50 bg-dotted-pattern bg-contain">
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:max-w-7xl">
          <Image 
            src={event.imageUrl}
            alt="image de l'événement"
            width={1000}
            height={1000}
            className="h-full min-h-[300px] object-cover object-center"
          />

          <div className="flex w-full flex-col gap-8 p-5 md:p-10">
            <div className="flex flex-col gap-6">
              <h2 className='h2-bold'>{event.title}</h2>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex gap-3">
                  <p className="p-bold-20 rounded-full bg-green-500/10 px-5 py-2 text-green-700">
                    {event.isFree ? 'GRATUIT' : `${event.price}€`}
                  </p>
                  <p className="p-medium-16 rounded-full bg-grey-500/10 px-4 py-2.5 text-grey-500">
                    {event.category.name}
                  </p>
                </div>

                <p className="p-medium-18 ml-2 mt-2 sm:mt-0">
                  par{' '}
                  <span className="text-primary-500">{event.organizer.firstName} {event.organizer.lastName}</span>
                </p>
              </div>
            </div>

            {/* Bouton pour initier un achat ou inscription à l'événement. */}
            <CheckoutButton event={event} />

            <div className="flex flex-col gap-5">
              <div className='flex gap-2 md:gap-3'>
                <Image src="/assets/icons/calendar.svg" alt="calendrier" width={32} height={32} />
                <div className="p-medium-16 lg:p-regular-20 flex flex-wrap items-center">
                  <p>
                    {formatDateTime(event.startDateTime).dateOnly} - {' '}
                    {formatDateTime(event.startDateTime).timeOnly}
                  </p>
                  <p>
                    {formatDateTime(event.endDateTime).dateOnly} -  {' '}
                    {formatDateTime(event.endDateTime).timeOnly}
                  </p>
                </div>
              </div>

              <div className="p-regular-20 flex items-center gap-3">
                <Image src="/assets/icons/location.svg" alt="localisation" width={32} height={32} />
                <p className="p-medium-16 lg:p-regular-20">{event.location}</p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="p-bold-20 text-grey-600">Description</p>
              <p className="p-medium-16 lg:p-regular-18">{event.description}</p>
              <p className="p-medium-16 lg:p-regular-18 truncate text-primary-500 underline">{event.url}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section pour afficher les événements liés à la même catégorie. */}
      <section className="wrapper my-8 flex flex-col gap-8 md:gap-12">
        <h2 className="h2-bold">Les événements de la même catégorie</h2>

        <Collection 
            data={relatedEvents?.data}
            emptyTitle="Pas d'événements trouvés"
            emptyStateSubtext="Revenez plus tard"
            collectionType="All_Events"
            limit={3}
            page={searchParams.page as string}
            totalPages={relatedEvents?.totalPages}
          />
      </section>
    </>
  )
}

// Exportation du composant pour permettre son utilisation ailleurs dans l'application.
export default EventDetails;
