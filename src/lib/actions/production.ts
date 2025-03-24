"use server";

import { revalidatePath } from "next/cache";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

// Schema for work order creation/update
const workOrderSchema = z.object({
  id: z.string().optional(),
  workOrderNumber: z.string().optional(),
  description: z.string().optional(),
  startDate: z.coerce.date(),
  dueDate: z.coerce.date(),
  status: z.enum([
    "PLANNED",
    "IN_PROGRESS",
    "ON_HOLD",
    "COMPLETED",
    "CANCELLED",
  ]),
  orderId: z.string().optional().nullable(),
  createdById: z.string(),
  assignedToId: z.string().optional().nullable(),
  materials: z.array(
    z.object({
      materialId: z.string(),
      quantity: z.coerce.number().min(0),
    }),
  ),
  products: z.array(
    z.object({
      productId: z.string(),
      plannedQuantity: z.coerce.number().min(1),
    }),
  ),
});

export type WorkOrderFormData = z.infer<typeof workOrderSchema>;

export async function getWorkOrders() {
  try {
    return {
      success: true,
      data: await prisma.workOrder.findMany({
        include: {
          order: true,
          createdBy: true,
          assignedTo: true,
          products: {
            include: {
              product: true,
            },
          },
          materials: {
            include: {
              material: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
    };
  } catch (error) {
    console.error("Error fetching work orders:", error);
    return {
      success: false,
      error: "Failed to fetch work orders",
    };
  }
}

export async function getWorkOrderById(id: string) {
  try {
    const workOrder = await prisma.workOrder.findUnique({
      where: { id },
      include: {
        order: true,
        createdBy: true,
        assignedTo: true,
        products: {
          include: {
            product: true,
          },
        },
        materials: {
          include: {
            material: true,
          },
        },
        processes: true,
        qualityChecks: true,
      },
    });

    if (!workOrder) {
      return {
        success: false,
        error: "Work order not found",
      };
    }

    return {
      success: true,
      data: workOrder,
    };
  } catch (error) {
    console.error(`Error fetching work order with ID ${id}:`, error);
    return {
      success: false,
      error: "Failed to fetch work order",
    };
  }
}

export async function createWorkOrder(data: WorkOrderFormData) {
  try {
    const validatedData = workOrderSchema.parse(data);

    // Generate a work order number if not provided
    const workOrderNumber =
      validatedData.workOrderNumber ||
      `WO-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`;

    const workOrder = await prisma.workOrder.create({
      data: {
        workOrderNumber,
        description: validatedData.description,
        startDate: validatedData.startDate,
        dueDate: validatedData.dueDate,
        status: validatedData.status,
        orderId: validatedData.orderId || null,
        createdById: validatedData.createdById,
        assignedToId: validatedData.assignedToId || null,
        materials: {
          create: validatedData.materials.map((material) => ({
            materialId: material.materialId,
            quantity: material.quantity,
            consumed: 0,
          })),
        },
        products: {
          create: validatedData.products.map((product) => ({
            productId: product.productId,
            plannedQuantity: product.plannedQuantity,
            producedQuantity: 0,
          })),
        },
      },
    });

    revalidatePath("/production");

    return {
      success: true,
      data: workOrder,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation failed",
        validationErrors: error.errors,
      };
    }

    console.error("Error creating work order:", error);
    return {
      success: false,
      error: "Failed to create work order",
    };
  }
}

export async function updateWorkOrderStatus(
  id: string,
  status: "PLANNED" | "IN_PROGRESS" | "ON_HOLD" | "COMPLETED" | "CANCELLED",
) {
  try {
    const workOrder = await prisma.workOrder.update({
      where: { id },
      data: {
        status,
      },
    });

    revalidatePath("/production");
    revalidatePath(`/production/${id}`);

    return {
      success: true,
      data: workOrder,
    };
  } catch (error) {
    console.error(`Error updating work order status for ID ${id}:`, error);
    return {
      success: false,
      error: "Failed to update work order status",
    };
  }
}
