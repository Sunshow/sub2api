import type { PublicSettings } from '@/types'

export interface CustomMenuItem {
  label: string
  labelEn: string
  url: string
  icon?: string
  target?: '_self' | '_blank'
  position?: 'user' | 'admin' | 'both'
}

export interface CustomConfig {
  customMenuItems: CustomMenuItem[]
}

declare global {
  interface Window {
    __APP_CONFIG__?: PublicSettings
    __CUSTOM_CONFIG__?: CustomConfig
  }
}

export {}
