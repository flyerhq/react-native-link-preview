export interface PreviewData {
  description?: string
  image?: PreviewDataImage
  link?: string
  title?: string
}

export interface PreviewDataImage {
  height: number
  url: string
  width: number
}

export interface Size {
  height: number
  width: number
}
