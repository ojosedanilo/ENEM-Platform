export const SUBJECT_META: Record<string, { color: string; icon: string }> = {
  Artes: { color: "#fb7185", icon: "🎨" },
  Biologia: { color: "#22c55e", icon: "🧬" },
  Filosofia: { color: "#a78bfa", icon: "🏛" },
  "Filosofia/Sociologia": { color: "#6366f1", icon: "🧠" },
  Física: { color: "#8b5cf6", icon: "⚡" },
  Geografia: { color: "#14b8a6", icon: "🌍" },
  História: { color: "#f97316", icon: "📜" },
  Inglês: { color: "#0ea5e9", icon: "🇬🇧" },
  Linguagens: { color: "#06b6d4", icon: "💬" },
  Matemática: { color: "#3b82f6", icon: "∑" },
  Português: { color: "#10b981", icon: "Aa" },
  Química: { color: "#f43f5e", icon: "⚗" },
  Redação: { color: "#ec4899", icon: "✍" },
  Sociologia: { color: "#84cc16", icon: "👥" },
};

const FALLBACK = { color: "#7a7590", icon: "📚" };

export function getSubjectMeta(subject: string) {
  const entry = Object.entries(SUBJECT_META).find(([key]) =>
    subject.includes(key),
  );

  return entry ? entry[1] : FALLBACK;
}
export function getSubjectColor(subject: string) {
  return getSubjectMeta(subject).color;
}
export function getSubjectIcon(subject: string) {
  return getSubjectMeta(subject).icon;
}

export function getUniqueSubjectsByColor(subjects: string[]) {
  const seen = new Set<string>();

  return subjects.filter((subject) => {
    const color = getSubjectMeta(subject).color;

    if (seen.has(color)) return false;
    seen.add(color);

    return true;
  });
}
