"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { IAccount } from "@/lib/mongodb/models/Account";
import { IItem } from "@/lib/mongodb/models/Item";

import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const CardItemComponent = ({
  items = [],
  cashAccount,
  inventoryAccounts,
}: {
  items: IItem[];
  cashAccount: IAccount;
  inventoryAccounts: IAccount;
}) => {
  const [newStock, setNewStock] = useState({
    name: "",
    description: "",
    price: 0,
    cost: 0,
    stock: 0,
    photo: "",
  });
  const { toast } = useToast();
  const router = useRouter();

  const soldHandler = async (itemUpdate: IItem) => {
    let arrayIndex = 0;
    let fixItemUpdate = itemUpdate;
    for (let i = 0; i < fixItemUpdate.stock.length; i++) {
      if (fixItemUpdate.stock[i] > 0) {
        fixItemUpdate.stock[i] -= 1;
        arrayIndex = i;
        break;
      }
    }

    const newGeneralLedger = {
      dateGL: new Date(),
      descGL: `Sold ${itemUpdate.name}`,
      creditsGL: [
        {
          accountName: "Items Revenue",
          accountID: "4200",
          account_id: "6680d6b460481f583ebd21ac",
          amount: itemUpdate.price,
        },
        {
          accountName: inventoryAccounts.name,
          accountID: inventoryAccounts.accountID,
          account_id: inventoryAccounts._id,
          amount: fixItemUpdate.cost[arrayIndex],
        },
      ],
      debitsGL: [
        {
          accountName: cashAccount.name,
          accountID: cashAccount.accountID,
          account_id: cashAccount._id,
          amount: itemUpdate.price,
        },
        {
          accountName: "COGS",
          accountID: "5100",
          account_id: "6680d6be60481f583ebd21af",
          amount: fixItemUpdate.cost[arrayIndex],
        },
      ],
      typeGL: "jurnalumum",
    };

    try {
      const res = await fetch("/api/item", {
        method: "PUT",
        body: JSON.stringify({
          dateGL: newGeneralLedger.dateGL,
          descGL: newGeneralLedger.descGL,
          debitsGL: newGeneralLedger.debitsGL,
          creditsGL: newGeneralLedger.creditsGL,
          typeGL: newGeneralLedger.typeGL,
          name: fixItemUpdate.name,
          description: fixItemUpdate.description,
          price: fixItemUpdate.price,
          cost: fixItemUpdate.cost,
          stock: fixItemUpdate.stock,
          photo: fixItemUpdate.photo,
          _id: fixItemUpdate._id,
        }),
      });
      if (res.ok) {
        toast({
          title: `One Item ${itemUpdate.name} has been Sold`,
        });
        router.push("/jurnalumum");
      }
    } catch (error) {
      console.log(error);
    } finally {
      router.refresh();
    }
  };

  const handleAddStock = (e: any) => {
    const { name, value, type } = e.target;
    setNewStock({
      ...newStock,
      [name]: type === "number" ? Number(value) : value,
    });
  };

  const handleSubmitAddStock = async (e: any, item: IItem) => {
    e.preventDefault();

    const newItem = item;
    newItem.cost.push(newStock.cost);
    newItem.stock.push(newStock.stock);

    const newGeneralLedger = {
      dateGL: new Date(),
      descGL: `Add ${newStock.stock} stock for ${item.name}`,
      creditsGL: [
        {
          accountName: cashAccount.name,
          accountID: cashAccount.accountID,
          account_id: cashAccount._id,
          amount: newStock.cost * newStock.stock,
        },
      ],
      debitsGL: [
        {
          accountName: inventoryAccounts.name,
          accountID: inventoryAccounts.accountID,
          account_id: inventoryAccounts._id,
          amount: newStock.cost * newStock.stock,
        },
      ],
      typeGL: "jurnalumum",
    };

    try {
      const res = await fetch("/api/item", {
        method: "PUT",
        body: JSON.stringify({
          name: newItem.name,
          description: newItem.description,
          price: newItem.price,
          cost: newItem.cost,
          stock: newItem.stock,
          photo: newItem.photo,
          _id: newItem._id,
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
        router.push("/jurnalumum");
      }
    } catch (error: any) {
      console.log(error);
      throw new Error(error);
    } finally {
      router.refresh();
    }
    setNewStock({
      name: "",
      description: "",
      price: 0,
      cost: 0,
      stock: 0,
      photo: "",
    });
  };

  if (items.length == 0) {
    return <div>0 Item</div>;
  }

  return (
    <div className="grid md:grid-cols-3 gap-8 items-start mx-auto py-8 px-4">
      {items.map((item: IItem, index) => (
        <div
          key={index}
          className="relative overflow-hidden rounded-lg shadow-lg"
        >
          <div className="absolute top-4 right-4">
            <Badge
              variant={
                item.fullstock > 10
                  ? "default"
                  : item.fullstock > 0
                  ? "secondary"
                  : "destructive"
              }
              className="text-sm font-medium"
            >
              {item.fullstock > 10
                ? "In Stock"
                : item.fullstock > 0
                ? "Low on Stock"
                : "Out of Stock"}
            </Badge>
          </div>
          <div className="p-4 bg-background">
            <h3 className="text-xl font-bold">{item.name}</h3>
            <p className="text-muted-foreground text-sm">{item.description}</p>
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-sm text-muted-foreground">Price</p>
                <p className="text-2xl font-bold">
                  {new Intl.NumberFormat("id", {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0,
                  }).format(item.price)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Stock</p>
                <p className="text-2xl font-bold">{item.fullstock}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4">
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger>Add New Stock ?</AccordionTrigger>
                  <AccordionContent>
                    <Card>
                      <CardHeader>
                        <CardTitle>New Stock</CardTitle>
                        <CardDescription>Add your stock</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form
                          className="grid gap-4"
                          onSubmit={(e) => handleSubmitAddStock(e, item)}
                        >
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="cost">Item Cost</Label>
                              <Input
                                id="cost"
                                name="cost"
                                type="number"
                                value={newStock.cost}
                                onChange={handleAddStock}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="stock">Item Stock</Label>
                              <Input
                                id="stock"
                                name="stock"
                                type="number"
                                value={newStock.stock}
                                onChange={handleAddStock}
                                required
                              />
                            </div>
                          </div>
                          <Button type="submit">Add Stock</Button>
                        </form>
                      </CardContent>
                    </Card>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            <Button
              size="sm"
              disabled={item.fullstock == 0 ? true : false}
              onClick={() => soldHandler(item)}
              className=" w-full"
            >
              Customer Buy This
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardItemComponent;
