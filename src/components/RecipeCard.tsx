import Link from 'next/link'
import { motion } from 'framer-motion'
import { Recipe } from '@/data/recipes'

interface RecipeCardProps {
  recipe: Recipe
  index: number
}

export function RecipeCard({ recipe, index }: RecipeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Link href={`/recipe/${recipe.id}`}>
        <div className="recipe-card">
          <h3 className="text-lg font-serif font-semibold text-amber-900 mb-2">
            {recipe.title}
          </h3>
          <p className="text-sm text-amber-800 mb-3 leading-relaxed">
            {recipe.description}
          </p>
          <div className="flex items-center gap-2 text-xs text-amber-700">
            <span>⏱</span>
            <span>{recipe.cookingTime}분</span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
