export interface Video {
  url: string
  secureUrl: string
  type: string
  width: number
  height: number
}

export interface UrlData {
  contentType?: string
  description?: string
  favicons: string[]
  images?: string[]
  mediaType: string
  siteName?: string
  title?: string
  url: string
  videos?: Video[]
}

export interface Size {
  height: number
  width: number
}
