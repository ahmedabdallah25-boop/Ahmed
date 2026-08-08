from reportlab.lib.pagesizes import A4, landscape
from reportlab.pdfgen import canvas
import build_pdf as B
import layout_page as L

PW, PH = landscape(A4)
c = canvas.Canvas("Laundry-Room-Proposed-Layout.pdf", pagesize=landscape(A4))
c.setTitle("Laundry room — proposed layout")
L.draw_layout(c, PW, PH, B.M, B.footer, B.label, B.wrap, B.para, B.page_bg, 1, 1)
c.save()
print("layout written")
