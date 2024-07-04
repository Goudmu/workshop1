import CardItemComponent from "@/components/own/item/cardItem";
import FormItemComponent from "@/components/own/item/formItem";
import { GeneralLedgerForBuyingItems } from "@/lib/mongodb/actions/ItemAction";

const getItems = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}api/item`, {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const { item } = await res.json();
    return item;
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
      <CardItemComponent items={items} />
    </div>
  );
}
