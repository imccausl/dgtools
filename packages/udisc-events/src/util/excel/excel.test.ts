import * as XLSX from 'xlsx'

import { convertExcelToJSON } from './index.js'

function workbookToArrayBuffer(workbook: XLSX.WorkBook) {
  const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' })
  return buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength,
  )
}

function createWorkbookFromRows(rows: Record<string, string | null>[]) {
  const worksheet =
    rows.length > 0
      ? XLSX.utils.json_to_sheet(rows)
      : XLSX.utils.aoa_to_sheet([])
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
  return workbookToArrayBuffer(workbook)
}

it('converts Excel data to JSON', () => {
  const sampleExcelData = createWorkbookFromRows([
    { Column1: 'Value1', Column2: 'Value2' },
    { Column1: 'Value3', Column2: 'Value4' },
  ])

  const jsonData = convertExcelToJSON(sampleExcelData)

  expect(jsonData).toEqual([
    { Column1: 'Value1', Column2: 'Value2' },
    { Column1: 'Value3', Column2: 'Value4' },
  ])
})

it('returns an empty array when a workbook has no rows', () => {
  const emptyWorkbook = createWorkbookFromRows([])

  expect(convertExcelToJSON(emptyWorkbook)).toEqual([])
})

it('fills blank cells with null to preserve shape', () => {
  const worksheet = XLSX.utils.aoa_to_sheet([
    ['Column1', 'Column2'],
    ['Value1', null],
  ])
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

  const workbookBuffer = workbookToArrayBuffer(workbook)

  expect(convertExcelToJSON(workbookBuffer)).toEqual([
    { Column1: 'Value1', Column2: null },
  ])
})
