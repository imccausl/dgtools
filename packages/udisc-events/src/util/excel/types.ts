export interface XLSXParser {
  convert(): unknown
  set data(data: ArrayBuffer)
}
