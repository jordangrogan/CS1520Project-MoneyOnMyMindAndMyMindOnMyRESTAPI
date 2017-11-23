from flask_restful import Resource, fields, reqparse, marshal_with, abort
from flask import request, session
from datetime import datetime

categories = [{'cat': 'uncategorized', 'status': 0, 'budget': 0}]
purchases = []

category_fields = {
    'cat': fields.String,
    'status': fields.Float,
    'budget': fields.Float
}

purchases_fields = {
    'date': fields.String,
    'purpose': fields.String,
    'cat': fields.String,
    'amount': fields.Float
}

class CategoryResource(Resource):
    def delete(self, id):
        print("------ DELETE REQUEST ------")
        del categories[id]
        return {}, 204 # Success, but "no content"

class CategoryListResource(Resource):
    @marshal_with(category_fields)
    def get(self):
        print("------ GET REQUEST ------")
        return categories

    @marshal_with(category_fields)
    def post(self):
        print("------ POST REQUEST ------")
        parsed_args = request.get_json()
        category = {'cat':parsed_args['cat'], 'status':0, 'budget':parsed_args['budget']}
        categories.append(category)
        return category, 201

class PurchaseListResource(Resource):
    @marshal_with(purchases_fields)
    def get(self):
        print("------ GET REQUEST ------")
        return purchases

    @marshal_with(purchases_fields)
    def post(self):
        print("------ POST REQUEST ------")
        parsed_args = request.get_json()
        purchase = {'date':parsed_args['date'], 'purpose':parsed_args['purpose'], 'cat':parsed_args['cat'], 'amount':parsed_args['amount']}
        purchases.append(purchase)
        return purchase, 201
