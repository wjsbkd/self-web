// PDF 文本 + 页数提取
import pdfjsLib from 'pdfjs-dist/build/pdf.mjs'

const path = process.argv[2] // /mnt/c/Users/.../xxx.pdf
const doc = await pdfjsLib.getDocument(path).promise
const n = doc.numPages
console.log("Pages:", n)
for (let i = 1; i <= n; i++) {
  const page = await doc.getPage(i)
  const textContent = await page.getTextContent()
  const items = textContent.items.map(item => item.str).join(" ")
  console.log(`\n=== Page ${i} ===`)
  console.log(items.substring(0, 2000))
}
