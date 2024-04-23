'use client'
// Importations nécessaires pour les images, hooks et composants UI.
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Input } from '../ui/input';
import { formUrlQuery, removeKeysFromQuery } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';

// Définition des props du composant Search, avec un placeholder par défaut.
const Search = ({ placeholder = 'Chercher un titre...' }: { placeholder?: string }) => {
  const [query, setQuery] = useState(''); // État local pour la requête de recherche.
  const router = useRouter();
  const searchParams = useSearchParams();

  // Utilisation d'un effet pour gérer la logique de débogage avec un délai.
  useEffect(() => {
    // Fonction délai pour éviter des requêtes excessives lors de la saisie de l'utilisateur.
    const delayDebounceFn = setTimeout(() => {
      let newUrl = '';

      // Création de la nouvelle URL : ajout ou suppression du paramètre de requête selon si une requête est présente.
      if (query) {
        newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: 'query',
          value: query
        });
      } else {
        newUrl = removeKeysFromQuery({
          params: searchParams.toString(),
          keysToRemove: ['query']
        });
      }

      // Navigation à la nouvelle URL sans rechargement de la page.
      router.push(newUrl, { scroll: false });
    }, 300); // Délai de 300 ms.

    // Nettoyage du timer à la désactivation de l'effet.
    return () => clearTimeout(delayDebounceFn);
  }, [query, searchParams, router]);

  // Rendu de l'interface de recherche.
  return (
    <div className="flex-center min-h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
      <Image src="/assets/icons/search.svg" alt="search" width={24} height={24} />
      <Input 
        type="text"
        placeholder={placeholder}
        onChange={(e) => setQuery(e.target.value)} // Mise à jour de l'état de la requête lors de la saisie.
        className="p-regular-16 border-0 bg-grey-50 outline-offset-0 placeholder:text-grey-500 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  );
};

export default Search;
