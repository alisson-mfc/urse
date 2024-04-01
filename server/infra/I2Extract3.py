from infra import NlpHelper, PdfPlumber
import re
from ast import DictComp
from entities import I2
# import pprint as pp

def extract_dict(texto, frase1, frase2):
    frase3 = "100%"
    frase4 = "100.0%"

    outcomes = []
    comparisons = []
    totais = []
    # print('extract dict begin', len(texto), frase1, frase2)
    i = 0
    while i < len(texto):
        i_frase1 = texto.find(frase1, i)
        if i_frase1 != -1:
            outcomes.append([frase1, i_frase1])
            i = i_frase1 + len(frase1)
        else:
            break
    # print('--')
    i = 0
    while i < len(texto):       
        i_frase2 = texto.find(frase2, i)
        if i_frase2 != -1:
            comparisons.append([frase2, i_frase2])
            i = i_frase2 + len(frase2)
        else:
            break
    # print('---')
    i = 0
    while i < len(texto):
        i_frase3 = texto.find(frase3, i)
        i_frase4 = texto.find(frase4, i)

        if i_frase3 != -1:
            totais.append([frase3, i_frase3])
            i = i_frase3 + len(frase3)
        elif i_frase4 != -1:
            totais.append([frase4, i_frase4])
            i = i_frase4 + len(frase4)
        else:
            break
    # print('extract dict end')

    # menor_tamanho = min([len(outcomes), len(totais), len(comparisons)])
    # # print('menor_tamanho: ', menor_tamanho)

    # ini_outcome = len(outcomes) - menor_tamanho
    # ini_outcome = ini_outcome if ini_outcome > 1 else 0

    # ini_comparisons = len(comparisons) - menor_tamanho
    # ini_comparisons = ini_comparisons if ini_comparisons > 1 else 0

    # ini_totais = len(totais) - menor_tamanho
    # ini_totais = ini_totais if ini_totais > 1 else 0

    

    
    # print( 'outcomes: ', len(outcomes[ini_outcome:]) )
    # print( 'comparisons: ', len(comparisons[ini_comparisons:]) )
    # print( 'totais: ', len(totais[ini_totais:]) )
    
    return outcomes,comparisons,totais

def extract_heterogeneity(texto):

    pattern = r"Heterogeneity:.*?(\d+\.?\d*%|Not|NA|N/A)"

    heterogeneitys = []
    i2 = I2.I2()
    print('re', re.findall(pattern, texto))
    for match in re.finditer(pattern, texto):
        i2_text = i2.parser(match.group(0))
        if len(i2_text):
            valor = i2_text[0]
            posicao = match.start()
            heterogeneitys.append([valor, posicao])

    # regex = r'[^;]*$'
    # print('heterogeneitys', heterogeneitys)
    # heterogeneitys = [[re.findall(regex, elemento[0])[0].strip(), elemento[1]] for elemento in heterogeneitys]
    return heterogeneitys

def encontrar_idois(lista1, lista2, lista3, lista4):
    strings_proximas = []
    for string1, posicao1 in lista1:
        posicoes_proximas2 = []
        strings_proximas2 = []
        
        for string2, posicao2 in lista2:
            if posicao2 < posicao1:
                posicoes_proximas2.append(posicao2)
                strings_proximas2.append([string2, posicao2])
        
        posicao_proxima2 = max(posicoes_proximas2) if posicoes_proximas2 else None
        index_proxima2 = posicoes_proximas2.index(posicao_proxima2) if posicao_proxima2 is not None else None
        string_proxima2 = strings_proximas2[index_proxima2][0] if index_proxima2 is not None else None
        
        posicoes_proximas3 = []
        strings_proximas3 = []
        
        for string3, posicao3 in lista3:
            print('posicao3 ',posicao3 ,'posicao1',  posicao1)
            if posicao3 < posicao1:
                posicoes_proximas3.append(posicao3)
                strings_proximas3.append([string3, posicao3])
            
        posicao_proxima3 = max(posicoes_proximas3) if posicoes_proximas3 else None
        index_proxima3 = posicoes_proximas3.index(posicao_proxima3) if posicao_proxima3 is not None else None
        string_proxima3 = strings_proximas3[index_proxima3][0] if index_proxima3 is not None else None
        
        posicoes_proximas4 = []
        strings_proximas4 = []
        
        for string4, posicao4 in lista4:
            if posicao4 < posicao1:
                posicoes_proximas4.append(posicao4)
                strings_proximas4.append([string4, posicao4])
        
        posicao_proxima4 = max(posicoes_proximas4) if posicoes_proximas4 else None
        index_proxima4 = posicoes_proximas4.index(posicao_proxima4) if posicao_proxima4 is not None else None
        string_proxima4 = strings_proximas4[index_proxima4][0] if index_proxima4 is not None else None
        
        strings_proximas.append([string1, posicao1, string_proxima2, posicao_proxima2, string_proxima3, posicao_proxima3, string_proxima4, posicao_proxima4])
    
    lista_sem_none = [lst for lst in strings_proximas if None not in lst]

    lista_filtrada = [item for item in lista_sem_none if isinstance(item[0], str) and isinstance(item[3], int) and isinstance(item[5], int) and item[1] > item[3] > item[5]]
    
    diferenca_minima = float('inf')
    resultado = None
    if len(lista_filtrada):
      for item in lista_filtrada:
          posicoes = item[1::2]  
          diferenca = max(posicoes) - min(posicoes)
          
          if diferenca < diferenca_minima:
              diferenca_minima = diferenca
              resultado = item
    
      posicoes = [item for item in resultado[1::2] if isinstance(item, int)] 
      maior_posicao = max(posicoes)
      menor_posicao = min(posicoes)

      if maior_posicao - menor_posicao >= 5000:
          return [
              lista3[0][0] if len(lista3) else '',
              lista4[0][0]  if len(lista4) else '',
              "N/A"
            ]
      else:
          return [
              lista3[0][0] if len(lista3) else '',
              lista4[0][0]  if len(lista4) else '',
              resultado[0]
            ]
    # print('lista3[0][0]', lista3[0][0], resultado[0])
    return [
        lista3[0][0] if len(lista3) else '',
        lista4[0][0] if len(lista4) else '',
        "N/A"
    ]
    
def handle_i2_from_db(file, outcome_list, comparators_list):
    i2 = I2.I2()
    text = PdfPlumber.convert_pdf_to_string(file)
    _result = []
    
    heterogeneitys = extract_heterogeneity(text)
    outcomes=[]
    comparisons=[]
    for i, _ in enumerate(outcome_list):
        # print( '#- {}\n\n{} -#'.format(outcome_list[i], comparators_list[i]))

        _outcomes, _comparisons, _totais = extract_dict(
            text, 
            comparators_list[i],
            outcome_list[i], 
        )
        resultado = encontrar_idois(
            heterogeneitys, 
            _totais, 
            _outcomes, 
            _comparisons if _comparisons else []
        )
        # print('---> ', _outcomes)
        # print('--->> ', _comparisons)
        _result = _result + [resultado]
        outcomes = outcomes + _outcomes
        comparisons = comparisons + _comparisons


    return _result