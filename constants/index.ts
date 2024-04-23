// Définition des liens de navigation pour l'entête, utilisables dans toute l'interface utilisateur.
export const headerLinks = [
  {
    label: 'Accueil', // Texte affiché pour le lien
    route: '/', // Chemin de la route pour la page d'accueil
  },
  {
    label: 'Créer un événement', // Texte pour le lien de création d'événement
    route: '/events/create', // Chemin vers la page de création d'événement
  },
  {
    label: 'Mon profil', // Texte pour le lien vers le profil utilisateur
    route: '/profile', // Chemin vers la page de profil
  },
];

// Définition des valeurs par défaut pour un formulaire d'événement, facilitant la réinitialisation et l'initialisation.
export const eventDefaultValues = {
  title: '', // Titre vide par défaut
  description: '', // Description vide
  location: '', // Emplacement vide
  imageUrl: '', // Aucune image par défaut
  startDateTime: new Date(), // Date de début réglée sur la date courante
  endDateTime: new Date(), // Date de fin réglée sur la date courante
  categoryId: '', // Aucune catégorie sélectionnée par défaut
  price: '', // Prix vide
  isFree: false, // Par défaut, l'événement n'est pas gratuit
  url: '', // URL vide
};
