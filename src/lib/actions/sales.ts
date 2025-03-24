"use server";

import { revalidatePath } from "next/cache";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

// Schema for order creation/update
const orderSchema = z.object({
  id: z.string().optional(),
  orderNumber: z.string().optional(),
  customerId: z.string(),
  deliveryDate: z.coerce.date().optional(),
  status: z.enum([
    "PENDING",
    "CONFIRMED",
    "IN_PRODUCTION",
    "READY_FOR_DELIVERY",
    "DELIVERED",
    "CANCELLED",
  ]),
  createdById: z.string(),
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.coerce.number().min(1),
      unitPrice: z.coerce.number().min(0),
    }),
  ),
});

export type OrderFormData = z.infer<typeof orderSchema>;

export async function getOrders() {
  try {
    return {
      success: true,
      data: await prisma.order.findMany({
        include: {
          customer: true,
          createdBy: true,
          items: {
            include: {
              product: true,
            },
          },
        },
        orderBy: {
          orderDate: "desc",
        },
      }),
    };
  } catch (error) {
    console.error("Error fetching orders:", error);
    return {
      success: false,
      error: "Failed to fetch orders",
    };
  }
}

export async function getOrderById(id: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        createdBy: true,
        items: {
          include: {
            product: true,
          },
        },
        workOrders: true,
      },
    });

    if (!order) {
      return {
        success: false,
        error: "Order not found",
      };
    }

    return {
      success: true,
      data: order,
    };
  } catch (error) {
    console.error(`Error fetching order with ID ${id}:`, error);
    return {
      success: false,
      error: "Failed to fetch order",
    };
  }
}

export async function createOrder(data: OrderFormData) {
  try {
    const validatedData = orderSchema.parse(data);

    // Calculate total amount
    const totalAmount = validatedData.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    );

    // Generate an order number if not provided
    const orderNumber =
      validatedData.orderNumber ||
      `ORD-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: validatedData.customerId,
        orderDate: new Date(),
        deliveryDate: validatedData.deliveryDate,
        status: validatedData.status,
        totalAmount,
        createdById: validatedData.createdById,
        items: {
          create: validatedData.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.quantity * item.unitPrice,
          })),
        },
      },
    });

    revalidatePath("/sales");

    return {
      success: true,
      data: order,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation failed",
        validationErrors: error.errors,
      };
    }

    console.error("Error creating order:", error);
    return {
      success: false,
      error: "Failed to create order",
    };
  }
}

export async function updateOrderStatus(
  id: string,
  status:
    | "PENDING"
    | "CONFIRMED"
    | "IN_PRODUCTION"
    | "READY_FOR_DELIVERY"
    | "DELIVERED"
    | "CANCELLED",
) {
  try {
    const order = await prisma.order.update({
      where: { id },
      data: {
        status,
      },
    });

    revalidatePath("/sales");
    revalidatePath(`/sales/${id}`);

    return {
      success: true,
      data: order,
    };
  } catch (error) {
    console.error(`Error updating order status for ID ${id}:`, error);
    return {
      success: false,
      error: "Failed to update order status",
    };
  }
}

export async function getCustomers() {
  try {
    return {
      success: true,
      data: await prisma.customer.findMany({
        orderBy: {
          name: "asc",
        },
      }),
    };
  } catch (error) {
    console.error("Error fetching customers:", error);
    return {
      success: false,
      error: "Failed to fetch customers",
    };
  }
}
