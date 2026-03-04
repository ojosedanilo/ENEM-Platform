export type Importance = 'alta' | 'média' | 'baixa'

export interface Topic {
  id: string
  week: number
  subject: string
  title: string
  videoUrl: string
  importance: Importance
  tags?: string[]
  exerciseListUrl?: string
}

export interface TopicProgress {
  exercises: boolean
  review1: boolean
  review2: boolean
}

export type ProgressMap = Record<string, TopicProgress>
