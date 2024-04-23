// Importation des modules nécessaires pour la gestion des webhooks.
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { createUser, deleteUser, updateUser } from '@/lib/actions/user.actions';
import { clerkClient } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

// Fonction asynchrone pour traiter les requêtes POST.
export async function POST(req: Request) {
  // Récupération du secret de webhook depuis les variables d'environnement.
  const WEBHOOK_SECRET = process.env.NEXT_CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
  }

  // Extraction des headers de la requête pour vérification du webhook.
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // Gestion des erreurs si les headers nécessaires sont absents.
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occurred -- no svix headers', { status: 400 });
  }

  // Lecture du corps de la requête.
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Instanciation d'un nouveau webhook Svix avec le secret.
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  // Vérification de la signature du webhook pour s'assurer de son authenticité.
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occurred', { status: 400 });
  }

  // Traitement des différents types d'événements de webhook.
  const { id } = evt.data;
  const eventType = evt.type;

  // Création, mise à jour, et suppression d'utilisateurs en fonction du type d'événement.
  if (eventType === 'user.created') {
    // Gestion de la création d'un nouvel utilisateur.
    const { id, email_addresses, image_url, first_name, last_name, username } = evt.data;
    const user = {
      clerkId: id,
      email: email_addresses[0].email_address,
      username: username!,
      firstName: first_name,
      lastName: last_name,
      photo: image_url,
    };
    const newUser = await createUser(user);
    if (newUser) {
      await clerkClient.users.updateUserMetadata(id, {
        publicMetadata: {
          userId: newUser._id
        }
      });
    }
    return NextResponse.json({ message: 'OK', user: newUser });
  }

  if (eventType === 'user.updated') {
    // Mise à jour des informations d'un utilisateur existant.
    const {id, image_url, first_name, last_name, username } = evt.data;
    const user = {
      firstName: first_name,
      lastName: last_name,
      username: username!,
      photo: image_url,
    };
    const updatedUser = await updateUser(id, user);
    return NextResponse.json({ message: 'OK', user: updatedUser });
  }

  if (eventType === 'user.deleted') {
    // Suppression d'un utilisateur.
    const { id } = evt.data;
    const deletedUser = await deleteUser(id!);
    return NextResponse.json({ message: 'OK', user: deletedUser });
  }

  // Réponse par défaut en cas de succès sans action spécifique.
  return new Response('', { status: 200 });
}
