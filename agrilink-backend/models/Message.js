// FILE: agrilink-backend/models/Message.js
// PURPOSE: Individual messages in a conversation between two users
// RELATIONSHIPS: references User (sender), User (receiver), optionally Order and Product

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    // ════════════════════════════════════════════════
    // SECTION 1 — WHO IS TALKING TO WHOM
    // ════════════════════════════════════════════════

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Message must have a sender'],
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Message must have a receiver'],
    },

    // ════════════════════════════════════════════════
    // SECTION 2 — CONVERSATION GROUPING
    // ════════════════════════════════════════════════

    conversationId: {
      type: String,
      required: true,
      index: true,
      // THIS IS THE KEY TO YOUR ENTIRE MESSAGING SYSTEM.
      //
      // Problem: How do you group all messages between User A and User B
      // into one conversation, regardless of who sent each message?
      //
      // Solution: Create a deterministic ID by sorting both user IDs
      // alphabetically and joining them with an underscore.
      //
      // Example:
      //   User A ID: "AAA111"
      //   User B ID: "ZZZ999"
      //   Sort them: ["AAA111", "ZZZ999"] (already alphabetical)
      //   conversationId = "AAA111_ZZZ999"
      //
      // Now BOTH directions of messages get the same conversationId:
      //   A sends to B → conversationId: "AAA111_ZZZ999"
      //   B replies to A → conversationId: "AAA111_ZZZ999" (same!)
      //
      // Query ALL messages in a conversation: Message.find({ conversationId: "AAA111_ZZZ999" })
      //
      // You will generate this in your messageController like this:
      //   const ids = [senderId, receiverId].sort();
      //   const conversationId = ids.join('_');
    },

    // ════════════════════════════════════════════════
    // SECTION 3 — MESSAGE CONTENT
    // ════════════════════════════════════════════════

    content: {
      type: String,
      required: [true, 'Message content cannot be empty'],
      trim: true,
      maxlength: [2000, 'Message cannot exceed 2000 characters'],
    },

    messageType: {
      type: String,
      enum: {
        values: ['text', 'image', 'order-reference'],
        message: '"{VALUE}" is not a valid message type',
      },
      default: 'text',
      // text            → a regular typed message
      // image           → user sent a photo (url stored in attachmentUrl)
      // order-reference → a system-generated message linking to an Order
      //                   e.g. "Buyer has placed Order #12345 for your tomatoes"
      //                   Clicking it opens the order details
    },

    attachmentUrl: {
      type: String,
      // Populated when messageType === 'image'
      // Stores the Cloudinary URL of the uploaded image
    },

    // ════════════════════════════════════════════════
    // SECTION 4 — LINKED CONTEXT
    // ════════════════════════════════════════════════

    relatedOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      // When a buyer places an order, the system can automatically send
      // a message to the farmer with this field populated.
      // The farmer's chat UI shows a clickable Order card in the conversation.
    },

    relatedProduct: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      // When a buyer enquires about a specific product,
      // the product card appears embedded in the message thread.
    },

    // ════════════════════════════════════════════════
    // SECTION 5 — READ STATUS
    // ════════════════════════════════════════════════

    isRead: {
      type: Boolean,
      default: false,
      // false = receiver hasn't opened this message yet
      // true  = receiver has seen it
      // Powers the notification badge: "3 unread messages" 🔴
    },

    readAt: {
      type: Date,
      // Populated when isRead flips to true.
      // Enables: "Seen 5 minutes ago" display under messages (like WhatsApp).
    },

    // ════════════════════════════════════════════════
    // SECTION 6 — SOFT DELETE PER USER
    // ════════════════════════════════════════════════

    isDeletedBySender: {
      type: Boolean,
      default: false,
    },

    isDeletedByReceiver: {
      type: Boolean,
      default: false,
      // These two flags allow each user to "delete" the conversation
      // from THEIR view without affecting the other person's view.
      // When BOTH are true, the message can be permanently removed.
      // This mirrors how WhatsApp's "Delete for me" feature works.
      // Standard messaging app pattern — document this in your report.
    },
  },
  {
    timestamps: true,
    // createdAt is the exact send timestamp — essential for ordering messages
    // chronologically in the chat UI. Without it, message order would be
    // unpredictable.
  }
);

// ════════════════════════════════════════════════════════════
// INDEXES
// ════════════════════════════════════════════════════════════

messageSchema.index({ conversationId: 1, createdAt: 1 });
// The single most important index in your messaging system.
// "Get all messages in conversation X, ordered oldest to newest"
// This query runs every single time a user opens a chat window.

messageSchema.index({ receiver: 1, isRead: 1 });
// "Get all unread messages for user X"
// Runs every time any page loads to show the notification badge count.

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;