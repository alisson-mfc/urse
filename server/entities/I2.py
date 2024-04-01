import re
import numpy as np

class I2:

    def __init__(self):
        self.patterns = set([
            # "[Ii]\n?\ ?[²2]\s*[=]\s*\d*[.,]?\d*\%",
            # 'Not applicable',
            # 'Not Applicable',
            # 'NA',
            # 'N/A'
            "Heterogeneity:.*?(\d+\.?\d*%|Not|NA|N/A)",
        ])
  
    def parser(self, text):
        patternsFinded = []
        text = text.replace("²","2")
        text = text.replace("\n", "")
        text = text.replace("\t", "")
        for reg in self.patterns:
            patternsFinded.append( re.findall(reg, text ))

        patternsFinded = np.concatenate(patternsFinded)
        return patternsFinded

    def calculate(self, value):
        numbers = re.findall(r'\d+', value)
        i2 = int(numbers[1])

        if i2 < 30:
            return 0
        if i2 >= 30 and i2 < 75:
            return -1        
        if i2 >= 75:
            return -2
