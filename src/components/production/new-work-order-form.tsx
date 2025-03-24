("use client");

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Material, Product } from "@prisma/client";
import { createWorkOrder } from "@/lib/actions/production";

// Form schema
const workOrderSchema = z.object({
  description: z.string().optional(),
  startDate: z.date(),
  dueDate: z.date(),
  status: z.enum(["PLANNED", "IN_PROGRESS"]),
  materials: z
    .array(
      z.object({
        materialId: z.string(),
        quantity: z.coerce.number().min(0.1),
      }),
    )
    .min(1, "At least one material is required"),
  products: z
    .array(
      z.object({
        productId: z.string(),
        plannedQuantity: z.coerce.number().min(1),
      }),
    )
    .min(1, "At least one product is required"),
});

interface NewWorkOrderFormProps {
  materials: Material[];
  products: Product[];
}

export function NewWorkOrderForm({
  materials,
  products,
}: NewWorkOrderFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof workOrderSchema>>({
    resolver: zodResolver(workOrderSchema),
    defaultValues: {
      description: "",
      startDate: new Date(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      status: "PLANNED",
      materials: [{ materialId: "", quantity: 0 }],
      products: [{ productId: "", plannedQuantity: 1 }],
    },
  });

  async function onSubmit(values: z.infer<typeof workOrderSchema>) {
    setIsSubmitting(true);

    // Mock user ID for demo
    const createdById = "user1";

    const formData = {
      ...values,
      createdById,
    };

    const promise = createWorkOrder(formData);

    toast.promise(promise, {
      loading: "Creating work order...",
      success: "Work order created successfully",
      error: "Failed to create work order",
    });

    const result = await promise;

    setIsSubmitting(false);

    if (result.success) {
      router.push(`/production/${result.data.id}`);
    }
  }

  const addProduct = () => {
    const currentProducts = form.getValues("products");
    form.setValue("products", [
      ...currentProducts,
      { productId: "", plannedQuantity: 1 },
    ]);
  };

  const removeProduct = (index: number) => {
    const currentProducts = form.getValues("products");
    if (currentProducts.length > 1) {
      form.setValue(
        "products",
        currentProducts.filter((_, i) => i !== index),
      );
    }
  };

  const addMaterial = () => {
    const currentMaterials = form.getValues("materials");
    form.setValue("materials", [
      ...currentMaterials,
      { materialId: "", quantity: 0 },
    ]);
  };

  const removeMaterial = (index: number) => {
    const currentMaterials = form.getValues("materials");
    if (currentMaterials.length > 1) {
      form.setValue(
        "materials",
        currentMaterials.filter((_, i) => i !== index),
      );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter a description for this work order..."
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          new Date(field.value).toLocaleDateString()
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Due Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          new Date(field.value).toLocaleDateString()
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Initial Status</FormLabel>
                <Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an initial status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="PLANNED">Planned</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Accordion type="single" collapsible defaultValue="products">
          <AccordionItem value="products">
            <AccordionTrigger>Products to Produce</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                {form.watch("products").map((_, index) => (
                  <div
                    key={index}
                    className="flex items-end gap-4 border p-4 rounded-md relative"
                  >
                    {form.watch("products").length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-7 w-7"
                        onClick={() => removeProduct(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}

                    <FormField
                      control={form.control}
                      name={`products.${index}.productId`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Product</FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a product" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {products.map((product) => (
                                <SelectItem key={product.id} value={product.id}>
                                  {product.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`products.${index}.plannedQuantity`}
                      render={({ field }) => (
                        <FormItem className="w-32">
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addProduct}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Product
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="materials">
            <AccordionTrigger>Required Materials</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                {form.watch("materials").map((_, index) => (
                  <div
                    key={index}
                    className="flex items-end gap-4 border p-4 rounded-md relative"
                  >
                    {form.watch("materials").length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-7 w-7"
                        onClick={() => removeMaterial(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}

                    <FormField
                      control={form.control}
                      name={`materials.${index}.materialId`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Material</FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a material" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {materials.map((material) => (
                                <SelectItem
                                  key={material.id}
                                  value={material.id}
                                >
                                  {material.name} ({material.unit})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`materials.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem className="w-32">
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0.1"
                              step="0.1"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addMaterial}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Material
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/production")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            Create Work Order
          </Button>
        </div>
      </form>
    </Form>
  );
}
