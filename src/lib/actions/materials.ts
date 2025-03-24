"use server";

import { revalidatePath } from "next/cache";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

// Schema for material creation/update
const materialSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "Name must be at least 3 characters"),
  type: z.string().min(1, "Type is required"),
  unit: z.string().min(1, "Unit is required"),
  currentStock: z.coerce.number().min(0, "Stock cannot be negative"),
  reorderLevel: z.coerce.number().min(0, "Reorder level cannot be negative"),
  price: z.coerce.number().min(0.01, "Price must be greater than 0"),
  supplierId: z.string().min(1, "Supplier is required"),
  description: z.string().optional(),
});

export type MaterialFormData = z.infer<typeof materialSchema>;

export async function getMaterials() {
  try {
    return {
      success: true,
      data: await prisma.material.findMany({
        include: {
          supplier: true,
        },
        orderBy: {
          name: "asc",
        },
      }),
    };
  } catch (error) {
    console.error("Error fetching materials:", error);
    return {
      success: false,
      error: "Failed to fetch materials",
    };
  }
}

export async function getMaterialById(id: string) {
  try {
    const material = await prisma.material.findUnique({
      where: { id },
      include: {
        supplier: true,
      },
    });

    if (!material) {
      return {
        success: false,
        error: "Material not found",
      };
    }

    return {
      success: true,
      data: material,
    };
  } catch (error) {
    console.error(`Error fetching material with ID ${id}:`, error);
    return {
      success: false,
      error: "Failed to fetch material",
    };
  }
}

export async function createMaterial(data: MaterialFormData) {
  try {
    const validatedData = materialSchema.parse(data);

    const material = await prisma.material.create({
      data: {
        name: validatedData.name,
        type: validatedData.type,
        unit: validatedData.unit,
        currentStock: validatedData.currentStock,
        reorderLevel: validatedData.reorderLevel,
        price: validatedData.price,
        description: validatedData.description,
        supplierId: validatedData.supplierId,
      },
    });

    revalidatePath("/raw-materials");

    return {
      success: true,
      data: material,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation failed",
        validationErrors: error.errors,
      };
    }

    console.error("Error creating material:", error);
    return {
      success: false,
      error: "Failed to create material",
    };
  }
}

export async function updateMaterial(id: string, data: MaterialFormData) {
  try {
    const validatedData = materialSchema.parse(data);

    const material = await prisma.material.update({
      where: { id },
      data: {
        name: validatedData.name,
        type: validatedData.type,
        unit: validatedData.unit,
        currentStock: validatedData.currentStock,
        reorderLevel: validatedData.reorderLevel,
        price: validatedData.price,
        description: validatedData.description,
        supplierId: validatedData.supplierId,
      },
    });

    revalidatePath("/raw-materials");
    revalidatePath(`/raw-materials/${id}`);

    return {
      success: true,
      data: material,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation failed",
        validationErrors: error.errors,
      };
    }

    console.error(`Error updating material with ID ${id}:`, error);
    return {
      success: false,
      error: "Failed to update material",
    };
  }
}

export async function deleteMaterial(id: string) {
  try {
    await prisma.material.delete({
      where: { id },
    });

    revalidatePath("/raw-materials");

    return {
      success: true,
    };
  } catch (error) {
    console.error(`Error deleting material with ID ${id}:`, error);
    return {
      success: false,
      error: "Failed to delete material",
    };
  }
}

export async function getSuppliers() {
  try {
    return {
      success: true,
      data: await prisma.supplier.findMany({
        orderBy: {
          name: "asc",
        },
      }),
    };
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    return {
      success: false,
      error: "Failed to fetch suppliers",
    };
  }
}
