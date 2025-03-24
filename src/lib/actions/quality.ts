"use server";

import { revalidatePath } from "next/cache";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

// Schema for quality check creation/update
const qualityCheckSchema = z.object({
  id: z.string().optional(),
  workOrderId: z.string(),
  checkpoint: z.string(),
  passed: z.boolean(),
  notes: z.string().optional(),
  imageUrl: z.string().optional(),
});

export type QualityCheckFormData = z.infer<typeof qualityCheckSchema>;

export async function getQualityChecks() {
  try {
    return {
      success: true,
      data: await prisma.qualityCheck.findMany({
        include: {
          workOrder: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
    };
  } catch (error) {
    console.error("Error fetching quality checks:", error);
    return {
      success: false,
      error: "Failed to fetch quality checks",
    };
  }
}

export async function createQualityCheck(data: QualityCheckFormData) {
  try {
    const validatedData = qualityCheckSchema.parse(data);

    const qualityCheck = await prisma.qualityCheck.create({
      data: {
        workOrderId: validatedData.workOrderId,
        checkpoint: validatedData.checkpoint,
        passed: validatedData.passed,
        notes: validatedData.notes,
        imageUrl: validatedData.imageUrl,
      },
    });

    revalidatePath("/quality");
    revalidatePath(`/production/${validatedData.workOrderId}`);

    return {
      success: true,
      data: qualityCheck,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation failed",
        validationErrors: error.errors,
      };
    }

    console.error("Error creating quality check:", error);
    return {
      success: false,
      error: "Failed to create quality check",
    };
  }
}
