import os, sys
import pypdfium2 as pdfium

src = sys.argv[1]
prefix = sys.argv[2]
out = r"D:\AI工作文件夹\self web\_pdfrender"
outw = "\\\\".join(out.split("\\"))

pdf = pdfium.PdfDocument(src)
n = len(pdf)
for i in range(n):
    page = pdf[i]
    bitmap = page.render(scale=2.0)
    img = bitmap.to_pil()
    p = os.path.join(out, f"{prefix}_{i+1}.png")
    img.save(p)
    print("saved", p)
print("pages", n)
