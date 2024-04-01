class Bias:

    def __init__(
        self, 
        domain = '', 
        judgement = '', 
        label = '', 
        score = 1
    ):
        self.domain = domain
        self.judgement = judgement
        self.label = label
        self.score = score

class EvidenceExtracted:

    def __init__(
        self,
        author = '',
        file_path = '',
        is_rct = False,
        sample_size = '',
        bias = []
    ):
        self.author = author
        self.file_path = file_path
        self.is_rct = is_rct
        self.bias = bias
        self.sample_size = sample_size

    def set_sample_size( self, article ):
        try:
            sample_size = article["ml"]["sample_size"]
        except:
            sample_size = '?'
        self.sample_size = sample_size

