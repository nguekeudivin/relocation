# Table dynamique

L'idee ici c'est de cree un affichage dynamique. Donnant la possibilite a l'utilisateur de definir les attributs qu'il aimerais afficher. Ce systeme repose sur 2 componantes:

- `getAttributes`: Une fonction qui retourne une list d'attribute qui peuvent etre afficher pour la resource. La resource c'est un object avec des sous membres. Et chaque sous membres represente en quelque sorte une relation avec une autre resource ou un autre model. Cette fonction est utiliser pour objectifs : Identifier la liste des attributes affiches ( les cles) et comment recuperer ou calculer ces attributs. Ainsi les attributs ne sont pas directement celle representent dans la base de donnees de l'application ou celle recu au niveau de l'api. Elles peut etre calculer ou bien le resultat d'une formattage particulier.

- `TableColumns`: Ensuite une fonction qui retourne la structure d'une ligne de la table. C'est la fonction qui va en quelque sorte formatter la ligne de la table. Elle va retourne un table constituer de toute les columns.

Prenons l'example the `SaleReturn` definit comme suit avec toutes les interfaces impliquees:

```js
export interface SaleReturn {
  id: string;
  order_id: string;
  sale_id: string;
  stock_batch_id: string;
  product_id: string;
  quantity: number;
  amount: number;
  reason: string;
  finance_account_id: string;
  payment_method: string;
  status: string;
  created_at: string;
  updated_at: string;
  order: Order;
  sale: Sale;
  stock_batch: StockBatch;
  product: Product;
  financeAccount: FinanceAccount;
  transactions: FinanceTransaction[];
  debts: FinanceDebt[];
}
export interface Order {
  id: string;
  status: string;
  delivery_status: string;
  delivery_fee: number;
  discount: number;
  tax: number;
  shop_id: string;
  customer_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  shop: Shop;
  customer: Customer;
  user: User;
  sales: Sale[];
  transactions: FinanceTransaction[];
  debts: FinanceDebt[];
  customerName: string;
}

export interface Customer {
  id: number;
  name: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  address: string;
  city: string;
  region: string;
  country: string;
  debtAmount: string;
  date_of_birth: string | null;
  owing: number;
  segment_id: number | null;
  business_id: number | null;
  shop_id: number | null;
  type: string;
  business?: Business;
  shop?: Shop;
  orders?: Order[];
  created_at?: string;
  updated_at?: string;
}
export interface StockBatch {
  id: string;
  supplier_id?: string;
  warehouse_id?: string;
  shop_id?: string;
  product_id: string;
  unit_price: number;
  quantity: number;
  quantity_adjusted: number;
  quantity_transfer_in: number;
  quantity_transfer_out: number;
  quantity_sold: number;
  quantity_sale_return: number;
  quantity_supply_return: number;
  batch_code?: string;
  expiry_date?: string;
  manufacturing_date: string;
  description: string;
  created_at?: string;
  updated_at?: string;
  warehouse: Warehouse;
  supplier: Supplier;
  shop: Shop;
  product: Product;
  quantities: StockQuantity[];
  transactions: FinanceTransaction[];
  debts: FinanceDebt[];
}
export interface Product {
  id: string;
  name: string;
  sku?: string;
  description: string;
  category_id: string;
  type_id: string;
  featured_image: Asset;
  images: Asset[];
  quantity: number;
  selling_price: number;
  status: string;
  shopid: string;
  product_id: string;
  purchase_price: number;
  reorder_point: number;
  minimum_stock_level: number;
  maximum_stock_level: number;
  valuation_method: string;
  has_expiry_date: boolean;
  has_batch_tracking: boolean;
  created_at: string;
  updated_at: string;
  category: Category;
  shop: Shop;
  stock_batches: StockBatch[];
}

export interface Sale {
  id: string;
  order_id: string;
  stock_batch_id: string;
  product_id: string;
  quantity: number;
  selling_price: number;
  product_price_id: number;
  created_at: string;
  updated_at: string;
  stock_batch: StockBatch;
  product: Product;
  product_price: ProductPrice;
}
```

Voici le resultant.
Les informations sont generees en tenant compte des processus metiers. Techniquement on peut afficher toutes les combinaisons possibles. Mais on ne prendra en compte que les informations qui seront importantes pour l'utilisateur.

```js
const getAttributes = () => ({
  "Customer Name": saleReturn.order.customer.name,
  "Order Id": saleReturn.order_id,
  "Sale Id": saleReturn.sale_id,
  "Stock batch id": saleReturn.stock_batch.id,
  "Product id": saleReturn.product_id,
  "Product Name": saleReturn.product.name,
  "Created at": saleReturn.created_at,
  Quantity: saleReturn.quantity,
  "Refunded Amount": saleReturn.quantity,
  Refundable: saleReturn.quantity * saleReturn.sale.selling_price,
  Status: saleReturn.status,
  Reason: saleReturn.reason,
});

export const SaleReturnTableColumns = ({
  onDelete,
  onEdit,
}: {
  onDelete?: any,
  onEdit?: any,
}) => {
  const { t, formatDate } = useTranslate();
  const store = useAppStore();

  return [
    {
      header: t("ID"),
      name: "id",
      row: (saleReturn: SaleReturn) => (
        <div
          onClick={() => {
            onEdit(saleReturn);
          }}
          className="cursor-pointer hover:text-blue-800 hover:underline w-[150px] flex items-center justify-between truncate copy-clipboard-parent"
        >
          <span className="truncate">{saleReturn.id}</span>
          <button
            className="ml-2 flex-shrink-0 copy-clipboard hidden"
            onClick={async (e) => {
              await navigator.clipboard.writeText(saleReturn.id);
              store.display.show("clipboard");
            }}
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      ),
    },
    {
      header: t("Created At"),
      name: "created_at",
      row: (saleReturn: SaleReturn) => (
        <span>{formatDate(saleReturn.created_at, "d MMM yyyy, HH:mm")}</span>
      ),
    },
    {
      header: t("Order ID"),
      name: "order_id",
      row: (saleReturn: SaleReturn) => (
        <p className="cursor-pointer hover:text-blue-800 hover:underline w-[150px] flex items-center justify-between truncate copy-clipboard-parent">
          <span className="truncate">{saleReturn.order_id}</span>
          <button
            className="ml-2 flex-shrink-0 copy-clipboard hidden"
            onClick={async (e) => {
              await navigator.clipboard.writeText(saleReturn.order_id);
              store.display.show("clipboard");
            }}
          >
            <Copy className="w-4 h-4" />
          </button>
        </p>
      ),
    },
    {
      header: t("Product"),
      name: "quantity",
      row: (saleReturn: SaleReturn) => (
        <p className="">
          {saleReturn.product?.name} (x{saleReturn.quantity})
        </p>
      ),
    },
    {
      header: t("Refundable"),
      name: "refundable",
      row: (saleReturn: SaleReturn) => (
        <span>{saleReturn.quantity * saleReturn.sale.selling_price}</span>
      ),
    },
    {
      header: t("Amount"),
      name: "amount",
      row: (saleReturn: SaleReturn) => <span>{saleReturn.amount}</span>,
    },
    {
      header: t("Status"),
      name: "status",
      row: (saleReturn: SaleReturn) => (
        <span
          className={cn(
            "rounded-full px-2 py-1 text-sm",
            SaleReturnStatusColors[saleReturn.status]
          )}
        >
          {t(SaleReturnStatusMap[saleReturn.status])}
        </span>
      ),
    },
    {
      header: t("Actions"),
      name: "actions",
      row: (saleReturn: SaleReturn) => (
        <TableActions
          item={saleReturn}
          resourceName="SaleReturns"
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ),
    },
  ];
};
```
