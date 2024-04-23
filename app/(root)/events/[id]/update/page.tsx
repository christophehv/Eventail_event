import EventForm from "@/components/shared/EventForm";
import { getEventById } from "@/lib/actions/event.actions";
import { auth } from "@clerk/nextjs";

// Définition des propriétés attendues par le composant UpdateEvent.
type UpdateEventProps = {
  params: {
    id: string; // Identifiant de l'événement à mettre à jour.
  }
}

// Fonction asynchrone principale du composant UpdateEvent pour la mise à jour d'un événement.
const UpdateEvent = async ({ params: { id } }: UpdateEventProps) => {
  // Récupération des informations de session utilisateur à travers Clerk.
  const { sessionClaims } = auth();

  // Extraction de l'identifiant de l'utilisateur connecté depuis les claims de la session.
  const userId = sessionClaims?.userId as string;

  // Appel asynchrone pour obtenir les détails de l'événement à partir de son identifiant.
  const event = await getEventById(id);

  // Structure JSX retournée par le composant, incluant la mise en forme et le formulaire de mise à jour.
  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left">Mettre à jour l&apos;événement</h3>
      </section>

      <div className="wrapper my-8">
        {/* Insertion du formulaire d'événement pré-rempli avec les détails pour la mise à jour. */}
        <EventForm 
          type="Update"  // Type du formulaire indiquant une opération de mise à jour.
          event={event}  // Passage de l'objet événement récupéré à EventForm.
          eventId={event._id}  // Passage de l'identifiant de l'événement à EventForm.
          userId={userId}  // Passage de l'identifiant de l'utilisateur à EventForm.
        />
      </div>
    </>
  )
}

// Exportation par défaut du composant UpdateEvent pour son utilisation dans d'autres parties de l'application.
export default UpdateEvent;
