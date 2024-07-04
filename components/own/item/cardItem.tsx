"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { IItem } from "@/lib/mongodb/models/Item";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const CardItemComponent = ({ items = [] }: { items: IItem[] }) => {
  const { toast } = useToast();

  const soldHandler = async (itemUpdate: IItem) => {
    itemUpdate.stock -= 1;
    try {
      const res = await fetch("/api/item", {
        method: "PUT",
        body: JSON.stringify(itemUpdate),
      });
      if (res.ok) {
        toast({
          title: `One Item ${itemUpdate.name} has been Sold`,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (items.length == 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid md:grid-cols-3 gap-8 items-start max-w-6xl mx-auto py-8 px-4">
      {items.map((item: IItem, index) => (
        <div
          key={index}
          className="relative overflow-hidden rounded-lg shadow-lg"
        >
          <div className="absolute top-4 right-4">
            <Badge
              variant={
                item.stock > 10
                  ? "default"
                  : item.stock > 0
                  ? "secondary"
                  : "destructive"
              }
              className="text-sm font-medium"
            >
              {item.stock > 10
                ? "In Stock"
                : item.stock > 0
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
                <p className="text-2xl font-bold">{item.stock}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-4">
              <Button
                size="lg"
                disabled={item.stock == 0 ? true : false}
                onClick={() => soldHandler(item)}
              >
                Customer Buy This
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardItemComponent;
