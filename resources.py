from flask_restful import Resource, fields, reqparse, marshal_with, abort
from flask import request, session
from datetime import datetime

categories = [{'id':0, 'cat': 'Uncategorized', 'budget': 0.0}]
purchases = []

category_fields = {
    'id': fields.Integer,
    'cat': fields.String,
    'budget': fields.Float
}

purchases_fields = {
    'date': fields.DateTime(dt_format='iso8601'),
    'purpose': fields.String,
    'cat': fields.String,
    'amount': fields.Float
}

catParser = reqparse.RequestParser(bundle_errors=True)
catParser.add_argument('cat', type=str, required=True, location='json')
catParser.add_argument('budget', type=float, required=True, location='json')

purParser = reqparse.RequestParser(bundle_errors=True)
purParser.add_argument('date', type=str, required=True, location='json')
purParser.add_argument('purpose', type=str, required=True, location='json')
purParser.add_argument('cat_id', type=int, required=True, location='json')
purParser.add_argument('amount', type=float, required=True, location='json')

class CategoryResource(Resource):
    def delete(self, id):
        print("------ DELETE REQUEST ------")
        if(id != 0):
            del categories[id]
            return {}, 204 # Success, but "no content"
        else:
            abort(403, message="Cannot delete uncategorized.")

class CategoryListResource(Resource):
    @marshal_with(category_fields)
    def get(self):
        print("------ GET REQUEST ------")
        return categories

    @marshal_with(category_fields)
    def post(self):
        print("------ POST REQUEST ------")
        #parsed_args = request.get_json()
        parsed_args = catParser.parse_args()
        category = {'id':len(categories),'cat':parsed_args['cat'], 'budget':parsed_args['budget']}
        categories.append(category)
        return category, 201

class PurchaseListResource(Resource):
    @marshal_with(purchases_fields)
    def get(self):
        print("------ GET REQUEST ------")

        query_parser = reqparse.RequestParser()
        query_parser.add_argument('month', type=str) # Expecting format YYYYMM

        query_args = query_parser.parse_args()

        date = None

        if query_args['month']:
            date = datetime.strptime(query_args['month'], "%Y%m")
            purchasesFiltered = [purchase for purchase in purchases if purchase["date"].month==date.month and purchase["date"].year==date.year]
        else:
            purchasesFiltered = purchases

        return purchasesFiltered

    @marshal_with(purchases_fields)
    def post(self):
        print("------ POST REQUEST ------")
        parsed_args = purParser.parse_args()
        date = datetime.strptime(parsed_args['date'], "%Y-%m-%d")
        purchase = {'date':date, 'purpose':parsed_args['purpose'], 'cat':categories[parsed_args['cat_id']]['cat'], 'amount':parsed_args['amount']}
        purchases.append(purchase)
        return purchase, 201
