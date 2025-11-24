export const EVENT_PRESETS = [
  {
    id: 'new_year',
    label: 'New Year Sparkles',
    headline: 'Happy New Year!',
    message: 'Wishing you joy, peace, and prosperity in the year ahead.',
    colors: {
      background: '#0f172a',
      accent: '#fcd34d',
      text: '#f8fafc',
    },
    effects: {
      confetti: true,
      glow: true,
    },
    badge: '🎆',
  },
  {
    id: 'anniversary',
    label: 'Anniversary Gold',
    headline: 'Celebrating our journey',
    message: 'Thank you for being part of our story. Cheers to many more years!',
    colors: {
      background: '#3b0764',
      accent: '#facc15',
      text: '#fefce8',
    },
    effects: {
      confetti: false,
      glow: true,
    },
    badge: '✨',
  },
  {
    id: 'pride',
    label: 'Pride Spectrum',
    headline: 'Love is Love',
    message: 'We proudly stand for equality, diversity, and inclusion.',
    colors: {
      background: '#1e1b4b',
      accent: '#fb7185',
      text: '#fdf4ff',
    },
    effects: {
      confetti: true,
      glow: false,
    },
    badge: '🏳️‍🌈',
  },
  {
    id: 'custom',
    label: 'Custom',
    headline: '',
    message: '',
    colors: {
      background: '#0f172a',
      accent: '#f97316',
      text: '#f8fafc',
    },
    effects: {
      confetti: false,
      glow: false,
    },
    badge: '🪄',
  },
]


