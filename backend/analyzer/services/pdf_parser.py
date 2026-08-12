import fitz
from docx import Document


def extract_pdf_text(file):
    document = fitz.open(stream=file.read(), filetype="pdf")

    text = ""

    for page in document:
        text += page.get_text()

    document.close()

    return text.strip()


def extract_docx_text(file):
    document = Document(file)

    text = "\n".join(
        paragraph.text
        for paragraph in document.paragraphs
        if paragraph.text.strip()
    )

    return text.strip()