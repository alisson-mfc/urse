import datetime
from infra.sqlite import insert, select, insert_values

class SystematicReview:

    def __init__(self, uid, path, I2,  result, created_at, done = 0):
        self.uid = uid
        self.path = path
        self.I2 = I2
        self.done = done
        self.result = result
        if created_at is None:
            self.created_at = datetime.datetime.now()
        else:
            self.created_at = created_at

    def save(self):
        insert(f'INSERT INTO systematic_review \
            (uid, "path", I2, done, "result", created_at)\
        VALUES\
            ("{self.uid}", "{self.path}", "{self.I2}", {self.done}, "{self.result}", "{self.created_at}");')

    @staticmethod
    def find_id( uid):
        sys_reviews = []
        def mapp(x):
            review = SystematicReview(x[1], x[2], x[3], x[5], x[6],x[4])
            return review
        sql = f'SELECT * from systematic_review WHERE uid = "{uid}";'
        review = select( sql, lambda x: sys_reviews.append(mapp(x)))
        return sys_reviews
    
    @staticmethod
    def upadte_i2(uid, result):
        insert_values("UPDATE systematic_review SET\
            done = 1, \"result\" = ? WHERE uid = ?", (result, uid))
       