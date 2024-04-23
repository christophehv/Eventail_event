// Import du composant EventForm pour réutiliser la logique de formulaire d'événement.
import EventForm from "@/components/shared/EventForm";
// Import de la bibliothèque Clerk pour la gestion de l'authentification.
import { auth } from "@clerk/nextjs";

// Composant fonctionnel pour créer un nouvel événement.
const CreateEvent = () => {
  // Récupération des informations de la session utilisateur.
  const { sessionClaims } = auth();

  // Extraction sécurisée de l'identifiant utilisateur avec optional chaining.
  const userId = sessionClaims?.userId as string;
  console.log("UserID:", userId); // Affichage de l'identifiant pour vérification.

  // Rendu du composant.
  return (
    <>
      {/* Section d'en-tête pour la création de l'événement. */}
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left">Créer un événement</h3>
      </section>

      {/* Section contenant le formulaire de création d'événement. */}
      <div className="wrapper my-8">
        <EventForm userId={userId} type="Create" />
      </div>
    </>
  )
}

// Exportation du composant pour utilisation dans d'autres parties de l'application.
export default CreateEvent;
