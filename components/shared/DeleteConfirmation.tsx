'use client'
// Importations nécessaires pour l'UI et les fonctionnalités de suppression.
import { useTransition } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { deleteEvent } from '@/lib/actions/event.actions';

// Définition du composant DeleteConfirmation pour confirmer la suppression d'événements.
export const DeleteConfirmation = ({ eventId }: { eventId: string }) => {
  const pathname = usePathname();
  let [isPending, startTransition] = useTransition();

  // Composant d'alerte pour la confirmation de suppression.
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        {/* // Bouton pour déclencher l'alerte de suppression. */}
        <Image src="/assets/icons/delete.svg" alt="edit" width={20} height={20} />
      </AlertDialogTrigger>

      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Voulez-vous vraiment supprimer ?</AlertDialogTitle>
          <AlertDialogDescription className="p-regular-16 text-grey-600">
            L&apos;événement sera supprimé définitivement.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>

          {/* // Bouton pour exécuter la suppression après confirmation. */}
          <AlertDialogAction
            onClick={() =>
              startTransition(async () => {
                await deleteEvent({ eventId, path: pathname })
              })
            }>
            {isPending ? 'Supprimer...' : 'Supprimer'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
