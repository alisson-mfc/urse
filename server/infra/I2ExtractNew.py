from infra import NlpHelper, PdfMiner
import re
from ast import DictComp
from entities import I2
import pprint as pp

def extract_dict(texto, frase1, frase2):
    outcomes = []
    comparisons = []
    totais = []

    i = 0
    if frase1:
        while i < len(texto):
            i_frase1 = texto.find(frase1, i)
            if i_frase1 != -1:
                outcomes.append([frase1, i_frase1])
                i = i_frase1 + len(frase1)
            else:
                break

    i = 0
    if frase2:
        while i < len(texto):       
            i_frase2 = texto.find(frase2, i)
            if i_frase2 != -1:
                comparisons.append([frase2, i_frase2])
                i = i_frase2 + len(frase2)
            else:
                break
        
    return outcomes, comparisons

def extract_heterogeneity(texto):

    pattern = r"Heterogeneity:.*?(\d+\.?\d*%|Not|NA|N/A)"

    heterogeneitys = []
    i2 = I2.I2()
    print('re', re.findall(pattern, texto))
    for match in re.finditer(pattern, texto):
        # valor = match.group(1)
        i2_text = i2.parser(match.group(0))
        if len(i2_text):
            valor = i2_text[0]
            if '=' in valor:
                valor = re.sub('[^0-9\.\,]','', valor.split('=')[1])
            posicao = match.start()
            heterogeneitys.append([valor, posicao])

    # regex = r'[^;]*$'
    # print(texto)
    # heterogeneitys = [[re.findall(regex, elemento[0])[0].strip(), elemento[1]] for elemento in heterogeneitys]
    return heterogeneitys

def handle_i2_from_db(file, outcome_list, comparators_list):
    i2 = I2.I2()
    text = PdfMiner.convert_pdf_to_string(file)
    _result = []
    
    heterogeneitys = extract_heterogeneity(text)
    outcomes=[]
    comparisons=[]
    for i, _ in enumerate(outcome_list):
        _outcomes, _comparisons = extract_dict(text, outcome_list[i], comparators_list[i] if comparators_list and len(comparators_list)-1 > i else '')
        outcomes = outcomes + _outcomes
        comparisons = comparisons + _comparisons


    result = []
    # Percorrendo a lista heterogeneitys
    for h in heterogeneitys:
        # Inicializando as variáveis que vão armazenar a posição e o valor mais próximos
        closest_outcome = None
        closest_comparison = None
        min_outcome_diff = float('inf')
        min_comparison_diff = float('inf')
        
        # Percorrendo a lista outcomes para encontrar o valor mais próximo
        for o in outcomes:
            outcome_diff = abs(h[1] - o[1])
            if outcome_diff < min_outcome_diff and o[1] < h[1]:
                closest_outcome = o
                min_outcome_diff = outcome_diff
        
        # Percorrendo a lista comparisons para encontrar o valor mais próximo
        for c in comparisons:
            comparison_diff = abs(h[1] - c[1])
            if comparison_diff < min_comparison_diff and c[1] < h[1]:
                closest_comparison = c
                min_comparison_diff = comparison_diff

        def filter_outcome(x):
            return closest_outcome and x[0] != closest_outcome[0]
        def filter_comparisons(x):
            return closest_comparison and x[0] != closest_comparison[0]

        if closest_outcome is not None:
            outcomes = list(filter(filter_outcome, outcomes))

        
        if closest_comparison is not None:
            comparisons = list(filter(filter_comparisons, comparisons))
        
        if closest_comparison or closest_outcome:
            closest_out = closest_outcome[0] if closest_outcome else ''
            closest_comp = closest_comparison[0] if closest_comparison else ''
            result.append([
                f'{closest_out},{closest_comp}',
                h[0]
            ])


        # Imprime a lista result após as operações
    print(result)
    print('--------')
    return result