// FILE: agrilink-backend/models/SupplierProduct.js
// PURPOSE: An agricultural input product listed by a verified supplier
// RELATIONSHIPS: belongs to User (supplier), referenced by InputRequest

const mongoose = require('mongoose');

const supplierProductSchema = new mongoose.Schema(
  {
    // ════════════════════════════════════════════════
    // SECTION 1 — OWNERSHIP
    // ════════════════════════════════════════════════

    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Supplier product must belong to a supplier'],
      // The User with role:'supplier' who created this listing
      // Their supplierDetails.isVerified must be true before they can list
    },

    // ════════════════════════════════════════════════
    // SECTION 2 — PRODUCT IDENTITY
    // ════════════════════════════════════════════════

    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [150, 'Product name cannot exceed 150 characters'],
      // Examples:
      // "Certified Tomato Seeds F1 Hybrid — 10g Packet"
      // "CAN Fertilizer (Calcium Ammonium Nitrate) 50kg Bag"
      // "Solo Knapsack Sprayer 16L"
    },

    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: {
        values: [
          'seeds',
          'fertilizers',
          'pesticides',
          'herbicides',
          'tools',
          'equipment',
          'irrigation',
          'packaging',
          'animal-feeds',
          'veterinary',
          'other',
        ],
        message: '"{VALUE}" is not a valid supplier product category',
      },
    },

    brand: {
      type: String,
      trim: true,
      // e.g. "Kenya Seed Company", "MEA Fertilizers", "Osho Chemicals"
      // Important for farmers who trust specific brands they've used before
    },

    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
      // Suppliers typically need more space than farmers because they must
      // include: active ingredients, application rates, safety precautions,
      // storage conditions, compatibility with other products, certifications
    },

    // ════════════════════════════════════════════════
    // SECTION 3 — PRICING
    // ════════════════════════════════════════════════

    pricePerUnit: {
      type: Number,
      required: [true, 'Price is required'],
      min: [1, 'Price must be at least KSh 1'],
    },

    unit: {
      type: String,
      required: [true, 'Unit is required'],
      enum: {
        values: ['kg', 'gram', 'litre', 'ml', 'piece', 'bag', 'box', 'set'],
        message: '"{VALUE}" is not a valid unit',
      },
    },

    // ════════════════════════════════════════════════
    // SECTION 4 — STOCK & AVAILABILITY
    // ════════════════════════════════════════════════

    stockQuantity: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
    },

    minimumOrderQuantity: {
      type: Number,
      default: 1,
      min: [1, 'Minimum order must be at least 1'],
      // Suppliers may set minimums: "We don't sell less than 10 bags at once"
    },

    // ════════════════════════════════════════════════
    // SECTION 5 — IMAGES
    // ════════════════════════════════════════════════

    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      },
    ],

    // ════════════════════════════════════════════════
    // SECTION 6 — TECHNICAL SPECIFICATIONS
    // ════════════════════════════════════════════════

    specifications: {
      type: Map,
      of: String,
      // Map type stores arbitrary key-value pairs without pre-defining every key.
      // WHY: Different product categories have completely different specs.
      //   Seeds: { "Maturity Days": "75", "Seed Rate": "200g/acre" }
      //   Fertilizers: { "N-P-K Ratio": "26-0-0", "Form": "Granular" }
      //   Sprayers: { "Tank Capacity": "16 litres", "Pressure": "3 bar" }
      // We can't define all these fields upfront — Map handles it elegantly.
    },

    certifications: [{ type: String }],
    // e.g. ["KEPHIS Certified", "Organic Input", "ISO 9001:2015"]
    // KEPHIS = Kenya Plant Health Inspectorate Service
    // These build trust with farmers making purchasing decisions.

    // ════════════════════════════════════════════════
    // SECTION 7 — DELIVERY LOGISTICS
    // ════════════════════════════════════════════════

    deliveryAvailable: {
      type: Boolean,
      default: true,
      // Some suppliers are depot-only (no delivery).
      // This field filters them out for farmers who need doorstep service.
    },

    deliveryAreas: [{ type: String }],
    // Counties where this supplier delivers.
    // e.g. ["Nairobi", "Kiambu", "Nakuru", "Meru"]
    // Farmers outside this list know they must arrange their own transport.

    deliveryLeadDays: {
      type: Number,
      default: 3,
      // "Orders ship within X business days"
      // Critical for planting season timing — farmer needs seeds by a specific date
    },

    // ════════════════════════════════════════════════
    // SECTION 8 — LISTING STATUS
    // ════════════════════════════════════════════════

    status: {
      type: String,
      enum: {
        values: ['active', 'out-of-stock', 'discontinued', 'pending-approval'],
        message: '"{VALUE}" is not a valid status',
      },
      default: 'pending-approval',
      // NEW LISTINGS start as 'pending-approval'.
      // An admin reviews them before they go live.
      // WHY: This prevents listing of banned pesticides, counterfeit seeds,
      // or products that haven't been approved by KEPHIS / PCPB (Pest Control
      // Products Board). This is a legal and ethical safety layer.
    },

    // ════════════════════════════════════════════════
    // SECTION 9 — ANALYTICS
    // ════════════════════════════════════════════════

    views: { type: Number, default: 0 },
    totalOrders: {
      type: Number,
      default: 0,
      // Incremented with each InputRequest for this product.
      // Powers a "Best Seller" badge on popular products.
    },
  },
  { timestamps: true }
);

// ════════════════════════════════════════════════════════════
// INDEXES
// ════════════════════════════════════════════════════════════

supplierProductSchema.index({ name: 'text', description: 'text', brand: 'text' });
supplierProductSchema.index({ category: 1 });
supplierProductSchema.index({ supplier: 1 });
supplierProductSchema.index({ status: 1 });
supplierProductSchema.index({ deliveryAreas: 1 });
// Speeds up: "Find active seed suppliers who deliver to Nakuru"

const SupplierProduct = mongoose.model('SupplierProduct', supplierProductSchema);
module.exports = SupplierProduct;