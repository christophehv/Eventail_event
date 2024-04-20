import { authMiddleware } from "@clerk/nextjs";

// Configuration du middleware d'authentification
export default authMiddleware({
  // Liste des routes publiques accessibles sans authentification
  publicRoutes: [
    '/',                   // Accueil de l'application
    '/events/:id',         // Détails des événements, accessibles sans connexion
    '/api/webhook/clerk',  // Endpoint pour les webhooks de Clerk
    '/api/webhook/stripe', // Endpoint pour les webhooks de Stripe
    '/api/uploadthing'    // Endpoint pour les uploads génériques
  ],
  // Routes à ignorer par l'authentification, généralement pour des webhooks externes
  ignoredRoutes: [
    '/api/webhook/clerk',  // Ignorer l'authentification pour les webhooks Clerk
    '/api/webhook/stripe', // Ignorer l'authentification pour les webhooks Stripe
    '/api/uploadthing'     // Ignorer l'authentification pour les uploads
  ]
});

// Configuration supplémentaire pour le middleware d'authentification
export const config = {
  // Spécifie les chemins qui doivent correspondre à la configuration du middleware
  matcher: [
    '/((?!.+\\.[\\w]+$|_next).*)', // Exclut les fichiers et _next (chemins internes de Next.js)
    '/',                            // Route de base
    '/(api|trpc)(.*)'               // Routes pour l'API et potentiellement TRPC
  ],
};
