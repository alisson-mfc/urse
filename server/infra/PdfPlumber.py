import pdfplumber
import pprint

class PDFItem:
  def __init__(self, PDFObjectPath):
      self.pdf  = pdfplumber.open(PDFObjectPath)
      if self.pdf.annots:
        self.title = self.pdf.annots[0]['title']
      else :
        self.title = None

      self.numPages = len(self.pdf.pages)
      

  def extractTextOfPage(self, page):
    if isinstance(page, int) and page >= 0:
      pageX = self.pdf.pages[page]
      return pageX.extract_text()
    raise Exception("Page is not a number")

  def extractAllPages(self):
    texto_completo = ""
    for page in self.pdf.pages:
      texto_pagina = page.extract_text()
      texto_completo += texto_pagina
    return texto_completo

def convert_pdf_to_string(file_path):
    pdf2 = PDFItem( file_path)
    text = pdf2.extractAllPages()
    text = text.replace("\n", " ")
    text = text.replace("\t", " ")
    text = text.replace("  ", " ")
    return text