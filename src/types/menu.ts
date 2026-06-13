// Kontrak Tipe Data Props untuk MenuCard
export interface MenuCardProps {
  menu: {
    id: number;
    foodName: string;
    price: number;
    type: string;
    image: string;
  };
  cartState: { cartItemId: number; quantity: number } | null;
  onAdd: (menuId: number) => void;
  onUpdateQty: (cartItemId: number, newQty: number) => void;
  isAddPending: boolean;
}
