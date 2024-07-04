"use client";
import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
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
import { Button } from "@/components/ui/button";
import { TrashIcon } from "@/lib/icon/icon";
import { v4 as uuidv4 } from "uuid";
import { capitalizeFirstLetter, sortAccountsByID, uuidToId } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { IAccount } from "@/lib/mongodb/models/Account";

const FormJurnalumum = ({ trigger, setTrigger }: any) => {
  const [entries, setEntries] = useState([
    {
      id: 1,
      date: "",
      description: "",
      accountID: "",
      account_id: "",
      accountName: "",
      debitCredit: "Debit",
      amount: 0,
    },
  ]);
  const addEntry = () => {
    const uniqueId = uuidToId(uuidv4());
    setEntries([
      ...entries,
      {
        id: uniqueId,
        accountID: "",
        account_id: "",
        accountName: "",
        debitCredit: "Debit",
        amount: 0,
        date: "",
        description: "",
      },
    ]);
  };
  const [accounts, setAccounts] = useState<IAccount[]>([]);

  const getAccountsData = async () => {
    try {
      const res = await fetch(`/api/account?id=`, {
        cache: "no-store",
      });
      const { account } = await res.json();
      setAccounts(sortAccountsByID(account));
    } catch (error: any) {
      console.log(error);
      throw new Error(error);
    }
  };

  useEffect(() => {
    getAccountsData();
  }, []);

  const removeEntry = (id: any) => {
    setEntries(entries.filter((entry) => entry.id !== id));
  };
  const updateEntry = (id: any, field: any, value: any) => {
    setEntries(
      entries.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };
  const updateEntry2 = (id: any, updates: any) => {
    setEntries((prevEntries) =>
      prevEntries.map((entry) =>
        entry.id === id ? { ...entry, ...updates } : entry
      )
    );
  };
  const submitHandler = async () => {
    const debits = entries.filter((data) => data.debitCredit == "Debit");
    const credits = entries.filter((data) => data.debitCredit == "Credit");

    const res = await fetch("/api/generalLedger", {
      method: "POST",
      body: JSON.stringify({
        date: entries[0].date,
        description: entries[0].description,
        debits,
        credits,
        type: "jurnalumum",
      }),
    });
    if (res.ok) {
      toast({ title: "General Ledger Has Created" });
      setTrigger(!trigger);
      setEntries([
        {
          id: 1,
          date: "",
          description: "",
          accountID: "",
          account_id: "",
          accountName: "",
          debitCredit: "Debit",
          amount: 0,
        },
      ]);
    }
  };
  //   if (accounts.length == 0) {
  //     return <div>Loading...</div>;
  //   }
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>Add New Ledger ?</AccordionTrigger>
        <AccordionContent>
          <Card>
            <CardHeader>
              <CardTitle>General Ledger Form</CardTitle>
              <CardDescription>
                Enter your General Ledger information below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <h2 className="text-2xl font-bold">General Ledger</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={entries[0].date}
                      onChange={(e) =>
                        updateEntry(entries[0].id, "date", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={entries[0].description}
                      onChange={(e) =>
                        updateEntry(
                          entries[0].id,
                          "description",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
                <div className="grid gap-4">
                  {entries.map((entry, index) => (
                    <div key={index} className="grid grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <Label htmlFor={`accountID-${entry.id}`}>
                          Account ID
                        </Label>
                        <Input
                          id={`accountID-${entry.id}`}
                          value={
                            entry.accountID == ""
                              ? "0"
                              : accounts.filter(
                                  (data) => data._id == entry.account_id
                                )[0].accountID
                          }
                          disabled
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="balance">Account Name</Label>
                        <Select
                          value={
                            entry.accountName != ""
                              ? entry.accountName
                              : "select"
                          }
                          onValueChange={(e: any) => {
                            const account = accounts.filter(
                              (data) => data.name == e
                            )[0];
                            updateEntry2(entry.id, {
                              accountName: e,
                              account_id: account._id,
                              accountID: account.accountID,
                            });
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {accounts &&
                              accounts.map((data, index) => {
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
                      <div className="space-y-1">
                        <Label htmlFor={`debitCredit-${entry.id}`}>
                          Debit/Credit
                        </Label>
                        <Select
                          // id={`debitCredit-${entry.id}`}
                          value={entry.debitCredit}
                          onValueChange={(e: any) =>
                            updateEntry(entry.id, "debitCredit", e)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Debit">Debit</SelectItem>
                            <SelectItem value="Credit">Credit</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className=" space-y-1">
                        <div className="space-y-1">
                          <Label htmlFor={`amount-${entry.id}`}>Amount</Label>
                          <div className=" flex gap-3">
                            <div>
                              <Input
                                id={`amount-${entry.id}`}
                                type="number"
                                value={entry.amount}
                                onChange={(e) =>
                                  updateEntry(
                                    entry.id,
                                    "amount",
                                    Number(e.target.value)
                                  )
                                }
                              />
                            </div>
                            <div>
                              {index == 0 ? (
                                <Button variant="ghost" size="icon">
                                  <TrashIcon className="h-4 w-4" />
                                </Button>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeEntry(entry.id)}
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div>
                    <Button onClick={addEntry}>Add Entry</Button>
                  </div>
                  <div className=" text-end">
                    <Button onClick={submitHandler}>
                      Input General Ledger
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default FormJurnalumum;
