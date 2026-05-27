// FILE: agrilink-backend/models/Product.js
// PURPOSE: A produce listing posted by a farmer (tomatoes, maize, beans, etc.)
// RELATIONSHIPS: belongs to User (farmer), referenced by Order

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    // ════════════════════════════════════════════════
    // SECTION 1 — OWNERSHIP
    // ════════════════════════════════════════════════

    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      // ObjectId is MongoDB's native ID type — a 24-character hex string
      // Example: "64abc123def456789012abcd"
      // Every MongoDB document has one in its _id field automatically.
      ref: 'User',
      // ref: 'User' declares a RELATIONSHIP between Product and User.
      // This is how MongoDB handles what SQL databases call a "foreign key".
      // Later, when you query products, you can call .populate('farmer')
      // and Mongoose will automatically fetch the full User document
      // and embed it in the product result. Very powerful.
      required: [true, 'A product must belong to a farmer'],
    },

    // ════════════════════════════════════════════════
    // SECTION 2 — PRODUCT IDENTITY
    // ════════════════════════════════════════════════

    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [100, 'Product name cannot exceed 100 characters'],
      // Examples: "Fresh Tomatoes", "Grade A Maize", "Organic Sukuma Wiki"
    },

    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: {
        values: [
          'vegetables',
          'fruits',
          'grains',
          'legumes',
          'dairy',
          'poultry',
          'livestock',
          'herbs',
          'other',
        ],
        message: '"{VALUE}" is not a recognised category',
      },
      // WHY enum for category:
      // If farmers could type any category, your database would have:
      // "tomatoes", "Tomato", "TOMATOES", "Tomatoe", "tmt"
      // All meaning the same thing but impossible to filter cleanly.
      // With enum, every vegetable is exactly "vegetables". Filter works perfectly.
    },

    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      // Optional but encouraged — farmer can describe:
      // quality grade, farming method (organic?), current condition, etc.
    },

    // ════════════════════════════════════════════════
    // SECTION 3 — PRICING
    // ════════════════════════════════════════════════

    pricePerUnit: {
      type: Number,
      required: [true, 'Price per unit is required'],
      min: [1, 'Price must be at least KSh 1'],
      // Stored in Kenyan Shillings (KES) as a whole number
      // e.g. 80 means KSh 80 per unit
    },

    unit: {
      type: String,
      required: [true, 'Unit of measurement is required'],
      enum: {
        values: ['kg', 'gram', 'tonne', 'litre', 'piece', 'crate', 'bag', 'bundle'],
        message: '"{VALUE}" is not a valid unit of measurement',
      },
      // WHY unit is required alongside price:
      // "KSh 80" means nothing without context.
      // "KSh 80 per kg" is completely clear.
      // Pairing pricePerUnit + unit gives a complete, unambiguous price.
    },

    // ════════════════════════════════════════════════
    // SECTION 4 — STOCK MANAGEMENT
    // ════════════════════════════════════════════════

    quantityAvailable: {
      type: Number,
      required: [true, 'Quantity available is required'],
      min: [0, 'Quantity cannot be negative'],
      // When a buyer places an order, your Order controller will subtract
      // the ordered quantity from this number.
      // When it reaches 0, status auto-updates to 'sold-out'.
    },

    minimumOrderQuantity: {
      type: Number,
      default: 1,
      min: [1, 'Minimum order must be at least 1'],
      // Allows farmers to say: "I only sell in lots of 50 kg minimum"
      // Prevents tiny orders that aren't worth harvesting and packing for.
    },

    // ════════════════════════════════════════════════
    // SECTION 5 — IMAGES
    // ════════════════════════════════════════════════

    images: [
      {
        url: {
          type: String,
          required: true,
          // Full Cloudinary URL: "https://res.cloudinary.com/agrilink/..."
          // This is what you put in an <img src="..."> tag in React
        },
        publicId: {
          type: String,
          required: true,
          // Cloudinary's internal identifier for this image
          // You MUST store this to be able to DELETE the image later
          // Without publicId, deleted listings leave orphaned images
          // on your Cloudinary account forever, wasting your free quota
        },
      },
    ],
    // WHY an array of objects rather than just a single image URL:
    // Farmers benefit from showing multiple angles of their produce.
    // Each image needs BOTH pieces of data (url for display, publicId for deletion).

    // ════════════════════════════════════════════════
    // SECTION 6 — LOCATION & FRESHNESS
    // ════════════════════════════════════════════════

    harvestLocation: {
      county: {
        type: String,
        required: [true, 'County of harvest is required'],
        trim: true,
        // Critical for buyers: a Nairobi buyer wants to know if
        // produce is from Kiambu (30 mins away, very fresh) or
        // Kisumu (7 hours away, significant transport time)
      },
      town: {
        type: String,
        trim: true,
      },
    },

    harvestDate: {
      type: Date,
      // When was this crop harvested?
      // Buyers can calculate: "harvested 2 days ago — still fresh"
    },

    expiryDate: {
      type: Date,
      // Critical for perishables: tomatoes, milk, leafy greens
      // Your UI should show a warning if expiryDate is within 3 days
      // You can run a scheduled job to auto-hide expired listings
    },

    // ════════════════════════════════════════════════
    // SECTION 7 — LISTING STATUS (the state machine)
    // ════════════════════════════════════════════════

    status: {
      type: String,
      enum: {
        values: ['active', 'sold-out', 'paused', 'deleted'],
        message: '"{VALUE}" is not a valid product status',
      },
      default: 'active',
      // WHAT EACH STATUS MEANS:
      // active    → visible on the marketplace, buyers can order
      // sold-out  → quantity hit 0; system auto-sets this
      // paused    → farmer temporarily hides listing (harvest not ready yet)
      // deleted   → "soft delete" — hidden from marketplace but data preserved
      //             You need the data to remain for existing order records
      //             Hard deleting a product would break any order that references it
    },

    // ════════════════════════════════════════════════
    // SECTION 8 — ANALYTICS
    // ════════════════════════════════════════════════

    views: {
      type: Number,
      default: 0,
      // Increment this every time someone opens this listing's detail page.
      // Powers your farmer dashboard: "Your tomatoes were viewed 47 times this week"
    },

    isFeatured: {
      type: Boolean,
      default: false,
      // Admin can mark top-quality listings as featured for homepage display.
    },
  },
  { timestamps: true }
);

// ════════════════════════════════════════════════════════════
// INDEXES — Speeding Up Database Queries
// ════════════════════════════════════════════════════════════
// An index in MongoDB works exactly like an index in a textbook:
// instead of reading every page to find "Maize", you jump directly to it.
// Without indexes, MongoDB scans EVERY document for every query — fine for
// 100 products, very slow for 10,000 products.

productSchema.index({ name: 'text', description: 'text' });
// Creates a FULL-TEXT SEARCH index on name and description.
// Enables: Product.find({ $text: { $search: "organic tomato" } })
// This powers your search bar in the marketplace.

productSchema.index({ category: 1 });
// 1 = sort ascending. Speeds up: Product.find({ category: 'vegetables' })
// Every time a buyer clicks "Vegetables" filter, this index fires.

productSchema.index({ 'harvestLocation.county': 1 });
// Speeds up: Product.find({ 'harvestLocation.county': 'Nakuru' })
// Note the dot notation for nested object fields — this is correct MongoDB syntax.

productSchema.index({ status: 1 });
// Speeds up: Product.find({ status: 'active' })
// This query runs on EVERY marketplace page load — fast index is essential.

productSchema.index({ farmer: 1 });
// Speeds up: Product.find({ farmer: someUserId })
// Used when a farmer views "My Listings" dashboard.

const Product = mongoose.model('Product', productSchema);
module.exports = Product;