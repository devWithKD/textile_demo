("use client");

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updateProductStock } from "@/lib/actions/inventory";

// Form schema
const stockUpdateSchema = z.object({
  quantity: z.coerce.number().min(0, "Stock cannot be negative"),
});

interface StockUpdateFormProps {
  productId: string;
  currentStock: number;
}

export function StockUpdateForm({
  productId,
  currentStock,
}: StockUpdateFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof stockUpdateSchema>>({
    resolver: zodResolver(stockUpdateSchema),
    defaultValues: {
      quantity: currentStock,
    },
  });

  async function onSubmit(values: z.infer<typeof stockUpdateSchema>) {
    setIsSubmitting(true);

    const promise = updateProductStock(productId, values.quantity);

    toast.promise(promise, {
      loading: "Updating stock...",
      success: "Stock updated successfully",
      error: "Failed to update stock",
    });

    const result = await promise;

    setIsSubmitting(false);

    if (result.success) {
      router.refresh();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity</FormLabel>
              <FormControl>
                <Input type="number" min="0" {...field} />
              </FormControl>
              <FormDescription>
                Update the current stock level for this product.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          Update Stock
        </Button>
      </form>
    </Form>
  );
}
