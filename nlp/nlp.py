from google.cloud import language_v1
from gensim.summarization.summarizer import summarize
from gensim.summarization import keywords
from argparse import ArgumentParser
import json
# pip install --upgrade google-cloud-language
# pip install --upgrade gensim

document = {"type_": language_v1.Document.Type.PLAIN_TEXT, "language": "en"}
encoding_type = language_v1.EncodingType.UTF8


def analyze_sentiment(text_content):
    """
    Analyzing Sentiment in a String

    Args:
      text_content The text content to analyze
    """

    output = {}
    client = language_v1.LanguageServiceClient()
    document["content"] = text_content
    response = client.analyze_sentiment(
        request={'document': document, 'encoding_type': encoding_type})

    print("Document sentiment score: {}".format(
        response.document_sentiment.score))
    print(
        "Document sentiment magnitude: {}".format(
            response.document_sentiment.magnitude
        )
    )
    output["sentiment"] = response.document_sentiment.score
    output["magnitude"] = response.document_sentiment.magnitude
    return output


def classify_text(text_content):
    """
    Classifying Content in a String

    Args:
      text_content The text content to analyze. Must include at least 20 words.
    """

    client = language_v1.LanguageServiceClient()
    document["content"] = text_content
    response = client.classify_text(request={'document': document})
    output = {
        "Category name": "{}",
        "Confidence": "{}"
    }
    for category in response.categories:
        print("Category name: {}".format(category.name))
        print("Confidence: {}".format(category.confidence))
        output["Category name"] = output["Category name"].format(category.name)
        output["Confidence"] = output["Confidence"].format(category.name)
    return output


def summarize_text(text_content, word_count=20):
    """
    Summarizing Content in a String using Extractive Summarization

    Args:
      text_content The text content to summarize.
      word_count The word count of the target summary
    """

    summ_words = summarize(text_content, word_count=word_count)
    print("Word count summary")
    print(summ_words)
    return summ_words


def process(text_content):
    '''
    Process text into a dictionary

    Args:
      text_content The text content to process.
    '''
    
    return json.dumps({
        "summary": summarize_text(text_content, 20),
        "sector": classify_text(text_content),
        "sentiment_details": analyze_sentiment(text_content)["sentiment"]
    })


if __name__ == "__main__":
    options = {
        "sentiment": analyze_sentiment,
        "classify": classify_text,
        "summarize": summarize_text,
        "process": process
    }
    parser = ArgumentParser(description="Process raw text")
    parser.add_argument('option',
                        type=str,
                        choices=options.keys(),
                        help="Action to perform on text")
    parser.add_argument('text',
                        type=str,
                        help="Raw input text")

    args = parser.parse_args()
    index = args.option
    action = options[index]
    text_content = args.text
    
    with open("dump.json", "w") as f:
        f.write(json.dumps(action(text_content)))