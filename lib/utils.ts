// Importations des utilitaires et des types nécessaires pour la gestion des classes CSS et les paramètres URL.
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import qs from 'query-string';
import { UrlQueryParams, RemoveUrlQueryParams } from '@/types';

// Fonction pour combiner et fusionner des classes CSS avec gestion des conflits Tailwind.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Fonction pour formater les dates en différentes représentations localisées.
export const formatDateTime = (dateString: Date) => {
  // Options pour le formatage complet de date et heure.
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short',  // Nom du jour de la semaine abrégé (ex. : 'Lun')
    month: 'short',    // Nom du mois abrégé (ex. : 'Oct')
    day: 'numeric',    // Jour du mois en chiffres (ex. : '25')
    hour: 'numeric',   // Heure en format 24h (ex. : '13')
    minute: 'numeric', // Minute (ex. : '30')
    hour12: false      // Utilisation du format 24 heures
  };

  // Options pour le formatage de la date seule.
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short',  // Nom du jour de la semaine abrégé
    month: 'short',    // Nom du mois abrégé
    year: 'numeric',   // Année en chiffres (ex. : '2023')
    day: 'numeric',    // Jour du mois
  };

  // Options pour le formatage de l'heure seule.
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric',   // Heure
    minute: 'numeric', // Minute
    hour12: false      // Format 24 heures
  };

  // Formatage des différentes représentations de date et heure.
  const formattedDateTime = new Date(dateString).toLocaleString('fr-FR', dateTimeOptions);
  const formattedDate = new Date(dateString).toLocaleString('fr-FR', dateOptions);
  const formattedTime = new Date(dateString).toLocaleString('fr-FR', timeOptions);

  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

// Fonction pour convertir un objet File en URL temporaire.
export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

// Fonction pour formater un prix en format monétaire.
export const formatPrice = (price: string) => {
  const amount = parseFloat(price);
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);

  return formattedPrice;
};

// Fonction pour former une URL avec des paramètres de requête modifiés.
export function formUrlQuery({ params, key, value }: UrlQueryParams) {
  const currentUrl = qs.parse(params);
  currentUrl[key] = value;
  return qs.stringifyUrl({ url: window.location.pathname, query: currentUrl }, { skipNull: true });
};

// Fonction pour supprimer des clés spécifiques des paramètres de requête de l'URL.
export function removeKeysFromQuery({ params, keysToRemove }: RemoveUrlQueryParams) {
  const currentUrl = qs.parse(params);
  keysToRemove.forEach(key => delete currentUrl[key]);
  return qs.stringifyUrl({ url: window.location.pathname, query: currentUrl }, { skipNull: true });
};

// Fonction pour gérer les erreurs en les affichant dans la console et en lançant une exception.
export const handleError = (error: unknown) => {
  console.error(error);
  throw new Error(typeof error === 'string' ? error : JSON.stringify(error));
};
