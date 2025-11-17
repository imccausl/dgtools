import { XLSXBackend } from './xlsx.js'

import type { XLSXParser } from './types.js'

class ExcelSheet {
  #backend: XLSXParser

  constructor(backend: XLSXParser) {
    this.#backend = backend
  }

  set data(data: ArrayBuffer) {
    this.#backend.data = data
  }

  toJSON() {
    return this.#backend.convert()
  }
}

function convertExcelToJSON(data: ArrayBuffer) {
  const sheet = new ExcelSheet(new XLSXBackend())
  sheet.data = data
  return sheet.toJSON()
}

export { convertExcelToJSON }
