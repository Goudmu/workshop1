import CardItemComponent from "@/components/own/item/cardItem";
import FormItemComponent from "@/components/own/item/formItem";
import { GeneralLedgerForBuyingItems } from "@/lib/mongodb/actions/ItemAction";
import { IItem } from "@/lib/mongodb/models/Item";

const getItems = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}api/item`, {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const { items } = await res.json();

    const fixItems = items.map((dataItem: IItem) => {
      // Initialize fullstock to 0
      dataItem.fullstock = 0;

      // Sum up the stock array to calculate fullstock
      dataItem.stock.forEach((dataStock: number) => {
        dataItem.fullstock += dataStock;
      });

      return dataItem;
    });

    return fixItems;
  } catch (error) {
    console.error("Failed to fetch items:", error);
    return []; // Return an empty array or handle the error as needed
  }
};

export default async function ItemPage() {
  const items = await getItems();
  const resdebitsCreditsGL = await GeneralLedgerForBuyingItems();
  const { cashAccount, inventoryAccounts } = await resdebitsCreditsGL?.json();

  return (
    <div>
      <FormItemComponent
        cashAccount={cashAccount}
        inventoryAccounts={inventoryAccounts}
      />
      <CardItemComponent
        items={items}
        cashAccount={cashAccount}
        inventoryAccounts={inventoryAccounts}
      />
    </div>
  );
}
