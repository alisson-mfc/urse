from app import app
from flask import jsonify
from flask import request, url_for
import os
from entities.FinalReview import FinalReview
from entities.Response import Success, Error

@app.route("/save-final-review/<uid>", methods=['POST'])
def save_final_reviews(uid):
    response = request.get_json()
    review = FinalReview.find_id(uid)
    if len(review) == 0:
        review = FinalReview(uid, response=response)
        review.save()
    else:
        review.response = response
        review.update()

    return Success.body('Final review uploaded complete!')

