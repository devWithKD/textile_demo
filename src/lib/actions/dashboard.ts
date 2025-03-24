"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getDashboardData() {
  try {
    // Get counts
    const materialsCount = await prisma.material.count();
    const productsCount = await prisma.product.count();
    const activeWorkOrdersCount = await prisma.workOrder.count({
      where: {
        status: {
          in: ["PLANNED", "IN_PROGRESS"],
        },
      },
    });
    const pendingOrdersCount = await prisma.order.count({
      where: {
        status: {
          in: ["PENDING", "CONFIRMED"],
        },
      },
    });

    // Get low stock materials
    const lowStockMaterials = await prisma.material.findMany({
      where: {
        currentStock: {
          lte: prisma.material.fields.reorderLevel,
        },
      },
      include: {
        supplier: true,
      },
    });

    // Get recent orders
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: {
        orderDate: "desc",
      },
      include: {
        customer: true,
      },
    });

    // Get recent activities - combining recent orders, work orders, and quality checks
    const recentWorkOrders = await prisma.workOrder.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        createdBy: true,
      },
    });

    const recentQualityChecks = await prisma.qualityCheck.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        workOrder: true,
      },
    });

    // Calculate inventory value
    const materials = await prisma.material.findMany();
    const materialValue = materials.reduce(
      (sum, material) => sum + material.currentStock * material.price,
      0,
    );

    const products = await prisma.product.findMany();
    const productValue = products.reduce(
      (sum, product) => sum + product.currentStock * product.basePrice,
      0,
    );

    const totalInventoryValue = materialValue + productValue;

    return {
      success: true,
      data: {
        counts: {
          materials: materialsCount,
          products: productsCount,
          activeWorkOrders: activeWorkOrdersCount,
          pendingOrders: pendingOrdersCount,
        },
        lowStockMaterials,
        recentOrders,
        recentWorkOrders,
        recentQualityChecks,
        inventoryValue: {
          materials: materialValue,
          products: productValue,
          total: totalInventoryValue,
        },
      },
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return {
      success: false,
      error: "Failed to fetch dashboard data",
    };
  }
}
