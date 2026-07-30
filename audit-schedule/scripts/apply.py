"""Write the August 2026 assignment into the JOINT AUDIT sheet."""
import json, copy, openpyxl
from openpyxl.utils import get_column_letter as gcl

SRC = 'audit_july.xlsx'
OUT = 'Audit_Schedule_JuLY_2026_TRANSGUARD_DM.xlsx'
FIRST_ROW, LAST_ROW, TOTALS_ROW = 5, 88, 89
DAY0 = 2                      # day d lives in column d + DAY0  (C=day 1 .. AG=day 31)

assign = json.load(open('assignment.json'))['assign']

wb = openpyxl.load_workbook(SRC)
ws = wb['JOINT AUDIT ']

# style every audit mark the way the sheet already marks them (Calibri 20 bold, centred)
model = ws['F5']              # an existing 'AU' cell
font, align = copy.copy(model.font), copy.copy(model.alignment)
align.vertical = 'center'

# 1. clear the July marks from the day grid
for r in range(FIRST_ROW, LAST_ROW + 1):
    for c in range(3, 34):
        if ws.cell(r, c).value is not None:
            ws.cell(r, c).value = None

# 2. write the August marks
for r in range(FIRST_ROW, LAST_ROW + 1):
    zone = ws.cell(r, 1).value
    cell = ws.cell(r, assign[zone] + DAY0)
    cell.value = 'AU'
    cell.font, cell.alignment = copy.copy(font), copy.copy(align)

# 3. day-total row: two days were hardcoded and one was missing -> make all 31 consistent
for d in range(1, 32):
    L = gcl(d + DAY0)
    ws.cell(TOTALS_ROW, d + DAY0).value = f'=COUNTA({L}{FIRST_ROW}:{L}{LAST_ROW})'

# openpyxl writes formulas with no cached value; make Excel recompute on open
wb.calculation.fullCalcOnLoad = True

wb.save(OUT)
print('written:', OUT)
