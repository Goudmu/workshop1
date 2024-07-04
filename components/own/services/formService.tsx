"use client";
import React, { useState } from "react";

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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

const FormServices = () => {
  const [newService, setnewService] = useState({
    description: "",
    name: "",
    price: 0,
  });
  const router = useRouter();
  const handleInputChange = (e: any) => {
    setnewService({
      ...newService,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/service", {
        method: "POST",
        body: JSON.stringify(newService),
      });
      if (res.ok) {
        toast({
          title: "Service Berhasil Ditambahkan",
        });
      }
    } catch (error: any) {
      console.log(error);
      throw new Error(error);
    } finally {
      router.refresh();
    }
    setnewService({
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
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={newService.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      name="description"
                      type="text"
                      value={newService.description}
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
                      value={newService.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <Button type="submit">Add Service</Button>
              </form>
            </CardContent>
          </Card>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default FormServices;
