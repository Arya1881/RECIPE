import express from "express";
import mongoose from "mongoose";
import Recipe from "../models/Recipe.js";

const router = express.Router();

// POST /api/recipes - create recipe
router.post("/", async (req, res) => {
  try {
    const recipe = new Recipe(req.body);
    const savedRecipe = await recipe.save();
    return res.status(201).json(savedRecipe);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message, errors: error.errors });
    }
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET /api/recipes - list all recipes
router.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 });
    return res.status(200).json(recipes);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

// POST /api/recipes/seed - populate initial sample recipes
router.post("/seed", async (req, res) => {
  try {
    const sampleRecipes = [
      {
        name: "Fluffy Blueberry Buttermilk Pancakes",
        category: "Breakfast",
        cookingTime: 20,
        imageUrl: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80",
        ingredients: "2 cups all-purpose flour\n2 tsp baking powder\n1/2 tsp baking soda\n2 tbsp granulated sugar\n1/2 tsp salt\n2 large eggs\n1 3/4 cups buttermilk\n1/4 cup unsalted butter, melted\n1 cup fresh organic blueberries\nPure maple syrup for serving",
        steps: "1. Whisk together flour, baking powder, baking soda, sugar, and salt in a large bowl.\n2. In a separate bowl, whisk together the eggs, buttermilk, and melted butter.\n3. Pour the wet ingredients into the dry ingredients and stir gently until just combined (lumps are fine).\n4. Fold in the fresh blueberries gently with a spatula.\n5. Heat a lightly greased griddle or nonstick skillet over medium heat.\n6. Pour 1/4 cup batter for each pancake. Cook until bubbles appear on the surface (about 2-3 mins).\n7. Flip and cook until golden brown on the other side (about 1-2 mins).\n8. Serve warm topped with a knob of butter and warm maple syrup."
      },
      {
        name: "Pan-Seared Salmon with Asparagus & Lemon Herb Butter",
        category: "Dinner",
        cookingTime: 25,
        imageUrl: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80",
        ingredients: "2 fresh salmon fillets (skin-on, 6 oz each)\n1 bunch fresh asparagus, trimmed\n2 tbsp extra virgin olive oil\n3 tbsp unsalted butter\n3 cloves garlic, minced\n1 lemon (juiced and zested)\n2 tbsp fresh dill, chopped\nSea salt and freshly cracked black pepper",
        steps: "1. Pat salmon fillets thoroughly dry with paper towels. Season generously with salt and pepper.\n2. Heat olive oil in a heavy stainless steel or cast-iron skillet over medium-high heat until shimmering.\n3. Place salmon skin-side down and press gently with a spatula for 15 seconds to prevent curling.\n4. Sear undisturbed for 4-5 minutes until the skin is golden and crispy.\n5. Flip the salmon, reduce heat to medium, and toss trimmed asparagus into the skillet.\n6. Add butter, minced garlic, lemon juice, and zest. Spoon the foamy melted herb butter over the salmon repeatedly for 3 minutes.\n7. Remove from heat when salmon reaches your desired doneness and asparagus is tender-crisp.\n8. Garnish with fresh dill and serve immediately."
      },
      {
        name: "Creamy Tuscan Garlic & Sun-Dried Tomato Chicken Pasta",
        category: "Dinner",
        cookingTime: 30,
        imageUrl: "https://images.unsplash.com/photo-1621996346565-e3d5d6281292?auto=format&fit=crop&w=800&q=80",
        ingredients: "10 oz fettuccine or penne pasta\n2 boneless skinless chicken breasts, sliced into strips\n1 tbsp Italian seasoning\n1/2 cup sun-dried tomatoes in oil, drained and sliced\n4 cloves garlic, minced\n1 1/2 cups heavy cream\n1/2 cup chicken broth\n1 cup freshly grated Parmesan cheese\n2 cups fresh baby spinach\n2 tbsp olive oil\nSalt and black pepper to taste",
        steps: "1. Bring a large pot of salted water to boil. Cook pasta according to package instructions until al dente; reserve 1/2 cup pasta water, then drain.\n2. Season chicken strips with Italian seasoning, salt, and pepper.\n3. Heat olive oil in a deep skillet over medium-high heat. Cook chicken until golden and cooked through (6-8 minutes). Transfer chicken to a plate.\n4. In the same skillet, add minced garlic and sun-dried tomatoes; sauté for 1 minute until fragrant.\n5. Pour in chicken broth and heavy cream, bring to a gentle simmer for 3-4 minutes.\n6. Stir in Parmesan cheese until sauce is silky and melted.\n7. Add fresh spinach and let wilt for 1 minute.\n8. Return chicken and cooked pasta to the skillet, tossing gently to coat in the luscious sauce.\n9. Season to taste and serve with extra freshly grated Parmesan."
      },
      {
        name: "Mediterranean Quinoa & Avocado Harvest Bowl",
        category: "Lunch",
        cookingTime: 15,
        imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
        ingredients: "1 1/2 cups cooked quinoa, cooled\n1 ripe Haas avocado, diced\n1 cup English cucumber, diced\n1 cup cherry tomatoes, halved\n1/2 cup Kalamata olives, pitted\n1/2 cup crumbled feta cheese\n1/4 cup red onion, thinly sliced\n1/4 cup fresh parsley and mint, finely chopped\n3 tbsp extra virgin olive oil\n1 1/2 tbsp fresh lemon juice\n1 small garlic clove, grated\nSea salt and black pepper",
        steps: "1. In a small jar, whisk together olive oil, lemon juice, grated garlic, salt, and black pepper to create the dressing.\n2. In two wide bowls, divide the cooked fluffy quinoa as the base.\n3. Arrange the diced avocado, cucumbers, cherry tomatoes, Kalamata olives, and crumbled feta in colorful sections on top.\n4. Scatter the thinly sliced red onion and fresh herbs across both bowls.\n5. Drizzle the lemon-herb dressing evenly over the ingredients right before serving.\n6. Toss gently to combine flavors and enjoy this crisp, refreshing lunch."
      },
      {
        name: "Sourdough Toast with Smashed Avocado & Poached Eggs",
        category: "Breakfast",
        cookingTime: 15,
        imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80",
        ingredients: "2 thick slices artisan sourdough bread\n1 large ripe avocado\n2 fresh large organic eggs\n1 tbsp white vinegar (for poaching water)\n1 tbsp extra virgin olive oil\n1/2 lemon, juiced\n1/4 tsp red pepper chili flakes\n1 tbsp microgreens or fresh chives\nFlaky sea salt (Maldon) and black pepper",
        steps: "1. Toast sourdough slices until deeply golden and crunchy.\n2. In a bowl, coarsely mash the avocado with lemon juice, a drizzle of olive oil, salt, and pepper.\n3. Bring a small saucepan of water to a gentle simmer. Add white vinegar.\n4. Crack an egg into a small ramekin. Create a gentle whirlpool in the simmering water with a spoon, then slide the egg into the center.\n5. Poach for 3 minutes until egg white is set and yolk is soft and runny. Repeat for the second egg.\n6. Spread the seasoned smashed avocado generously over the warm toasted sourdough.\n7. Carefully place a poached egg on each toast slice.\n8. Sprinkle with flaky sea salt, freshly cracked pepper, red chili flakes, and microgreens."
      },
      {
        name: "Artisan New York Triple Berry Swirl Cheesecake",
        category: "Dessert",
        cookingTime: 65,
        imageUrl: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80",
        ingredients: "1 1/2 cups Graham cracker crumbs\n4 tbsp melted unsalted butter\n2 tbsp sugar\n24 oz cream cheese, softened at room temperature\n1 cup granulated sugar\n1 cup sour cream\n1 tsp pure vanilla extract\n3 large eggs, room temperature\n1 cup mixed berries (strawberries, blackberries, raspberries)\n2 tbsp berry jam for swirl",
        steps: "1. Preheat oven to 325°F (165°C). Line the bottom of a 9-inch springform pan with parchment paper.\n2. Mix Graham cracker crumbs, melted butter, and 2 tbsp sugar. Press firmly into the bottom of the pan. Bake for 10 minutes, then cool.\n3. Beat cream cheese and sugar in a large mixer bowl on medium speed until smooth and creamy.\n4. Blend in sour cream and vanilla extract.\n5. Add eggs one at a time, mixing on low speed just until incorporated (do not over-mix).\n6. Pour batter over the cooled crust. Warm the berry jam and spoon dollops across the top; swirl with a toothpick.\n7. Bake for 55-60 minutes until the edges are set and center has a slight wobble.\n8. Turn off the oven, prop the door open slightly, and let rest 1 hour. Chill in the refrigerator for at least 4 hours.\n9. Top with fresh berries and slice with a warm knife."
      },
      {
        name: "Authentic Tokyo Shoyu Tonkotsu Ramen",
        category: "Other",
        cookingTime: 45,
        imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
        ingredients: "2 portions fresh ramen noodles\n4 cups rich pork or chicken bone broth\n2 tbsp Japanese soy sauce (shoyu)\n1 tbsp mirin\n1 tsp toasted sesame oil\n1 clove garlic, minced\n1 tsp grated ginger\n4 slices slow-braised chashu pork belly\n2 soft-boiled marinated ramen eggs (ajitsuke tamago), halved\n1/2 cup sweet corn kernels\n2 stalks green onions, finely chopped\n2 sheets toasted nori seaweed\n1 tbsp bamboo shoots (menma)",
        steps: "1. In a medium soup pot, heat sesame oil over medium heat. Sauté minced garlic and grated ginger for 1 minute.\n2. Pour in the rich bone broth, soy sauce, and mirin. Bring to a gentle boil, then simmer for 15 minutes to marry the flavors.\n3. In a separate large pot, boil plenty of unsalted water. Cook ramen noodles for 90 seconds until al dente; drain vigorously.\n4. Divide the piping hot seasoned broth into two large ramen bowls.\n5. Fold the noodles into the broth in each bowl.\n6. Arrange the sliced chashu pork, marinated egg halves, sweet corn, bamboo shoots, and green onions neatly on top.\n7. Slide a sheet of nori onto the side of each bowl and serve immediately piping hot."
      },
      {
        name: "Loaded Rustic Guacamole with Crispy Tortilla Crisps",
        category: "Snack",
        cookingTime: 10,
        imageUrl: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80",
        ingredients: "3 ripe Hass avocados\n1/2 small white onion, finely diced\n1 jalapeño or serrano pepper, seeded and minced\n1 ripe Roma tomato, seeded and diced\n1/3 cup fresh cilantro leaves, finely chopped\n1 1/2 limes, freshly juiced\n1/2 tsp kosher salt\n1/4 tsp ground cumin\n1 bag artisan sea salt tortilla chips",
        steps: "1. Cut the avocados in half, remove pits, and scoop the flesh into a molcajete or large mixing bowl.\n2. Coarsely mash the avocado with a fork or potato masher, keeping some chunks for rustic texture.\n3. Add the diced onion, minced jalapeño, diced Roma tomato, and fresh cilantro.\n4. Squeeze fresh lime juice all over the mixture and sprinkle with kosher salt and cumin.\n5. Gently fold all ingredients together with a rubber spatula.\n6. Taste and adjust lime juice and salt as desired.\n7. Transfer to a serving bowl and serve immediately with crunchy tortilla chips."
      }
    ];

    await Recipe.deleteMany({});
    const inserted = await Recipe.insertMany(sampleRecipes);
    return res.status(201).json({ message: "Database seeded successfully!", count: inserted.length, recipes: inserted });
  } catch (error) {
    return res.status(500).json({ message: "Failed to seed database", error: error.message });
  }
});

// GET /api/recipes/:id - get recipe by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid recipe ID" });
    }
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    return res.status(200).json(recipe);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

// PUT /api/recipes/:id - update recipe
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid recipe ID" });
    }
    const updatedRecipe = await Recipe.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    return res.status(200).json(updatedRecipe);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message, errors: error.errors });
    }
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid recipe ID" });
    }
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

// DELETE /api/recipes/:id - delete recipe
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid recipe ID" });
    }
    const deletedRecipe = await Recipe.findByIdAndDelete(id);
    if (!deletedRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    return res.status(200).json({ message: "Recipe deleted successfully", recipe: deletedRecipe });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid recipe ID" });
    }
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
