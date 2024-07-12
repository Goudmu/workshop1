"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { revalidateAll } from "@/lib/action";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Username must be at least 2 characters.",
  }),
  description: z.string().min(1, {
    message: "Username must be at least 2 characters.",
  }),
  price: z.coerce.number().min(0, {
    message: "Username must be at least 2 characters.",
  }),
});

const FormServices = () => {
  const newServiceForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
    },
  });

  const router = useRouter();
  const isLoading = newServiceForm.formState.isSubmitting;

  const newServiceFormSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await fetch("/api/service", {
        method: "POST",
        body: JSON.stringify(values),
      });
      if (res.ok) {
        toast({
          title: "Service Berhasil Ditambahkan",
        });
        newServiceForm.reset();
      }
    } catch (error: any) {
      console.log(error);
      throw new Error(error);
    } finally {
      router.refresh();
    }
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
              <Form {...newServiceForm}>
                <form
                  onSubmit={newServiceForm.handleSubmit(newServiceFormSubmit)}
                  className="grid gap-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={newServiceForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Input Name of Service"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            This is your name of service.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={newServiceForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Input Description of Service"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            This is your description of service.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={newServiceForm.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Input Price of Service"
                              {...field}
                              type="number"
                            />
                          </FormControl>
                          <FormDescription>
                            This is your price of service.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="submit">Submit</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default FormServices;
