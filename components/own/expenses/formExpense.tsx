"use client";
import React, { useEffect, useState } from "react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { IAccount } from "@/lib/mongodb/models/Account";
import { capitalizeFirstLetter } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { revalidateAll } from "@/lib/action";

const FormExpenses = ({
  expenses,
  cashAccount,
}: {
  expenses: IAccount[];
  cashAccount: IAccount;
}) => {
  const [newExpenseTransaction, setnewExpenseTransaction] = useState({
    description: "",
    name: "",
    price: 0,
  });
  const { toast } = useToast();
  const router = useRouter();

  const handleInputChange = (e: any) => {
    const { name, value, type } = e.target;
    setnewExpenseTransaction({
      ...newExpenseTransaction,
      [name]: type === "number" ? Number(value) : value,
    });
  };
  const handleSelectChange = (value: string) => {
    setnewExpenseTransaction((prevTransaction) => ({
      ...prevTransaction,
      name: value,
    }));
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const expenseAccount = expenses.filter(
      (data) => data.name == newExpenseTransaction.name
    )[0];

    const newGeneralLedger = {
      dateGL: new Date(),
      descGL: `Cost Expense for ${expenseAccount.name}`,
      creditsGL: [
        {
          accountName: cashAccount.name,
          accountID: cashAccount.accountID,
          account_id: cashAccount._id,
          amount: newExpenseTransaction.price,
        },
      ],
      debitsGL: [
        {
          accountName: expenseAccount.name,
          accountID: expenseAccount.accountID,
          account_id: expenseAccount._id,
          amount: newExpenseTransaction.price,
        },
      ],
      typeGL: "jurnalumum",
    };

    try {
      const res = await fetch("/api/generalLedger", {
        method: "POST",
        body: JSON.stringify({
          date: newGeneralLedger.dateGL,
          description: newGeneralLedger.descGL,
          debits: newGeneralLedger.debitsGL,
          credits: newGeneralLedger.creditsGL,
          type: newGeneralLedger.typeGL,
        }),
      });
      if (res.ok) {
        toast({
          title: "Expense Berhasil Ditambahkan",
        });
        // VERCEL
        await revalidateAll();
        router.push("/jurnalumum");
      }
    } catch (error: any) {
      console.log(error);
      throw new Error(error);
    } finally {
      router.refresh();
    }
    setnewExpenseTransaction({
      description: "",
      name: "",
      price: 0,
    });
  };

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>Add New Service ?</AccordionTrigger>
        <AccordionContent>
          <Card>
            <CardHeader>
              <CardTitle>Service Form</CardTitle>
              <CardDescription>
                Enter your service information below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="balance">Account Name</Label>
                    <Select
                      value={
                        newExpenseTransaction.name !== ""
                          ? newExpenseTransaction.name
                          : "select"
                      }
                      onValueChange={handleSelectChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {expenses &&
                          expenses.map((data, index) => {
                            return (
                              <SelectItem
                                key={index}
                                value={data.name}
                                id={data.accountID}
                              >
                                {capitalizeFirstLetter(data.name)}
                              </SelectItem>
                            );
                          })}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      name="description"
                      type="text"
                      value={newExpenseTransaction.description}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      value={newExpenseTransaction.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <Button type="submit">Add Expenses</Button>
              </form>
            </CardContent>
          </Card>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default FormExpenses;
