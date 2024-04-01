import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk import ngrams
from text_to_num import alpha2digit
from nltk.corpus import wordnet as wn
import re
# nltk.download('wordnet')
# nltk.download('omw-1.4')
# nltk.download('stopwords')
# nltk.download('punkt')


class GreyLiterature:

    def __init__(self):
        self.bases = [
            "grey literature",
            "clinicaltrials.gov",
            "clinicaltrials",
            "medrxiv.org"
            "medrxiv",
            "trial registries",
            "isctrn",
            "international standard randomised controlled trial number",
            "who ictrp",
            "world health organization international clinical trials registry platform",
            "opentrials.net",
            "opentrials",
            "searched unpublished",
            "searched ongoing trials",
            "european medicine agency",
            " ema ",
            "us food drug administration",
            " fda ",
            "clinicaltrialsregister.eu",
            "clinicaltrialsregister",
            "american diabetes association",
            "european association study diabetes",
            "ClinicalTrials.gov",
            "Clinical Trials Registry Platform",
            "WHO ICTRP",
            "Conference Proceedings Citation Index-Science"
        ]

    def processText(self, text):
        stop_words = set(stopwords.words('english'))
        _sent_tokenize = sent_tokenize(text)
        present = False

        for i in _sent_tokenize:
            for j in self.bases:
                if re.findall(j.lower(), i.lower()):
                    # print( j.lower() )
                    present = True
                    break

        return present

    @staticmethod
    def result(text):
        greyLiterature = GreyLiterature()
        return greyLiterature.processText(text)


class Base:
    def __init__(self, bases):
        self.bases = []
        for i in bases:
            self.bases.append(i.lower())

    def processText(self, text):
        stop_words = set(stopwords.words('english'))
        _sent_tokenize = sent_tokenize(text)
        present = False

        for i in _sent_tokenize:
            for j in self.bases:
                if re.findall(j.lower(), i.lower()):
                    # print( j.lower() )
                    present = True
                    break

        return present

    @staticmethod
    def result(text):
        bases = Base([
            "Medline",
            "Embase",
            "Cochrane Library",
            "CINAHL",
            "PsycINFO",
            "Web of Science",
            "LILACS",
            "Pubmed",
            "Cochrane Central Register of Controlled Trials",
            "Cochrane",
            "Cummulative Index to Nursing and Allied Health Literature",
            "Literatura latinoamericana en ciencias de la salud",
            "Google Scholar"
        ])

        result = bases.processText(text)
        return result


class NgramsUtil:
    def __init__(self):
        pass

    def transformTextToVec(self, text):
        stop_words = set(stopwords.words('english'))
        word_tokens = word_tokenize(text)
        steamed = nltk.PorterStemmer()
        filtered_sentence = [steamed.stem(alpha2digit(
            w, "en")) for w in word_tokens if not w.lower() in stop_words and w.isalpha()]
        return " ".join(filtered_sentence)

    def buildNGram(self, text, n=3):
        return ngrams(text.split(), n)

    def checkIfNgramsIsTarget(self, nGrams):
        target = []
        for grams in nGrams:
            for i in [0, 1, 2]:
                if grams[i].isnumeric() or grams[i].replace('.', '', 1).isdigit():
                    num = int(grams[i].replace('.', '', 1))
                    if num >= 2:
                        target.append(grams)
        return target

    def processText(self, text, n=3):
        sentence = self.transformTextToVec(text)
        nGrams = self.buildNGram(sentence, n)

        return self.checkIfNgramsIsTarget(nGrams)
        # return nGrams


class DuplicateStudySelection:
    def __init__(self, verbose=False):
        self.keys = [
            'review',
            'evalu',
            'investig',
            'author'
        ]
        self.verbose = verbose
        self.result = []

    def checkIfPresent(self, nGram):
        for i in nGram:
            if i in self.keys:
                return True
        return False

    def processText(self, nGrams):
        for igram in nGrams:
            present = self.checkIfPresent(igram)
            if present:
                self.result.append(igram)

    def checkStatus(self):
        return len(self.result) > 0

    @staticmethod
    def result(text):
        ngramsUtil = NgramsUtil()

        duplicateStudySelection = DuplicateStudySelection(True)
        nGrams = ngramsUtil.processText(text)
        duplicateStudySelection.processText(nGrams)
        return duplicateStudySelection.checkStatus()


class APriori:

    def __init__(self):
        self.bases = [
            "prospero",
            " osf ",
            "open science framework",
            "DIFFERENCES BETWEEN PROTOCOL AND REVIEW",
            "D I F F E R E N C E S   B E T W E E N   P R O T O C O L   A N D   R E V I E W",

        ]

    def processText(self, text):
        stop_words = set(stopwords.words('english'))
        _sent_tokenize = sent_tokenize(text)
        present = False
        for i in _sent_tokenize:
            for j in self.bases:
                if re.findall(j.lower(), i.lower()):
                    # print( j.lower() )
                    present = True
                    break

        return present

    @staticmethod
    def result(text):
        apriori = APriori()
        return apriori.processText(text)


class Amstar:

    def __init__(self, text):
        self.grey_literature = GreyLiterature.result(text)
        self.base = Base.result(text)
        self.duplicate_study_selection = DuplicateStudySelection.result(text)
        self.apriori = APriori.result(text)

    def result(self):
        result = 0
        true = 0
        noidea = 0
        false = 0
        for i in self.__dict__:
            if getattr(self, i) is None:
                noidea = noidea + 1
            if getattr(self, i):
                true = true + 1
            if not getattr(self, i):
                false = false + 1

        if true == 3:
            result = -1
        if true < 3:
            result = -2

        return {
            "grey_literature": self.grey_literature,
            "bases": self.base,
            "duplicate_study_selection": self.duplicate_study_selection,
            "apriori": self.apriori,
            "result": result
        }
