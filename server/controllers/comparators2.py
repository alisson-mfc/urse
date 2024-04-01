from app import app
from flask import jsonify
from flask import request, url_for
import os
from werkzeug.utils import secure_filename
from entities.Response import Success, Error, SuccessList
from entities.Comparators import Comparators
from entities.ComparatorsResult import ComparatorsResults
from entities.SystematicReview import SystematicReview
from entities.Amstar import Amstar
import json
import requests
import time
import ast
import numpy as np
from infra import PdfPlumber
from entities.URL import URL
import re
import logging

UPLOAD_FOLDER = os.getcwd()+'/uploads'
ALLOWED_EXTENSIONS = {'pdf'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def calc(str, key, files):
    def start_bias():
        return {
            "domain": '',
            "judgement": '',
            "label": '',
            "score": 0,
        }
    response = []
    BIAS_MAP = {
        "high/unclear": {"score": 0, "label": "+"},
        "low": {"score": 1, "label": "?"},
        "?": {"score": 0, "label": "?"},
    }
    partial_n = dict()
    partial_n["items"] = dict()
    partial_n["total"] = 0
    partial_n["result"] = 0

    bias = dict()
    bias["random_sequence_generation"] = dict()
    bias["allocation_concealment"] = dict()
    bias["blinding_of_participants_and_personnel"] = dict()
    bias["blinding_of_outcome_assessment"] = dict()

    authors = dict()

    count = 1
    for article in str['article_data']:
        file = article['gold']['filename'].replace(
            " ", "_") if "gold" in article and "filename" in article['gold'] else '-'

        if file not in files[key]:
            continue

        sample_size = article["ml"]["sample_size"]

        if "?" in sample_size:
            partial_n["result"] = -1
        else:
            partial_n["result"] = int(
                partial_n["result"]) + int(sample_size)

        try:
            author = article["grobid"]["authors"][0]
        except:
            author = "?"
        year = 0
        if "year" in article["grobid"]:
            year = article["grobid"]["year"]
        else:
            if "pubmed" in article["grobid"] and "year" in article["grobid"]["pubmed"]:
                year = article["grobid"]["pubmed"]["year"]
        try:
            trial = f'{author["lastname"]} {author["initials"]}, {year}'
        except:
            trial = "?"

        partial_n["items"][trial] = sample_size
        random_sequence_generation = start_bias()
        allocation_concealment = start_bias()
        blinding_of_participants_and_personnel = start_bias()
        blinding_of_outcome_assessment = start_bias()
        if "rct" not in article['ml']:
            response.append({
                "sample_size": sample_size,
                "trial": '',
                "design": '',
                "random_sequence_generation": random_sequence_generation,
                "allocation_concealment": allocation_concealment,
                "blinding_of_participants_and_personnel": blinding_of_participants_and_personnel,
                "blinding_of_outcome_assessment": blinding_of_outcome_assessment,
                'is_rct': False,
                'file': file
            })
            continue

        design = "RCT" if article["ml"]["rct"]["is_rct"] else "-"

        def check_rct(value, rct):

            return value if rct else BIAS_MAP['?']

        is_rct = article["ml"]["rct"]["is_rct"]
        random_sequence_generation = {
            "domain": article["ml"]["bias"][0]["domain"],
            "judgement": article["ml"]["bias"][0]["judgement"],
            "label": check_rct(BIAS_MAP[article["ml"]["bias"][0]["judgement"]], is_rct)["label"],
            "score": check_rct(BIAS_MAP[article["ml"]["bias"][0]["judgement"]], is_rct)["score"],
        }

        bias["random_sequence_generation"][trial] = check_rct(
            BIAS_MAP[article["ml"]["bias"][0]["judgement"]], is_rct)["score"]

        allocation_concealment = {
            "domain": article["ml"]["bias"][1]["domain"],
            "judgement": article["ml"]["bias"][1]["judgement"],
            "label": check_rct(BIAS_MAP[article["ml"]["bias"][1]["judgement"]], is_rct)["label"],
            "score": check_rct(BIAS_MAP[article["ml"]["bias"][1]["judgement"]], is_rct)["score"],
        }

        bias["allocation_concealment"][trial] = check_rct(
            BIAS_MAP[article["ml"]["bias"][1]["judgement"]], is_rct)["score"]

        blinding_of_participants_and_personnel = {
            "domain": article["ml"]["bias"][2]["domain"],
            "judgement": article["ml"]["bias"][2]["judgement"],
            "label": check_rct(BIAS_MAP[article["ml"]["bias"][2]["judgement"]], is_rct)["label"],
            "score": check_rct(BIAS_MAP[article["ml"]["bias"][2]["judgement"]], is_rct)["score"],
        }

        bias["blinding_of_participants_and_personnel"][trial] = check_rct(
            BIAS_MAP[article["ml"]["bias"][2]["judgement"]], is_rct)["score"]

        blinding_of_outcome_assessment = {
            "domain": article["ml"]["bias"][3]["domain"],
            "judgement": article["ml"]["bias"][3]["judgement"],
            "label": check_rct(BIAS_MAP[article["ml"]["bias"][3]["judgement"]], is_rct)["label"],
            "score": check_rct(BIAS_MAP[article["ml"]["bias"][3]["judgement"]], is_rct)["score"],
        }

        bias["blinding_of_outcome_assessment"][trial] = check_rct(
            BIAS_MAP[article["ml"]["bias"][3]["judgement"]], is_rct)["score"]
        count = count+1
        response.append({
            "file": file,
            'is_rct': is_rct,
            "sample_size": sample_size,
            "trial": trial,
            "design": design,
            "random_sequence_generation": random_sequence_generation if is_rct else start_bias(),
            "allocation_concealment": allocation_concealment if is_rct else start_bias(),
            "blinding_of_participants_and_personnel": blinding_of_participants_and_personnel if is_rct else start_bias(),
            "blinding_of_outcome_assessment": blinding_of_outcome_assessment if is_rct else start_bias(),
        })
    return response, bias, partial_n, authors


def downgrade_num_participantes(row, our_total=None):
    sample_size = row["sample_size"]
    if our_total is not None:
        sample_size = our_total

    print('sample_size...', sample_size)
    downgrade = 0
    if "?" in sample_size:
        # print('sample_size', -2)
        return -2
    if (int(sample_size) >= 500):
        return 0
    if (int(sample_size) >= 100 and int(sample_size) <= 499):
        return -1
    if (int(sample_size) >= 0 and int(sample_size) <= 99):
        return -2


def check_numeric(val):
    try:
        x = isinstance(float(val), float)
        return x
    except:
        return False


def downgrade_risco_vies(row, total):
    size = float(row["sample_size"]) if check_numeric(
        row["sample_size"]) else 10
    target = [
        "allocation_concealment",
        "blinding_of_outcome_assessment",
        "blinding_of_participants_and_personnel",
        "random_sequence_generation"
    ]
    count = 0

    str_t = ''
    for t in target:
        str_t += f'{str_t}\t{row[t]["score"]}'
        count = count + (row[t]["score"])

    if count > 2:
        value = 1
    else:
        value = 0

    n_total = size/total
    rv = n_total * value * 100
    print(f'total: {total}\t size:{size}\t n_total: {n_total}\trv:{rv}')
    if rv >= 0.75:
        return 0
    elif rv >= 0.3 and rv < 0.75:
        return -1
    return -2


def downgrade_risco_vies_json(row):

    target = [
        "allocation_concealment",
        "blinding_of_outcome_assessment",
        "blinding_of_participants_and_personnel",
        "random_sequence_generation"
    ]
    result = dict()
    result["items"] = dict()
    result["labels"] = dict()

    for i, t in enumerate(target):
        result["items"][f'item{i+1}'] = True if row[t]["score"] else False
        result["labels"][i+1] = t

    return result


def calc_score(part, n_samples):
    sample_size = part["sample_size"]
    trial = part["trial"]
    downgrade_n_participantes = downgrade_num_participantes(part)
    risco_vies = downgrade_risco_vies(part, n_samples)
    risco_vies_json = downgrade_risco_vies_json(part)
    return trial, downgrade_n_participantes, risco_vies, risco_vies_json, sample_size


@app.route("/comparators", methods=['POST'])
def save_comparators():

    if 'uid' not in request.form:
        return Error.body('No UID passed')

    if 'files' not in request.files:
        return Error.body('No files')

    uid = request.form.get('uid')
    outcome = request.form.get('outcome')
    intervention = request.form.get('intervention')
    comparator = request.form.get('comparator')

    files = request.files.getlist('files')
    for file in files:
        if file.filename == '':
            return Error.body('No selected file')

        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)

            file.save(filepath)

            comparatorResponse = Comparators(
                uid, outcome, intervention, comparator,
                filepath, done=0, result='', created_at=None
            )
            comparatorResponse.save()

    return Success.body('Comparator cretead')


@app.route("/comparators/<uid>", methods=['GET'])
def find_comparators_uid(uid):
    comparatorList = Comparators.find_id(uid)
    comparatorList = [i.__dict__ for i in comparatorList]
    return SuccessList.body(comparatorList)


@app.route("/comparators-robot/<uid>", methods=['GET'])
def send_to_robotreviwer(uid):
    comparatorList = Comparators.find_id(uid)
    url = f'http://{URL}:5050/upload_and_annotate_pdfs'
    file = []

    headers = {"Content-Type": "multipart/form-data; charset=utf-8"}

    _file = set()
    for comparator in comparatorList:
        _file.add(comparator.path_files)

    for comparator in _file:

        with open(comparator, "rb") as f:
            file.append(
                ('file', (comparator, f.read(), "multipart/form-data")))

    test_response = requests.post(url, files=file)
    response = test_response.json()
    report_uuid = response['report_uuid']
    Comparators.update_uid_report_id(uid, response['report_uuid'])

    return handle_robot_reviewer_job(uid)


@app.route("/comparators-robot-job/<uid>", methods=['GET'])
def handle_robot_reviewer_job(uid):

    comparators = Comparators.find_id(uid)
    report_uuid = comparators[0].report_id

    url_check = f'http://{URL}:5050/annotate_status/{report_uuid}'
    response_check = requests.get(url_check).json()
    # print(f'response_check: {response_check}')

    complete = False

    # print(report_uuid)

    if 'meta' in response_check and response_check['meta'] is not None:
        for i in range(1, 51):
            if response_check['meta']['process_percentage'] != 100:
                time.sleep(2)
                response_check = requests.get(url_check).json()
                # print(f'response_check: {response_check}')
            if response_check['meta']['process_percentage'] == 100:
                complete = True
                break
    if 'meta' in response_check and response_check['meta'] is not None:
        if response_check['meta']['process_percentage'] == 100:
            url_result = f'http://{URL}:5050/report_view/{report_uuid}/json'
            response_result = requests.get(url_result).text
            with open(f'{UPLOAD_FOLDER}/{report_uuid}.json', 'w') as f:
                f.write(response_result)
            response_result = f'{UPLOAD_FOLDER}/{report_uuid}.json'

            # print( f'response_result: {response_result}')
            Comparators.update_uid_result(uid, response_result)
    # print(report_uuid)
    return Success.body('ok')


def calc_heterogeneity(i):
    # print('--')
    if i <= 30:
        # print(i, '0')
        return 0
    if i > 30 and i < 75:
        # print(i, -1)
        return -1
    # print(i, -2)
    return -2


def extractTotal(text):
    padrao1 = r"Total(?: \([^)]*\))?[\s\*]+(\d+(?:\s\d+)*)\s100(?:\.0)?%"
    padrao2 = r"Subtotal(?: \([^)]*\))?[\s\*]+(\d+(?:\s\d+)*)\s100(?:\.0)?%"

    listanpart = re.findall(padrao1, text, re.MULTILINE)

    if not listanpart:
        listanpart = re.findall(padrao2, text, re.MULTILINE)
    if listanpart:
        numeros_separados = listanpart[0].split()
        if len(numeros_separados) > 1:
            numero1 = int(numeros_separados[0])
            numero2 = int(numeros_separados[1])
            return [(numero1, numero2)]

    return [('?', '?')]


def extractTextToExtract(texto, comparison, outcome):
    comparison = comparison.replace(
        '(', '\(').replace(')', '\)').replace('%', '\%')
    outcome = outcome.replace(
        '(', '\(').replace(')', '\)').replace('%', '\%')

    ptr = rf'{comparison}(.*){outcome}'
    listItems = re.finditer(ptr, texto, re.MULTILINE)

    max_position = 0
    max_i = 0
    text_cortado = ''

    for i in listItems:
        mmax = i.span()[1]
        if mmax >= max_position:
            max_position = mmax
            max_i = i

    try:
        if listItems:
            text_cortado = texto[max_position: max_position+1500]
            ptr2 = rf'Heterogeneity'
            listItems2 = re.finditer(ptr2, text_cortado, re.MULTILINE)
            next_heterogeneity = next(listItems2).span()[1]
            text_cortado = texto[max_position: max_position+next_heterogeneity]

        return text_cortado
    except Exception as e:
        logging.critical(e, exc_info=True)
        return texto


@app.route("/comparators-calc/<uid>", methods=['GET'])
def comparators_calc(uid):
    comparators_results = ComparatorsResults.find_results(uid)
    comparatos_list = set()
    result = dict()
    files = {}

    for comp in comparators_results:
        file_key = f'{comp.outcome}|{comp.intervention}|{comp.comparator}'
        if file_key in files:
            files[file_key].append(comp.path)
        else:
            files[file_key] = []
            files[file_key].append(comp.path)
        key_list = []
        if comp.outcome:
            key_list.append(f"{comp.outcome}")
        # if comp.intervention:
        #     key_list.append(f"{comp.intervention}")
        if comp.comparator:
            key_list.append(f"{comp.comparator}")
        key = "|".join(key_list)
        if key not in comparatos_list:
            comparatos_list.add(key)
            result[key] = {
                "result": comp.result,
                "outcome": comp.outcome,
                "intervention": comp.intervention,
                "comparator": comp.comparator,
                'key': file_key
            }
            # print(result[key])

    final_result = dict()
    authors = dict()

    for r in result:
        if r not in final_result:
            final_result[r] = dict()
        result_json = ''
        with open(result[r]['result'], 'r') as f:
            result_json = json.load(f)

        data = result_json
        total = 0
        for i in data['article_data']:
            total = total + \
                float(i['ml']['sample_size'] if check_numeric(
                    i['ml']['sample_size']) else 10)

        result1, bias, sample, authors = calc(
            data, result[r]['key'], files)
        risco_vies_total = 0
        for response in result1:
            trial, downgrade_n_participantes, risco_vies, risco_vies_json, sample_size = calc_score(
                response, total)
            risco_vies_total = risco_vies
            final_result[r]["downgrade_n_participantes"] = downgrade_n_participantes
            final_result[r]["risco_vies"] = risco_vies
            final_result[r]["risco_vies_json"] = risco_vies_json
            final_result[r]["i2_score"] = 0
            final_result[r]["is_rct"] = response['is_rct']
            final_result[r]["sample_size"] = sample_size

        final_result[r]["outcome"] = result[r]["outcome"]
        final_result[r]["intervention"] = result[r]["intervention"]
        final_result[r]["comparator"] = result[r]["comparator"]
        final_result[r]["bias"] = bias
        final_result[r]["sample"] = sample
        final_result[r]["risco_vies_total"] = risco_vies_total
        final_result[r]["i2"] = 75
        final_result[r]["i2_score"] = calc_heterogeneity(75)

    systematic_review = SystematicReview.find_id(uid)
    i2_str = systematic_review[0].result
    path = systematic_review[0].path
    i2 = ast.literal_eval(i2_str)
    # print( 'I2: ', i2)
    i2_result = dict()
    for i in i2:
        for r in final_result:
            tags = r.split('|')
            i_np = i[1]
            tag_np = np.array(tags)
            # print(
            #     f'----: \n\tr:{r}\ttags:{tags}\n\ti_np:{i_np}\n\ttag_np:{tag_np}\n\n')
            if i_np in tag_np:
                value = i[len(i)-1]
                print('i2 value', value)
                if len(final_result[r]["sample"]['items']) == 1:
                    final_result[r]["i2"] = 'N/A'
                    final_result[r]["i2_score"] = calc_heterogeneity(
                        float(str(75)))
                    continue
                elif 'N/A' in value or 'Not' in value:
                    value = 75
                    value = float(value)
                    final_result[r]["i2"] = value
                    final_result[r]["i2_score"] = calc_heterogeneity(
                        float(str(value)))
                    final_result[r]["i2"] = 'N/A'
                elif '=' in value:
                    value = value.split('=')[1]
                    value = re.sub(r'[^0-9\.\,]', '', value)
                    value = float(value)
                    final_result[r]["i2"] = value
                    final_result[r]["i2_score"] = calc_heterogeneity(
                        float(str(value)))

                elif '%' in str(value):
                    value = re.sub(r'[^0-9\.\,]', '', value)
                    value = float(value)
                    final_result[r]["i2"] = value
                    final_result[r]["i2_score"] = calc_heterogeneity(
                        float(str(value)))

    text = PdfPlumber.convert_pdf_to_string(path)
    amstar = Amstar(text)
    amstar_result = amstar.result()
    amstar_score = amstar_result["result"]
    amstar_values = list(amstar_result.values())
    amstar_saida = {
        "items": dict(),
        "lables": {
            "1": "allocation_concealment",
            "2": "blinding_of_outcome_assessment",
            "3": "blinding_of_participants_and_personnel",
            "4": "random_sequence_generation",
        },
        "result": amstar_values[4]
    }
    for i in range(4):
        amstar_saida["items"][f'item{(1+i)}'] = amstar_values[i]

    final_json = []
    for r in final_result:
        t = [('?', '?')]
        try:
            text_cortado = extractTextToExtract(
                text, final_result[r]["comparator"], final_result[r]["outcome"])
            t = extractTotal(text_cortado)
            if t != [('?', '?')] and check_numeric(t[0][0]) and check_numeric(t[0][1]):
                final_result[r]["downgrade_n_participantes"] = downgrade_num_participantes(
                    {
                        "sample_size": final_result[r]["downgrade_n_participantes"]
                    },
                    str(int(t[0][0])+int(t[0][1]))
                )
                print('final_result downgrade_n_participantes',
                      final_result[r]["downgrade_n_participantes"])

                final_result[r]["risco_vies_total"] = downgrade_risco_vies(
                    final_result[r], int(t[0][0])+int(t[0][1]))
            else:
                final_result[r]["downgrade_n_participantes"] = downgrade_num_participantes(
                    {
                        "sample_size": final_result[r]["downgrade_n_participantes"]
                    },
                    str(final_result[r]["sample"]["result"])
                )
                final_result[r]["risco_vies_total"] = downgrade_risco_vies(
                    final_result[r], final_result[r]["sample"]["result"])

        except Exception as e:
            print(e)
            t = [('?', '?')]

        final_result[r]["amstar_score"] = amstar_score
        final_result[r]["final_score"] = final_result[r]["risco_vies_total"] + \
            final_result[r]["downgrade_n_participantes"] + \
            final_result[r]["i2_score"] + amstar_score
        final_result[r]["risco_vies_json"]["result"] = final_result[r]["amstar_score"]
        final_result[r]["i2_json"] = dict()
        final_result[r]["i2_json"]["heterogeneity"] = dict()
        final_result[r]["i2_json"]["heterogeneity"]["i2"] = final_result[r]["i2"]
        final_result[r]["i2_json"]["heterogeneity"]["result"] = final_result[r]["i2_score"]

        _json = dict()
        _json["values"] = [
            {
                "label": final_result[r]["outcome"],
                "value": final_result[r]["outcome"]
            },
            {
                "label": final_result[r]["intervention"],
                "value": final_result[r]["intervention"]
            },
            {
                "label": final_result[r]["comparator"],
                "value": final_result[r]["comparator"]
            },
        ]

        _json["result"] = dict()
        _json["result"]["number_of_participants"] = final_result[r]["sample"]
        _json["result"]["risk_of_bias"] = final_result[r]["bias"]
        _json["result"]["heterogeneity"] = final_result[r]["i2_json"]["heterogeneity"]
        _json["result"]["amstar"] = amstar_saida
        _json["result"]["amstar_result"] = amstar_values[4]
        _json["result"]["is_rct"] = final_result[r]["is_rct"]
        _json["result"]["risco_vies_total"] = final_result[r]["risco_vies_total"]
        _json["result"]["final_score"] = final_result[r]["final_score"]

        if "?" in _json["result"]["number_of_participants"]['items']:
            _json["result"]["number_of_participants"]['items'].pop("?")

        total = _json["result"]["number_of_participants"]['total']

        if (total == 0 or '?' in total) and t[0][0] != '?' and check_numeric(t[0][0]) and check_numeric(t[0][1]):
            _json["result"]["number_of_participants"]['total'] = int(
                t[0][0])+int(t[0][1])
            _json["result"]["number_of_participants"]['result'] = int(
                t[0][0])+int(t[0][1])
            _total = _json["result"]["number_of_participants"]['total']
            size_zero = len(list(filter(
                lambda x: x == 0 or x == "???",
                _json["result"]["number_of_participants"]["items"].values()
            )))

            if size_zero > 0:
                for i in _json["result"]["number_of_participants"]["items"].keys():
                    if _json["result"]["number_of_participants"]["items"][i] == 0 or _json["result"]["number_of_participants"]["items"][i] == "???":
                        _json["result"]["number_of_participants"]["items"][i] = int(
                            float(str(_total)) / float(str(size_zero)))

        elif t[0][0] == '?':
            print(t)
            _json["result"]["number_of_participants"]['total'] = '?'

        final_json.append(_json)

    return Success.body(final_json)
