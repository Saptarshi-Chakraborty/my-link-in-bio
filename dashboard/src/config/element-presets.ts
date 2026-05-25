export const BUTTON_ALIGNMENTS = {
  left: {
    label: 'Left',
    class: 'text-left justify-start',
  },
  center: {
    label: 'Center',
    class: 'text-center justify-center',
  },
  right: {
    label: 'Right',
    class: 'text-right justify-end',
  },
} as const

export const BUTTON_SHAPES = {
  rectangle: {
    label: 'Rectangle',
    class: 'rounded-none',
  },
  rounded: {
    label: 'Rounded',
    class: 'rounded-md',
  },
  pill: {
    label: 'Pill',
    class: 'rounded-full',
  },
} as const

export const BUTTON_VARIANTS = {
  fill: {
    label: 'Fill',
    style: {
      backgroundColor: 'var(--phone-btn-bg)',
      borderColor: 'var(--phone-btn-border)',
      color: 'var(--phone-btn-text)',
    },
  },
  outline: {
    label: 'Outline',
    style: {
      backgroundColor: 'transparent',
      borderColor: 'var(--phone-btn-border)',
      color: 'var(--phone-btn-text)',
    },
  },
  soft: {
    label: 'Soft',
    style: {
      backgroundColor: 'rgba(var(--phone-btn-bg-rgb, 255, 255, 255), 0.1)',
      borderColor: 'transparent',
      color: 'var(--phone-btn-text)',
    },
  },
  glass: {
    label: 'Glass',
    style: {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      borderColor: 'rgba(255, 255, 255, 0.15)',
      color: 'var(--phone-btn-text)',
    },
  },
} as const

export const BUTTON_ANIMATIONS = {
  none: {
    label: 'None',
    class: '',
  },
  bounce: {
    label: 'Bounce',
    class: 'animate-bounce',
  },
  pulse: {
    label: 'Pulse',
    class: 'animate-pulse',
  },
  wobble: {
    label: 'Wobble',
    class: 'hover:animate-shake', // custom utility or inline animation
  },
} as const

export const CAROUSEL_ASPECT_RATIOS = {
  '1:1': {
    label: '1:1 Square',
    class: 'aspect-square',
  },
  '16:9': {
    label: '16:9 Video',
    class: 'aspect-video',
  },
  '3:4': {
    label: '3:4 Portrait',
    class: 'aspect-[3/4]',
  },
  '4:3': {
    label: '4:3 Photo',
    class: 'aspect-[4/3]',
  },
} as const
