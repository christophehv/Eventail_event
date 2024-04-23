'use client'
// Importations nécessaires pour la navigation et la manipulation des paramètres de l'URL.
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { Button } from '../ui/button';
import { formUrlQuery } from '@/lib/utils';

// Définition des props du composant Pagination.
type PaginationProps = {
  page: number | string; // La page actuelle, peut être un numéro ou une chaîne.
  totalPages: number; // Nombre total de pages.
  urlParamName?: string; // Nom du paramètre de l'URL pour la pagination, par défaut 'page'.
};

// Composant pour gérer la navigation entre les pages d'une liste paginée.
const Pagination = ({ page, totalPages, urlParamName = 'page' }: PaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Fonction pour gérer les clics sur les boutons de pagination.
  const onClick = (btnType: string) => {
    const pageValue = btnType === 'next' 
      ? Number(page) + 1 
      : Number(page) - 1;

    // Création de la nouvelle URL en fonction de la page actuelle et du type de bouton cliqué.
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: urlParamName,
      value: pageValue.toString(),
    });

    // Navigation à la nouvelle URL sans rechargement de la page.
    router.push(newUrl, { scroll: false });
  };

  // Rendu des boutons de pagination.
  return (
    <div className="flex gap-2">
      <Button
        size="lg"
        variant="outline"
        className="w-28"
        onClick={() => onClick('prev')}
        disabled={Number(page) <= 1} // Désactivation du bouton si la première page est atteinte.
      >
        Précédent
      </Button>
      <Button
        size="lg"
        variant="outline"
        className="w-28"
        onClick={() => onClick('next')}
        disabled={Number(page) >= totalPages} // Désactivation du bouton si la dernière page est atteinte.
      >
        Suivant
      </Button>
    </div>
  );
};

export default Pagination;
