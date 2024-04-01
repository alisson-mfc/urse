import datetime
from infra.sqlite import insert, select, insert_values

class Comparators:
    def __init__(
        self, uid, outcome, intervention,
        comparator, path_files, done = 0,
        result = '', created_at = None, report_id = ''
    ):
        self.uid = uid
        self.outcome = outcome
        self.intervention = intervention
        self.comparator = comparator
        self.path_files = path_files
        self.done = done
        self.result = result
        if created_at is None:
            self.created_at = datetime.datetime.now()
        else:
            self.created_at = created_at
        self.report_id  = report_id

    def save(self):
        insert(f'INSERT INTO comparators\
        (\
            uid, outcome, intervention,\
            comparator, path_files, done, "result", created_at)\
        VALUES(\
            "{self.uid}", "{self.outcome}", "{self.intervention}",\
            "{self.comparator}", "{self.path_files}", {self.done}, "{self.result}", "{self.created_at}");')

    @staticmethod
    def find_id( uid):
        comparators = []
        def mapp(x):
            review = Comparators(x[0], x[1], x[2], x[3], x[4],x[5], x[6], x[7], x[8])
            return review
        sql = f'SELECT uid, outcome, intervention,\
            comparator, path_files, done, "result", created_at, report_id\
                from comparators WHERE uid = "{uid}";'
        select( sql, lambda x: comparators.append(mapp(x)))
        return comparators

    @staticmethod
    def update_uid_result(uid, result):
        insert_values("UPDATE comparators SET\
            done = 1, \"result\" = ? WHERE uid = ?", (result, uid))
        
    @staticmethod
    def update_uid_report_id(uid, result):
        insert_values('UPDATE comparators SET\
            report_id = ? WHERE uid = ?', (result, uid))
        
    