// Importations nécessaires pour la gestion des callbacks, l'upload et la visualisation des images.
import { useCallback, Dispatch, SetStateAction } from 'react';
import { useDropzone } from '@uploadthing/react/hooks';
import { generateClientDropzoneAccept } from 'uploadthing/client';

import { Button } from '@/components/ui/button';
import { convertFileToUrl } from '@/lib/utils';
import Image from 'next/image';

// Définition des propriétés attendues par le composant FileUploader.
type FileUploaderProps = {
  onFieldChange: (url: string) => void;
  imageUrl: string;
  setFiles: Dispatch<SetStateAction<File[]>>;
};

export function FileUploader({ imageUrl, onFieldChange, setFiles }: FileUploaderProps) {
  // Fonction de rappel définie avec useCallback pour optimiser les performances.
  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log('Accepted files:', acceptedFiles); // Journalisation des fichiers acceptés.
    setFiles(acceptedFiles); // Mise à jour de l'état avec les fichiers acceptés.
    const url = convertFileToUrl(acceptedFiles[0]); // Conversion du premier fichier en URL.
    console.log('Generated URL:', url); // Journalisation de l'URL générée.
    onFieldChange(url); // Mise à jour du champ avec l'URL de l'image.
  }, [setFiles, onFieldChange]); // Dépendances de useCallback.

  // Configuration de useDropzone pour accepter les fichiers image.
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*' ? generateClientDropzoneAccept(['image/*']) : undefined,
  });

  // Rendu du composant avec un affichage conditionnel selon si une imageUrl est déjà présente.
  return (
    <div
      {...getRootProps()} // Propriétés pour le composant racine du dropzone.
      className="flex-center bg-dark-3 flex h-72 cursor-pointer flex-col overflow-hidden rounded-xl bg-grey-50">
      <input {...getInputProps()} className="cursor-pointer" /> 

      {imageUrl ? (
        // Affichage de l'image si imageUrl est fourni.
        <div className="flex h-full w-full flex-1 justify-center ">
          <Image
            src={imageUrl}
            alt="image"
            width={250}
            height={250}
            className="w-full object-cover object-center"
          />
        </div>
      ) : (
        // Affichage d'une interface pour l'upload si aucune imageUrl n'est présente.
        <div className="flex-center flex-col py-5 text-grey-500">
          <Image src="/assets/icons/upload.svg" width={77} height={77} alt="file upload" />
          <h3 className="mb-2 mt-2">Glisser vos photo</h3>
          <p className="p-medium-12 mb-4">SVG, PNG, JPG</p>
          <Button type="button" className="rounded-full">
            Sélectionner un fichier
          </Button>
        </div>
      )}
    </div>
  );
}
