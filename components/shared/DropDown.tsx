// Importations des composants, utilitaires, et modèles de données nécessaires.
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ICategory } from "@/lib/database/models/category.model";
import { startTransition, useEffect, useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "../ui/input";
import { createCategory, getAllCategories } from "@/lib/actions/category.actions";

// Définition des props pour DropDown avec gestion optionnelle du changement de valeur.
type DropdownProps = {
  value?: string;
  onChangeHandler?: () => void;
};

// Composant DropDown pour sélectionner ou ajouter une catégorie.
const DropDown = ({ value, onChangeHandler }: DropdownProps) => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [newCategory, setNewCategory] = useState('');

  // Fonction pour ajouter une nouvelle catégorie à la base de données et mettre à jour l'état local.
  const handleAddCategory = () => {
    createCategory({ categoryName: newCategory.trim() })
      .then((category) => {
        setCategories((prevState) => [...prevState, category]);
      });
  };

  // Charge les catégories existantes dès le montage du composant.
  useEffect(() => {
    const getCategories = async () => {
      const categoryList = await getAllCategories();
      categoryList && setCategories(categoryList as ICategory[]);
    };
    getCategories();
  }, []);

  // Rendu du composant Select avec intégration de l'AlertDialog pour ajouter une nouvelle catégorie.
  return (
    <Select onValueChange={onChangeHandler} defaultValue={value}>
      <SelectTrigger className="select-field">
        <SelectValue placeholder="Catégorie" />
      </SelectTrigger>
      <SelectContent>
        {categories.length > 0 && categories.map((category) => (
          <SelectItem key={category._id} value={category._id} className="select-item p-regular-14">
            {category.name}
          </SelectItem>
        ))}

        <AlertDialog>
          <AlertDialogTrigger className="p-medium-14 flex w-full rounded-sm py-3 pl-8 text-primary-500 hover:bg-primary-50 focus:text-primary-500">Ajouter une nouvelle catégorie</AlertDialogTrigger>
          <AlertDialogContent className="bg-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Nouvelle catégorie</AlertDialogTitle>
              <AlertDialogDescription>
                <Input type="text" placeholder="catégorie " className="input-field mt-3" onChange={(e) => setNewCategory(e.target.value)} />
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={() => startTransition(handleAddCategory)}>Ajouter</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SelectContent>
    </Select>
  );
};

export default DropDown;
