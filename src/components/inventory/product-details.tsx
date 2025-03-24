import { Product } from "@prisma/client";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { Package } from "lucide-react";

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="aspect-square relative rounded-md overflow-hidden border">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <Package className="h-24 w-24 text-muted-foreground" />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-1">Category</h4>
            <p>{product.category}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-1">SKU</h4>
            <p>{product.sku}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-1">Base Price</h4>
            <p className="text-lg font-semibold">
              {formatCurrency(product.basePrice)}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-1">Current Stock</h4>
            <p className="text-lg font-semibold">
              {product.currentStock} units
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-1">Total Value</h4>
            <p>{formatCurrency(product.basePrice * product.currentStock)}</p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-1">Description</h4>
        <p className="text-sm text-muted-foreground">
          {product.description || "No description available."}
        </p>
      </div>
    </div>
  );
}
