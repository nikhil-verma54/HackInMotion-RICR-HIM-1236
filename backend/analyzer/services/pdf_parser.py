import fitz
from docx import Document


def extract_pdf_text(file):
    if hasattr(file, "seek"):
        file.seek(0)
    file_bytes = file.read() if hasattr(file, "read") else file
    document = fitz.open(stream=file_bytes, filetype="pdf")

    text = ""
    for page in document:
        text += page.get_text()

    document.close()
    return text.strip()


def extract_docx_text(file):
    if hasattr(file, "seek"):
        file.seek(0)
    document = Document(file)

    text = "\n".join(
        paragraph.text
        for paragraph in document.paragraphs
        if paragraph.text.strip()
    )

    return text.strip()