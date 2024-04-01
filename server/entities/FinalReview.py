import datetime
from infra.sqlite import insert, select


class FinalReview:
    def __init__(self, uid, response, created_at=None, path=None):
        self.uid = uid
        self.response = response
        if created_at is None:
            self.created_at = datetime.datetime.now()
        else:
            self.created_at = created_at
        self.path = path

    def save(self):
        insert(
            f'INSERT INTO final_review (uid, response, created_at) VALUES("{self.uid}", "{self.response}","{self.created_at}")'
        )

    @staticmethod
    def find_id(uid):
        reviews = []

        def mapp(x):
            review = FinalReview(x[1], x[2], x[3])
            return review

        sql = f'SELECT uid, response, created_at from final_review WHERE uid = "{uid}";'
        select(sql, lambda x: reviews.append(mapp(x)))
        return reviews

    @staticmethod
    def find_all():
        reviews = []

        def mapp(x):
            review = FinalReview(x[1], x[2], x[3])
            return review

        sql = f"SELECT uid, response, created_at from final_review order by created_at asc;"
        select(sql, lambda x: reviews.append(mapp(x)))
        return reviews

    @staticmethod
    def update():
        insert(
            f'UPDATE final_review set response= "{self.response}" where uid = "{self.uid}"; '
        )

    @staticmethod
    def find_all_reviews():
        reviews = []

        def mapp(x):
            review = FinalReview(x[0], x[1], x[2], x[3])
            return review

        sql = f"select r.uid, fr.response, r.created_at, sr.path   from reviews r  left join final_review fr on r.uid = fr.uid join systematic_review sr on sr.uid = r.uid order by r.created_at asc;"
        select(sql, lambda x: reviews.append(mapp(x)))
        return reviews
