from google.cloud import language_v1
from gensim.summarization.summarizer import summarize 
from gensim.summarization import keywords 

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

def summarize_text(text_content, word_count):
    """
    Summarizing Content in a String using Extractive Summarization
    
    Args:
      text_content The text content to summarize.
      word_count The word count of the target summary
    """

    summ_words = summarize(text_content, word_count = word_count) 
    print("Word count summary") 
    print(summ_words) 


def test():
    text = '''Keep in mind I believe this is the best case scenario possible. So thinking more conservative, the size of say Lexus in global sales is more likely. What I mean by this is that since Nio's beginning it has sold 50,000 vehicles in China alone. Most of the sales in fact during Covid-19. This is pretty impressive, even bearish people have to admit that, for a car/lifestyle brand founded in 2014. However, for Nio to be globally the size of Lexus, Nio has to sell 800,000+ cars annually. BMW sells 2,000,000+ cars annually. For a little more perspective Tesla models which are increasingly more and more common in Europe and the USA sold 360,000+ in 2019. Now there's two kinds of people reading this post, one person who thinks Nio being Chinese is an advantage, and another who thinks being Chinese is a disadvantage; and you'd both be correct. Bullish people will know that the Chinese car market is currently larger than the US market and the European market (though not combined), and the Chinese market is growing far faster, the Chinese EV market growing fastest of all. Bearish people will know that it's almost impossible (unless you're Tesla) for car makers to build a customer base in Europe. I mean even GM one of the largest manufacturers in the whole world have suffered trying. And that's just Europe, if you look at America, if you ask 100 people if they'd happily buy a Chinese branded vehicle, you'd be lucky if 6 said yes; due to anti-communist sentiment and the Chinese goods = cheap and poorly made reputation. So, now you're asking me, why the fuck do you think Nio can sell 2,000,000 a year, if Americans won't buy them full stop, and Europeans would rather one of their own European brands. That is because you're really underestimating China. Chinese people LOVE Chinese goods if they're proven to be of great quality. Look at Huawei, Huawei has a 36% market share in new phone sales in China. And Nio I believe is cut from the same cloth.
    What I believe is possible is that at best, Nio will be able to steal a 0.5% market share of new car sales in America. Similar story in Europe 0.5 - 1% market share. BUT in China, at a reasonable extreme Nio will be able to amass a massive 10% market share in the homeland. That is in of itself at least 2,000,000 cars sold a year. If Nio can release a small range of cars within the $15,000 to $35,000 price bracket within 10 years, which is easily possible; then it over quadruples in my estimation of the likely hood of a 10% market share.'''
    analyze_sentiment(text)
    classify_text(text)
    summarize_text(text, 20)