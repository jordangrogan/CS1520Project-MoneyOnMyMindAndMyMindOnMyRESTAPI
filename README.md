# Money on My Mind, and My Mind on My REST API

CS1520 Assignment 5

Jordan Grogan  
[jordangrogan@pitt.edu](mailto:jordangrogan@pitt.edu)  
Pitt ID: jog89 3779423

Lecture: Tuesday/Thursday 6pm  
Recitation: Thursday 7:30pm

To run, install the required dependencies in your python 3 virtual environment:  
`pip install -r requirements.txt`  
Then, set FLASK_APP to budget.py:  
`export FLASK_APP=budget.py`  
Then, run the app:  
`flask run`  
Lastly, go to [http://localhost:5000](http://localhost:5000) in Chrome (the date field works best in Chrome).

  
### Screenshot
<img src=""/screenshot.png?raw=true" height="500">


### curl Commands
GET Categories  
`curl -i http://localhost:5000/api/cats/`

POST Category  
`curl -i -H "Content-Type: application/json" -X POST -d '{"cat":"Food", "budget":100.0}' http://localhost:5000/api/cats/`

DELETE Category  
`curl -i -X DELETE http://localhost:5000/api/cats/1`  
where 1 is the ID of the category (0 is uncategorized, which cannot be deleted).

GET Purchases  
`curl -i http://localhost:5000/api/purchases/`

GET Purchases in Specified Month  
`curl -i http://localhost:5000/api/purchases/?month=201712`

POST Purchase  
`curl -i -H "Content-Type: application/json" -X POST -d '{"date":"2017-11-28", "purpose":"Description of purchase", "cat_id":1, "amount":10.0}' http://localhost:5000/api/purchases/`  
where the value for `cat_id` is the ID of the category (0 is uncategorized).
