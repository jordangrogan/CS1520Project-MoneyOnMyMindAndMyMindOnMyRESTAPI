"""
	Money on My Mind, and My Mind on My REST API
	CS 1520 Fall 2017 Assignment 5
	Jordan Grogan
	Tu/Th 6:00 Lecture / Th 7:30 Recitation
"""

from flask import Flask, request, session, url_for, redirect, render_template, flash
from datetime import datetime
from flask_restful import Api
#from resources import CategoryResource, PurchaseResource

app = Flask(__name__)

#api = Api(app, prefix="/api")
#api.add_resource(CategoryResource, '/cats/', endpoint='cats')
#api.add_resource(PurchaseResource, '/purchases/', endpoint='purchases')

# by default, direct to login
@app.route("/", methods=['GET', 'POST'])
def default():
	"""Default page."""

	return render_template('budget.html')
