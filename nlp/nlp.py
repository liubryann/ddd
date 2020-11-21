from google.cloud import language_v1

# pip install --upgrade google-cloud-language

def analyze_sentiment(text_content):
    """
    Analyzing Sentiment in a String

    Args:
      text_content The text content to analyze
    """

    client = language_v1.LanguageServiceClient()

    type_ = language_v1.Document.Type.PLAIN_TEXT
    language = "en"
    document = {"content": text_content, "type_": type_, "language": language}
    encoding_type = language_v1.EncodingType.UTF8

    response = client.analyze_sentiment(request = {'document': document, 'encoding_type': encoding_type})

    print("Document sentiment score: {}".format(response.document_sentiment.score))
    print(
        "Document sentiment magnitude: {}".format(
            response.document_sentiment.magnitude
        )
    )

    for sentence in response.sentences:
        print("Sentence text: {}".format(sentence.text.content))
        print("Sentence sentiment score: {}".format(sentence.sentiment.score))
        print("Sentence sentiment magnitude: {}".format(sentence.sentiment.magnitude))

    print("Language of the text: {}".format(response.language))
