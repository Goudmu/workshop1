"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useRouter } from "next/navigation";
import { IAccount } from "@/lib/mongodb/models/Account";
import { toast } from "@/components/ui/use-toast";

const FormItemComponent = ({
  cashAccount,
  inventoryAccounts,
}: {
  cashAccount: IAccount;
  inventoryAccounts: IAccount;
}) => {
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: 0,
    cost: 0,
    stock: 0,
    photo: "",
  });
  const router = useRouter();

  const handleInputChange = (e: any) => {
    const { name, value, type } = e.target;
    setNewItem({
      ...newItem,
      [name]: type === "number" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const newGeneralLedger = {
      dateGL: new Date(),
      descGL: "Buying Items",
      creditsGL: [
        {
          accountName: cashAccount.name,
          accountID: cashAccount.accountID,
          account_id: cashAccount._id,
          amount: newItem.cost * newItem.stock,
        },
      ],
      debitsGL: [
        {
          accountName: inventoryAccounts.name,
          accountID: inventoryAccounts.accountID,
          account_id: inventoryAccounts._id,
          amount: newItem.cost * newItem.stock,
        },
      ],
      typeGL: "jurnalumum",
    };
    try {
      const res = await fetch("/api/item", {
        method: "POST",
        body: JSON.stringify({
          name: newItem.name,
          description: newItem.description,
          price: newItem.price,
          cost: newItem.cost,
          stock: newItem.stock,
          photo: newItem.photo,
          dateGL: newGeneralLedger.dateGL,
          descGL: newGeneralLedger.descGL,
          debitsGL: newGeneralLedger.debitsGL,
          creditsGL: newGeneralLedger.creditsGL,
          typeGL: newGeneralLedger.typeGL,
        }),
      });
      if (res.ok) {
        toast({
          title: "Item Berhasil Ditambahkan",
        });
      }
    } catch (error: any) {
      console.log(error);
      throw new Error(error);
    } finally {
      router.refresh();
    }
    setNewItem({
      name: "",
      description: "",
      price: 0,
      cost: 0,
      stock: 0,
      photo: "",
    });
  };

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>Add New Item ?</AccordionTrigger>
        <AccordionContent>
          <Card>
            <CardHeader>
              <CardTitle>Item Form</CardTitle>
              <CardDescription>
                Enter your item information below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={newItem.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Item Description</Label>
                    <Input
                      id="description"
                      name="description"
                      type="text"
                      value={newItem.description}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Item Price</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      value={newItem.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cost">Item Cost</Label>
                    <Input
                      id="cost"
                      name="cost"
                      type="number"
                      value={newItem.cost}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock">Item Stock</Label>
                    <Input
                      id="stock"
                      name="stock"
                      type="number"
                      value={newItem.stock}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <Button type="submit">Add Account</Button>
              </form>
            </CardContent>
          </Card>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default FormItemComponent;
