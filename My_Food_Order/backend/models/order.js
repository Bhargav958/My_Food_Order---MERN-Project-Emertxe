// 🎯 STEP 1: START WITH REAL-LIFE STORY

// 👩‍🏫 Say:

// “Guys, imagine you ordered food from Swiggy 🍔
// What information gets saved?”

// 👉 Ask students:

// “What details does an order need?”

// 🧠 Let them answer… then guide:

// ✔ Delivery address
// ✔ Which restaurant
// ✔ Which user
// ✔ What items ordered
// ✔ Payment details
// ✔ Total price
// ✔ Order status

// 🧠 STEP 2: BREAK INTO LOGICAL PARTS (VERY IMPORTANT)

// 👩‍🏫 Say:

// “Instead of writing everything randomly…
// we divide order into parts”

// 🧩 PART 1: Delivery Info

// 👉 Where to deliver?

// Address
// City
// Phone
// Postal Code
// Country
// 🧩 PART 2: Who & From Where

// 👉 Who ordered?

// ✔ User

// 👉 From which restaurant?

// ✔ Restaurant

// 🧩 PART 3: What Items Ordered

// 👉 Very important 🔥

// Each order contains multiple items:

// Name
// Quantity
// Price
// Image
// FoodItem ID

// 👉 Ask:

// ❓ “Why store fooditem ID also?”

// 👉 Answer:

// ✔ To connect with FoodItem collection
// ✔ To update stock

// 🧩 PART 4: Payment Details

// 👉 Payment ID
// 👉 Payment status

// 🧩 PART 5: Pricing

// 👉 itemsPrice → total of items
// 👉 taxPrice → tax
// 👉 deliveryCharge → delivery
// 👉 finalTotal → final bill

// 🧩 PART 6: Order Status

// 👉 Processing
// 👉 Delivered

// 🧩 PART 7: Time Tracking

// 👉 createdAt
// 👉 deliveredAt
// 👉 paidAt

const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  deliveryInfo: {
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    phoneNo: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  orderItems: [
    {
      name: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      fooditem: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "FoodItem",
      },
    },
  ],
  paymentInfo: {
    id: {
      type: String,
    },
    status: {
      type: String,
    },
  },
  paidAt: {
    type: Date,
  },

  itemsPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  taxPrice: {
    type: Number,
    default: 0.0,
  },
  deliveryCharge: {
    type: Number,
    default: 0.0,
  },
  finalTotal: {
    type: Number,
    required: true,
    default: 0.0,
  },
  orderStatus: {
    type: String,
    required: true,
    default: "Processing",
  },
  deliveredAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


// 🚀 STEP 3: SPECIAL LOGIC (MOST IMPORTANT 🔥)

// 👩‍🏫 Say:

// “Now comes real backend thinking — STOCK MANAGEMENT”

// 🧠 Problem

// 👉 If user orders 5 burgers
// But stock is only 3

// ❌ System should NOT allow

// 💡 Solution Logic

// 👉 Before saving order:

// Check each food item
// Verify stock
// Reduce stock
// Save order

// 👉 This is called:

// 🔥 Pre-save middleware

// 🧠 STEP 4: PRE-SAVE LOGIC (VERY IMPORTANT)

// 👩‍🏫 Explain slowly:

// 👉 “Before saving order…”

// Loop through all items:

// for each item:
// Step 1:

// ✔ Find food item from DB

// Step 2:

// ✔ Check stock

// Step 3:

// ❌ If stock less → throw error

// Step 4:

// ✔ Reduce stock

// Step 5:

// ✔ Save updated stock

// 👉 Finally:

// ✔ Save order

// 🍽️ REAL-LIFE EXAMPLE

// 👩‍🏫 Say:

// “You go to restaurant and say:

// ‘I want 5 pizzas’”

// 👉 Waiter checks kitchen:

// If available → gives order
// If not → says “Out of stock”

// 👉 Same thing backend is doing

// 🎯 FINAL FLOW (SUPER IMPORTANT)

// 👩‍🏫 Say:

// “Let’s see complete flow”

// 1️⃣ User places order
// 2️⃣ Backend receives data
// 3️⃣ Before saving → check stock
// 4️⃣ Reduce stock
// 5️⃣ Save order
// 6️⃣ Return response

// orderSchema.pre("save", async function (next) {
//   try {
//     for (const orderItem of this.orderItems) {
//       const foodItem = await mongoose
//         .model("FoodItem")
//         .findById(orderItem.fooditem);
//       if (!foodItem) {
//         throw new Error("Food item not found.");
//       }

//       if (foodItem.stock < orderItem.quantity) {
//         throw new Error(
//           `Insufficient stock for '${orderItem.name}' in this order.`
//         );
//       }

//       foodItem.stock -= orderItem.quantity;
//       await foodItem.save();
//     }

//     next();
//   } catch (error) {
//     next(error);
//   }
// });

orderSchema.pre("save", async function () {
    for (const orderItem of this.orderItems) {
        const foodItem = await mongoose
            .model("FoodItem")
            .findById(orderItem.fooditem);

        if (!foodItem) {
            throw new Error("Food item not found.");
        }

        if (foodItem.stock < orderItem.quantity) {
            throw new Error(
                `Insufficient stock for '${orderItem.name}'`
            );
        }

        foodItem.stock -= orderItem.quantity;
        await foodItem.save();
    }
});
module.exports = mongoose.model("Order", orderSchema);
