'use client'
// Importation des composants et fonctions nécessaires depuis les fichiers et packages correspondants.
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllCategories } from "@/lib/actions/category.actions";
import { ICategory } from "@/lib/database/models/category.model";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

// Définition du composant fonctionnel CategoryFilter pour filtrer les catégories dans l'interface utilisateur.
const CategoryFilter = () => {
  // Utilisation du hook useState pour gérer l'état local des catégories.
  const [categories, setCategories] = useState<ICategory[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Chargement initial des catégories à partir de la base de données dès le montage du composant.
  useEffect(() => {
    const getCategories = async () => {
      const categoryList = await getAllCategories();
      // Mise à jour de l'état avec la liste des catégories récupérées.
      categoryList && setCategories(categoryList as ICategory[]);
    };

    getCategories();
  }, []);

  // Gestion de la sélection d'une catégorie via le menu déroulant.
  const onSelectCategory = (category: string) => {
    let newUrl = "";

    if (category && category !== "All") {
      // Formation de la nouvelle URL avec la catégorie sélectionnée.
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "category",
        value: category,
      });
    } else {
      // Suppression du paramètre catégorie de l'URL si 'All' est sélectionné ou si aucun choix n'est fait.
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["category"],
      });
    }

    // Navigation vers la nouvelle URL sans rechargement de la page.
    router.push(newUrl, { scroll: false });
  };

  // Rendu du menu déroulant des catégories.
  return (
    <Select onValueChange={(value: string) => onSelectCategory(value)}>
      <SelectTrigger className="select-field">
        <SelectValue placeholder="Catégories" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Toutes" className="select-item p-regular-14">All</SelectItem>

        {categories.map((category) => (
          <SelectItem value={category.name} key={category._id} className="select-item p-regular-14">
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CategoryFilter;
