import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Recipe name is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: ["Breakfast", "Lunch", "Dinner", "Snack", "Dessert", "Other"],
        message: "{VALUE} is not a valid category",
      },
    },
    ingredients: {
      type: String,
      required: [true, "Ingredients are required"],
    },
    steps: {
      type: String,
      required: [true, "Steps are required"],
    },
    cookingTime: {
      type: Number,
      required: [true, "Cooking time is required"],
      min: [1, "Cooking time must be a positive integer"],
      validate: {
        validator: Number.isInteger,
        message: "Cooking time must be a positive integer",
      },
    },
    imageUrl: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          if (!v) return true; // optional field
          return /^https?:\/\/.+/.test(v);
        },
        message: "Image URL must start with http:// or https://",
      },
    },
  },
  { timestamps: true }
);

const Recipe = mongoose.model("Recipe", recipeSchema);

export default Recipe;
