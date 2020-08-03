export interface UrlData {
  contentType?: string
  description?: string
  favicons: string[]
  images?: string[]
  mediaType: string
  siteName?: string
  title?: string
  url: string
  videos?: {
    url: string
    secureUrl: string
    type: string
    width: number
    height: number
  }[]
}
