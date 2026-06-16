'use client'

import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { getRecipeById } from '@/data/recipes'
import { Timer } from '@/components/Timer'

export default function RecipeDetail() {
  const router = useRouter()
  const { id } = router.query
  const recipe = id ? getRecipeById(id as string) : null
  const [showTimer, setShowTimer] = useState(false)

  if (!recipe) {
    return (
      <div className="min-h-screen bg-beige-light flex items-center justify-center">
        <p className="text-amber-800 font-serif">레시피를 찾을 수 없습니다.</p>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{recipe.title} - 감자 일기</title>
        <meta name="description" content={recipe.description} />
      </Head>

      <div className="letterpaper min-h-screen px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <Link href="/">
              <button className="text-sm text-amber-700 hover:text-amber-900 transition-colors font-serif">
                ← 돌아가기
              </button>
            </Link>
          </motion.div>

          {/* Recipe Content */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/40 backdrop-blur-[1px] rounded-lg p-8 mb-8 border border-amber-100/70 shadow-sm"
          >
            {/* Title */}
            <h1 className="text-2xl font-serif font-medium text-amber-950 mb-2">
              {recipe.title}
            </h1>
            <p className="text-sm text-amber-700 mb-6 font-serif">
              {recipe.description}
            </p>

            {/* Divider */}
            <div className="w-12 h-px bg-amber-200 mb-6"></div>

            {/* Story */}
            <div className="prose prose-sm max-w-none">
              <p className="text-amber-900 font-serif leading-relaxed text-base whitespace-pre-wrap">
                {recipe.story}
              </p>
            </div>
          </motion.div>

          {/* Timer Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/40 backdrop-blur-[1px] rounded-lg p-6 border border-amber-100/70 shadow-sm"
          >
            {!showTimer ? (
              <button
                onClick={() => setShowTimer(true)}
                className="w-full timer-button justify-center text-center"
              >
                3분 요리 타이머 시작
              </button>
            ) : (
              <>
                <Timer duration={180} />
                <button
                  onClick={() => setShowTimer(false)}
                  className="w-full mt-6 px-4 py-2 text-xs text-amber-700 hover:text-amber-900 transition-colors font-serif"
                >
                  닫기
                </button>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </>
  )
}
