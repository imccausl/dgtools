import * as XLSX from 'xlsx'

import type { XLSXParser } from './types.js'

class XLSXBackend implements XLSXParser {
  #workbook?: XLSX.WorkBook

  set data(data: ArrayBuffer) {
    this.#workbook = XLSX.read(Buffer.from(data), { type: 'buffer' })
  }

  convert() {
    if (!this.#workbook) {
      throw new Error('No workbook data loaded.')
    }

    const [firstSheetName] = this.#workbook.SheetNames
    if (!firstSheetName) {
      return []
    }

    const sheet = this.#workbook.Sheets[firstSheetName]
    return XLSX.utils.sheet_to_json(sheet, { defval: null })
  }
}

export { XLSXBackend }
