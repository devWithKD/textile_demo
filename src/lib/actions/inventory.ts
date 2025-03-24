"use server";

import { revalidatePath } from "next/cache";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getProducts() {
  try {
    return {
      success: true,
      data: await prisma.product.findMany({
        orderBy: {
          name: "asc",
        },
      }),
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      success: false,
      error: "Failed to fetch products",
    };
  }
}

export async function getProductById(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return {
        success: false,
        error: "Product not found",
      };
    }

    return {
      success: true,
      data: product,
    };
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    return {
      success: false,
      error: "Failed to fetch product",
    };
  }
}

export async function updateProductStock(id: string, quantity: number) {
  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        currentStock: quantity,
      },
    });

    revalidatePath("/inventory");
    revalidatePath(`/inventory/${id}`);

    return {
      success: true,
      data: product,
    };
  } catch (error) {
    console.error(`Error updating product stock for ID ${id}:`, error);
    return {
      success: false,
      error: "Failed to update product stock",
    };
  }
}
