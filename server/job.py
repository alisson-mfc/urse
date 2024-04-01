import schedule
import time
import requests
from entities.FinalReview import FinalReview

def job():
    reviews = FinalReview.find_all_reviews()    
    for review in reviews:
        if not review.response:
            uid = review.uid
            resp = requests.get(f'http://localhost:5000/comparators-robot/{uid}')
            print( resp )
            time.sleep(2)
            resp = requests.get(f'http://localhost:5000/comparators-robot-job/{uid}')
            print( resp )
            time.sleep(2)
            resp = requests.get(f'http://localhost:5000/systematic_review/i2/{uid}')
            print( resp )
            time.sleep(2)
            resp = requests.get(f'http://localhost:5000/comparators-calc/{uid}')
            print( resp )
            time.sleep(2)


# schedule.every(10).seconds.do(job)

# while True:
#     schedule.run_pending()
#     time.sleep(1)

job()