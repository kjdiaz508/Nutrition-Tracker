import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        mealPlan: resolve(__dirname, 'meal-plan.html'),
        chili: resolve(__dirname, 'recipe-chili.html'),
        stirfry: resolve(__dirname, 'recipe-stirfry.html'),
        sharedPlans: resolve(__dirname, 'shared-plans.html'),
        sharedRecipes: resolve(__dirname, 'shared-recipes.html'),
        shoppingList: resolve(__dirname, 'shopping-list.html'),
        user: resolve(__dirname, 'user.html'),
      },
    },
  },
})
