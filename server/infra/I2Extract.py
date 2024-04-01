from infra import NlpHelper, PdfMiner
import re
from ast import DictComp
from entities import I2
import pprint as pp

def handle_i2_from_db(file, outcome_list, comparators_list):

    i2 = I2.I2()
    text = PdfMiner.convert_pdf_to_string(file)


    i2_parsed_list = i2.parser( text )

    def find_header_index( headerStr ):
        return text.index(headerStr)

    # comparators_list = [
    #         'diuretics',
    #         'beta-blockers',
    #         'diuretics and beta-blockers',
    #         'ACE inhibitors',
    #         'ARBs'
    #     ]
    # outcome_list = [
    #     'stroke',
    #     'all-cause mortality',
    #     'major cardiovascular events',
    #     'cardiovascular mortality',
    #     'myocardial infarction',
    #     'congestive heart failure'
    # ]

    def handle_i2(text, comparators_list, outcome_list):
        # Tratar os casos onde não encontra nenhum comparador, desfecho ou intervensao
        sub1 = "R E S U L T S"
        sub2 = "D I S C U S S I O N"

        results_idx = find_header_index(sub1)
        discussion_idx = find_header_index(sub2)

        result_text = ''
        for idx in range(results_idx + len(sub1) + 1, discussion_idx):
            result_text = result_text + text[idx]

        comparator_list_positions = []
        comparator_list_values = []
        comparator_description_list = []

        outcome_list_positions = []
        outcome_list_values = []
        outcome_description_list = []

        i2_list_positions = []
        i2_list_values = []
        i2_description_list = []


        def find_in_text(item_list, result_text):
            list_position = []
            list_values = []
            for item in item_list:
                iter3 = re.finditer(item.lower(), result_text.lower())
                for m in iter3:
                    list_position.append(m.start(0))
                    list_values.append(item)
            return list_position, list_values


        comparator_list_positions, comparator_list_values = find_in_text(comparators_list, result_text)
        outcome_list_positions, outcome_list_values = find_in_text(outcome_list, result_text)
        i2_list_positions, i2_list_values = find_in_text(i2_parsed_list, result_text)


        comparator_description_list = [(i, j) for i, j in zip(comparator_list_values, comparator_list_positions)]
        outcome_description_list = [(i, j) for i, j in zip(outcome_list_values, outcome_list_positions)]
        i2_description_list = [(i, j) for i, j in zip(i2_list_values, i2_list_positions)]


        listamaxc = []
        listamaxo = []
        listares = set()
        print( f'--> {outcome_list_positions}' )
        for i2_idx, i in enumerate(i2_list_positions):
            lower_result_comparator = min([ j for j in comparator_list_positions if j < i], key=lambda x:abs(x-i))
            lower_result_outcome = min([ j for j in outcome_list_positions if j < i], key=lambda x:abs(x-i))
            #print(lower_result_comparator)

            for idxc, i in enumerate(comparator_list_positions):
                if i == lower_result_comparator:
                    comparator = comparator_list_values[idxc]
                    comparator_position = idxc

            for idxo, i in enumerate(outcome_list_positions):
                if i == lower_result_outcome:
                    outcome = outcome_list_values[idxo]
                    outcome_position = idxo
        
            listares.add(tuple([
                comparator,
                outcome,
                i2_list_values[i2_idx],
                i2.calculate(i2_list_values[i2_idx])
            ]))
        return listares

    return handle_i2( text, comparators_list, outcome_list)

"""
1 - split target text
2 - create position, value and descriptions list
3 - 
"""