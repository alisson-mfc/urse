import datetime
from infra.sqlite import select

class ComparatorsResults:
    def __init__(
        self, uid, outcome, intervention,
        comparator, result = '', path=''
    ):
        self.uid = uid
        self.outcome = outcome
        self.intervention = intervention
        self.comparator = comparator
        self.result = result
        self.path = path

    @staticmethod
    def find_results( uid):
        comparators = []
        def mapp(x):
            review = ComparatorsResults(x[0], x[1], x[2], x[3], x[4], x[5])
            return review
        sql = f'select DISTINCT uid,outcome ,intervention ,comparator, result, path_files from comparators c WHERE uid = "{uid}"'
        print(len(comparators))
        select( sql, lambda x: comparators.append(mapp(x)))
        print(len(comparators))
        return comparators

