function setup() {
	/* Press the submit button to submit chat message */
	document.getElementById("addCat_submit").addEventListener("click", postCategory, true);
	document.getElementById("addPur_submit").addEventListener("click", postPurchase, true);
	getCategories();
	getPurchases();
}

function getCategories() {
	var httpRequest = new XMLHttpRequest();

	if (!httpRequest) {
		alert('Giving up :( Cannot create an XMLHTTP instance');
		return false;
	}

	httpRequest.onreadystatechange = function() { handleGetCategories(httpRequest) }; // Listener on http request to listen for changes to the state
	httpRequest.open("GET", "/api/cats/");
	console.log("GET Categories Requested: /api/cats/");
	httpRequest.send();
}

function handleGetCategories(httpRequest) {
	if (httpRequest.readyState === XMLHttpRequest.DONE) {
		console.log("GET Categories Response:");
		console.log(httpRequest.responseText);

		if (httpRequest.status === 200) {

			var rows = JSON.parse(httpRequest.responseText); // Parse the response of the json object we got back

			// Delete all the rows in the table
			var tableRef = document.getElementById("categories");
			while (tableRef.rows.length > 1) {
				tableRef.deleteRow(1);
			}

			// Delete all the options from the select category box
			var selectRef = document.getElementById("addPur_category");
			var len = selectRef.options.length;
			for (i = 0; i < len; i++) {
			  selectRef.options[i] = null;
			}

			for (var i = 0; i < rows.length; i++) { // add all the rows from the response
				addCategory(i, rows[i]["cat"], rows[i]["status"], rows[i]["budget"]);
			}
		} else {
			alert("There was a problem with the get request.  you'll need to refresh the page to recieve updates again!");
		}
	}
}

function postCategory() {
	var httpRequest = new XMLHttpRequest();

	if (!httpRequest) {
		alert('Giving up :( Cannot create an XMLHTTP instance');
		return false;
	}

	var category = document.getElementById("addCat_category").value;
	var budget = document.getElementById("addCat_budget").value;

	httpRequest.onreadystatechange = function() { handlePostCategory(httpRequest) };
	httpRequest.open("POST", "/api/cats/");
	console.log("POST Category Requested: /api/cats/");

	var data = {};
	data["cat"] = category;
	data["budget"] = budget;

	httpRequest.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

	httpRequest.send(JSON.stringify(data));
}

function handlePostCategory(httpRequest) {
	if (httpRequest.readyState === XMLHttpRequest.DONE) {
		console.log("POST Category Response:");
		console.log(httpRequest.responseText);

		if (httpRequest.status >= 200 && httpRequest.status < 300) {
			// Clear fields
			document.getElementById("addCat_category").value = "";
			document.getElementById("addCat_budget").value = "";
			// Get updated categories & purchases
			getCategories();
			getPurchases();
		} else {
			alert("There was a problem with the post request.");
		}
	}
}

function deleteCategory(id) {
	var httpRequest = new XMLHttpRequest();

	if (!httpRequest) {
		alert('Giving up :( Cannot create an XMLHTTP instance');
		return false;
	}

	httpRequest.onreadystatechange = function() { handleDeleteCategories(httpRequest) }; // Listener on http request to listen for changes to the state
	httpRequest.open("DELETE", "/api/cats/" + id);
	console.log("DELETE Category Requested: /api/cats/" + id);

	httpRequest.send();
}

function handleDeleteCategories(httpRequest) {
	if (httpRequest.readyState === XMLHttpRequest.DONE) {
		console.log("DELETE Category Response:");
		console.log(httpRequest.responseText);

		if (httpRequest.status >= 200 && httpRequest.status < 300) {
			// Get updated categories & purchases
			getCategories();
			getPurchases();
		} else {
			alert("There was a problem with the delete request.  you'll need to refresh the page to recieve updates again!");
		}
	}
}

/*	Adds category to the categories table */
function addCategory(id, cat, status, budget) {
	var tableRef = document.getElementById("categories");
	var newRow   = tableRef.insertRow();
	newRow.insertCell().appendChild(document.createTextNode(cat));
	newRow.insertCell().appendChild(document.createTextNode(status + "/" + budget));
	var a = document.createElement('a');
	a.onclick = function() { deleteCategory(id); };
	a.appendChild(document.createTextNode("Delete"));
	newRow.insertCell().appendChild(a);

	var selectRef = document.getElementById("addPur_category");
	var opt = document.createElement('option');
	opt.value = id;
	opt.text = cat;
	selectRef.appendChild(opt);

}

function getPurchases() {
	var httpRequest = new XMLHttpRequest();

	if (!httpRequest) {
		alert('Giving up :( Cannot create an XMLHTTP instance');
		return false;
	}

	httpRequest.onreadystatechange = function() { handleGetPurchases(httpRequest) }; // Listener on http request to listen for changes to the state
	httpRequest.open("GET", "/api/purchases/");
	console.log("GET Purchases Requested: /api/purchases/");
	httpRequest.send();
}

function handleGetPurchases(httpRequest) {
	if (httpRequest.readyState === XMLHttpRequest.DONE) {
		console.log("GET Purchases Response:");
		console.log(httpRequest.responseText);

		if (httpRequest.status === 200) {

			var rows = JSON.parse(httpRequest.responseText); // Parse the response of the json object we got back

			// Delete all the rows in the table
			var tableRef = document.getElementById("purchases");
			while (tableRef.rows.length > 1) {
				tableRef.deleteRow(1);
			}

			for (var i = 0; i < rows.length; i++) { // add all the rows from the response
				addPurchase(i, rows[i]["date"], rows[i]["purpose"], rows[i]["cat"], rows[i]["amount"]);
			}
		} else {
			alert("There was a problem with the get request.  you'll need to refresh the page to recieve updates again!");
		}
	}
}

function postPurchase() {
	var httpRequest = new XMLHttpRequest();

	if (!httpRequest) {
		alert('Giving up :( Cannot create an XMLHTTP instance');
		return false;
	}

	var date = document.getElementById("addPur_date").value;
	var purpose = document.getElementById("addPur_purpose").value;
	var category = document.getElementById("addPur_category").value;
	var amount = document.getElementById("addPur_amount").value;

	httpRequest.onreadystatechange = function() { handlePostPurchase(httpRequest) };
	httpRequest.open("POST", "/api/purchases/");
	console.log("POST Purchase Requested: /api/purchases/");

	var data = {};
	data["date"] = date;
	data["purpose"] = purpose;
	data["cat_id"] = parseInt(category);
	data["amount"] = amount;

	httpRequest.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

	httpRequest.send(JSON.stringify(data));
}

function handlePostPurchase(httpRequest) {
	if (httpRequest.readyState === XMLHttpRequest.DONE) {
		console.log("POST Purchase Response:");
		console.log(httpRequest.responseText);

		if (httpRequest.status >= 200 && httpRequest.status < 300) {
			// Clear fields
			document.getElementById("addPur_date").value = "";
			document.getElementById("addPur_purpose").value = "";
			document.getElementById("addPur_category").value = "";
			document.getElementById("addPur_amount").value = "";
			// Get updated categories & purchases
			getCategories();
			getPurchases();
		} else {
			alert("There was a problem with the post request.");
		}
	}
}

/*	Adds category to the categories table */
function addPurchase(id, date, purpose, cat, amount) {
	var tableRef = document.getElementById("purchases");
	var newRow   = tableRef.insertRow();
	newRow.insertCell().appendChild(document.createTextNode(date));
	newRow.insertCell().appendChild(document.createTextNode(purpose));
	newRow.insertCell().appendChild(document.createTextNode(cat));
	newRow.insertCell().appendChild(document.createTextNode(amount));
}

window.addEventListener("load", setup, true);
