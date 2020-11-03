from PyPDF2 import PdfFileWriter, PdfFileReader
import classifier.classifier as classifier
import io

def classify_text_multiple(papers):
    result = classifier.run_cso_classifier_batch_mode(papers, workers=10, modules="semantic", enhancement="no")
    print(result)
    return result

def construct_paper(title='', text=''):
    paper = {"title": title, "abstract": text, "keywords": ''}
    return paper

# https://stackoverflow.com/questions/490195/split-a-multi-page-pdf-file-into-multiple-pdf-files-with-python#490203
# Function to split pdf fileso
# And then extract text


def process_pdf_file(title, input_pdf):
    """
    returns a dict of dict of semantics
    :param title:
    :param input_pdf:
    :return:
    """
    input_pdf = PdfFileReader(io.BytesIO(input_pdf))
    papers = {}

    for i in range(input_pdf.numPages):
        output = PdfFileWriter()
        page = input_pdf.getPage(i)
        output.addPage(page)
        page_text = page.extractText()
        papers[i] = construct_paper(title, page_text)

    return classify_text_multiple(papers)
