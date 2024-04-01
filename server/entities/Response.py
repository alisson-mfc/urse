from flask import jsonify

class Response:
    def __ini__(self):
        ...

    @staticmethod
    def body(message, instance):
        return jsonify({
            "status": instance.status,
            "message": instance.data
        }), instance.status_code

class Success(Response):
    def __init__(self, message):
        self.data = message
        self.status = 'success'
        self.status_code = 200
    @staticmethod
    def body(message):
        suc = Success(message)
        return Response.body(message, suc)

class SuccessList(Response):
    def __init__(self, message):
        self.data = message
        self.status = 'success'
        self.status_code = 200
    @staticmethod
    def body(message):
        suc = SuccessList(message)
        return Response.body(message, suc)

class Error(Response):
    def __init__(self, message):
        self.data = message
        self.status = 'error'
        self.status_code = 400

    @staticmethod
    def body(message):
        suc = Error(message)
        return Response.body(message, suc)
