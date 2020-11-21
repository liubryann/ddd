from google.cloud import language_v1

# pip install --upgrade google-cloud-language

document = {"type_": language_v1.Document.Type.PLAIN_TEXT, "language": "en"}
encoding_type = language_v1.EncodingType.UTF8

def analyze_sentiment(text_content):
    """
    Analyzing Sentiment in a String

    Args:
      text_content The text content to analyze
    """

    client = language_v1.LanguageServiceClient()
    document["content"] = text_content
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

def classify_text(text_content):
    """
    Classifying Content in a String

    Args:
      text_content The text content to analyze. Must include at least 20 words.
    """

    client = language_v1.LanguageServiceClient()
    document["content"] = text_content
    response = client.classify_text(request = {'document': document})
    for category in response.categories:
        print("Category name: {}".format(category.name))
        print("Confidence: {}".format(category.confidence))

