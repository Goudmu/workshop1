import GeneralLedger from "@/lib/mongodb/models/GeneralLedger";
import Item, { IItem } from "@/lib/mongodb/models/Item";
import { connectToDB } from "@/lib/mongodb/utils/connect";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (req: NextRequest) => {
  try {
    await connectToDB();
    const { name, description, price, cost, stock, photo, _id } =
      await req.json();

    console.log(cost);
    console.log(stock);

    const newItem = await Item.findByIdAndUpdate(
      { _id },
      {
        name,
        description,
        price,
        cost,
        stock,
        photo,
      }
    );
    return NextResponse.json({ newItem });
  } catch (error) {
    console.log(error);
  }
};
