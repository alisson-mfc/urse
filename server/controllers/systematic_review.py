from app import app
from flask import jsonify
from flask import request, url_for
from werkzeug.utils import secure_filename
import os
from entities.Response import Success, Error

from infra import NlpHelper, PdfMiner
import re
from ast import DictComp
from entities import I2
from entities.Review import Review
from entities.SystematicReview import SystematicReview
from entities.Comparators import Comparators
from entities.FinalReview import FinalReview
from infra import I2Extract3 as I2Extract
# from infra import I2Extract
import pickle

UPLOAD_FOLDER = os.getcwd()+'/uploads'
ALLOWED_EXTENSIONS = {'pdf'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER



def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/systematic_review", methods=['POST'])
def save():
    if 'uid' not in request.form:
        return Error.body('No UID passed')
    
    if 'file' not in request.files:
        return  Error.body('No files')

    file = request.files['file']
    if file.filename == '':
        return  Error.body('No selected file')

    uid = request.form.get('uid')

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        review = Review.find_id(uid)
        print(review)
        if len(review) == 0:
            review = Review(uid)
            review.save()

        sys_reviews = SystematicReview.find_id(uid)
        
        if len(sys_reviews) == 0:
            file.save(filepath)
            sys_review = SystematicReview(uid, filepath, '', '', None, 0)
            sys_review.save()

        return Success.body('Systematic review uploaded complete!')


@app.route("/systematic_review/i2/<uid>", methods=['GET'])
def systematic_review_bot_i2(uid):
    reviews = SystematicReview.find_id(uid)
    comparators = Comparators.find_id(uid)
    outcomes_list = []
    comparators_list = []
    interventions_list = []

    for comparator in comparators:
        outcomes_list.append(comparator.outcome)
        comparators_list.append(comparator.comparator)
        interventions_list.append(comparator.intervention)

    filepath = reviews[0].path
    set_outcome_comparator = list(set(zip(outcomes_list, comparators_list)))
    outcomes_list2 = list(map( lambda x: x[0], set_outcome_comparator))
    comparators_list2 = list(map( lambda x: x[1], set_outcome_comparator))
    result = I2Extract.handle_i2_from_db(filepath, outcomes_list2, comparators_list2)
    
    result_str = f'{result}'
    
    SystematicReview.upadte_i2( uid, result_str)


    return Success.body('ok')

@app.route("/reviews", methods=['GET'])
def reviews_list():
    reviews = FinalReview.find_all_reviews()

    return Success.body( [ review.__dict__ for review in reviews])


