import { useState, useCallback } from 'react'
import type { ProgressMap, TopicProgress } from '../types'

const KEY = 'enem_progress_v1'

const empty = (): TopicProgress => ({ exercises: false, review1: false, review2: false })

function load(): ProgressMap {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as ProgressMap) : {}
  } catch {
    return {}
  }
}

function save(data: ProgressMap) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data))
  } catch { /* ignore */ }
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressMap>(load)

  const updateProgress = useCallback(
    (topicId: string, field: keyof TopicProgress, value: boolean) => {
      setProgress(prev => {
        const updated: ProgressMap = {
          ...prev,
          [topicId]: { ...(prev[topicId] ?? empty()), [field]: value },
        }
        save(updated)
        return updated
      })
    },
    [],
  )

  const getTopicProgress = useCallback(
    (topicId: string): TopicProgress => progress[topicId] ?? empty(),
    [progress],
  )

  /** Returns 0–3: how many of the 3 checkboxes are checked */
  const getCompletionCount = useCallback(
    (topicId: string): number => {
      const p = progress[topicId]
      if (!p) return 0
      return [p.exercises, p.review1, p.review2].filter(Boolean).length
    },
    [progress],
  )

  return { progress, updateProgress, getTopicProgress, getCompletionCount }
}
