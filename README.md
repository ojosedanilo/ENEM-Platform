# ENEM Study Platform

Plataforma de estudos para o ENEM — Vite + React + TypeScript + TailwindCSS.

## 🚀 Como rodar

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`.

---

## 📂 Estrutura

```
src/
├── data/
│   └── topics.json        ← EDITE AQUI: adicione seus tópicos
├── hooks/
│   └── useProgress.ts     ← Salva checkboxes no localStorage
├── utils/
│   ├── youtube.ts         ← Converte URLs do YouTube para embed
│   └── subjects.ts        ← Cores e ícones das matérias
├── pages/
│   ├── Home.tsx           ← Tela inicial (dois cards)
│   ├── WeeksPage.tsx      ← Grid de 25 semanas
│   ├── SubjectsPage.tsx   ← Grid de matérias
│   ├── LessonPage.tsx     ← Vídeo + lista de tópicos + checkboxes
│   └── StatsPage.tsx      ← Gráficos de progresso
└── components/
    ├── Layout.tsx          ← Nav + Outlet
    └── ImportanceBadge.tsx ← Badge colorida de importância
```

---

## ✏️ Como adicionar tópicos

Edite `src/data/topics.json`. Cada tópico segue o formato:

```json
{
  "id": "w4-mat-01",
  "week": 4,
  "subject": "Matemática",
  "title": "Trigonometria — Funções Seno e Cosseno",
  "videoUrl": "https://www.youtube.com/watch?v=SEU_VIDEO_ID",
  "importance": "alta",
  "tags": ["Trigonometria", "Funções"],
  "exerciseListUrl": "https://link-para-sua-lista.com"
}
```

### Campos

| Campo            | Tipo                          | Descrição                                     |
|------------------|-------------------------------|-----------------------------------------------|
| `id`             | string (único)                | Identificador único, ex: `"w1-mat-01"`        |
| `week`           | number (1–25)                 | Número da semana                              |
| `subject`        | string                        | Nome da matéria                               |
| `title`          | string                        | Título do tópico                              |
| `videoUrl`       | string                        | URL do YouTube (qualquer formato)             |
| `importance`     | `"alta"` \| `"média"` \| `"baixa"` | Nível de importância                    |
| `tags`           | string[] (opcional)           | Tags para categorização                       |
| `exerciseListUrl`| string (opcional)             | Link para lista de exercícios                 |

### Matérias com cores pré-definidas

Matemática · Português · Física · Química · Biologia · História · Geografia · Redação · Inglês · Filosofia · Sociologia · Artes

Para adicionar uma nova matéria com cor personalizada, edite `src/utils/subjects.ts`.

---

## 💾 Progresso

Os checkboxes (Exercícios, Revisão 1, Revisão 2) são salvos no `localStorage` do navegador.  
Para resetar o progresso, abra o DevTools → Application → Local Storage → delete `enem_progress_v1`.

---

## 📦 Build para produção

```bash
npm run build
```

Os arquivos ficam em `dist/`. Pode hospedar no GitHub Pages, Vercel, Netlify, etc.
