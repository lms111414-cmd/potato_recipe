import { Recipe } from '@/data/recipes'

interface MoodSelectorProps {
  selectedMood: Recipe['mood'] | null
  onMoodSelect: (mood: Recipe['mood']) => void
}

const moods = [
  { id: 'rainy', label: '비 오는 날' },
  { id: 'tired', label: '지친 저녁' },
  { id: 'sunny', label: '화창한 주말' },
] as const

export function MoodSelector({ selectedMood, onMoodSelect }: MoodSelectorProps) {
  return (
    <div className="flex gap-3 justify-center flex-wrap px-4">
      {moods.map((mood) => (
        <button
          key={mood.id}
          onClick={() => onMoodSelect(mood.id as Recipe['mood'])}
          className={`mood-chip ${selectedMood === mood.id ? 'active' : ''}`}
        >
          {mood.label}
        </button>
      ))}
    </div>
  )
}
