type MediaType = 'audio' | 'video' | 'image' | 'application' | 'video.other'
type ContentType =
  | 'audio/mpeg'
  | 'text/html; charset=utf-8'
  | 'video/mp4'
  | 'application/pdf'

export interface UrlData {
  url: string | undefined
  mediaType: MediaType | undefined
  contentType?: ContentType | undefined
  favicons: string[] | undefined
  title?: string
  siteName?: string
  description?: string
  images?: string[]
  videos?: {
    url: string
    secureUrl: string
    type: string
    width: number
    height: number
  }[]
}
