var purchases = []; // All purchases
var currentPurchases = []; // This month's purchases (filtered)
var categories = []; // All categories
var currentDate = new Date();

function setup() {
	/* Press the submit button to submit category or purchase */
	document.getElementById("addCat_submit").addEventListener("click", postCategory, true);
	document.getElementById("addPur_submit").addEventListener("click", postPurchase, true);
	getCategories();
	getPurchases();

	months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
	document.getElementById("currentMonth").innerHTML = months[currentDate.getMonth()] + " " + currentDate.getFullYear();
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

			categories = JSON.parse(httpRequest.responseText); // Parse the response of the json object we got back

			// Delete all the rows in the table
			var tableRef = document.getElementById("categories");
			while (tableRef.rows.length > 0) {
				tableRef.deleteRow(0);
			}

			// Delete all the options from the select category box
			var selectRef = document.getElementById("addPur_category");
			var len = selectRef.length;
			for (i = 0; i < len; i++) {
			  selectRef.remove(0);
			}

			// Add all the categories to the table
			categories.map(addCategory);

			// Get all the purchases from the current month to calculate the statuses
			var httpRequest = new XMLHttpRequest();

			if (!httpRequest) {
				alert('Giving up :( Cannot create an XMLHTTP instance');
				return false;
			}

			httpRequest.onreadystatechange = function() { handleGetPurchasesByMonth(httpRequest) }; // Listener on http request to listen for changes to the state
			httpRequest.open("GET", "/api/purchases/?month=" + currentDate.getFullYear() + (currentDate.getMonth()+1));
			console.log("GET Purchases By Month Requested: /api/purchases/?month=" + currentDate.getFullYear() + (currentDate.getMonth()+1));
			httpRequest.send();

		} else {
			alert("There was a problem with the get request.  you'll need to refresh the page to recieve updates again!");
		}
	}
}

function handleGetPurchasesByMonth(httpRequest) {

	if (httpRequest.readyState === XMLHttpRequest.DONE) {
		console.log("GET Purchases By Month Response:");
		console.log(httpRequest.responseText);

		if (httpRequest.status === 200) {
			currentPurchases = JSON.parse(httpRequest.responseText);

			console.log(categories.length);
			// Anytime we get purchases, we want to update category statuses

			categories.map(setCategoryStatus);

		}

	}

}

function setCategoryStatus(catItem, id) {
	var status = catItem.budget - currentPurchases.filter(purchase => purchase.cat === catItem.cat).reduce(sumPurchases, 0);
	console.log("status:" + status);
	document.getElementById("categories").rows[id].cells[1].innerText = "" + status;
}

function sumPurchases(accumulator, currentValue) {
	return accumulator + currentValue.amount;
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

	console.log(JSON.stringify(data));
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
function addCategory(item, id) {
	var tableRef = document.getElementById("categories");
	var newRow   = tableRef.insertRow();
	newRow.insertCell().appendChild(document.createTextNode(item.cat));
	newRow.insertCell().appendChild(document.createTextNode(""));
	newRow.insertCell().appendChild(document.createTextNode(item.budget));

	if(id != 0) { // We don't want a delete link for uncategorized.
		var a = document.createElement('a');
		a.onclick = function() { deleteCategory(id); };
		a.appendChild(document.createTextNode("Delete"));
		newRow.insertCell().appendChild(a);
	} else {
		newRow.insertCell();
	}

	var selectRef = document.getElementById("addPur_category");
	var opt = document.createElement('option');
	opt.value = id;
	opt.text = item.cat;
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

			purchases = JSON.parse(httpRequest.responseText); // Parse the response of the json object we got back

			// Delete all the rows in the table
			while (document.getElementById("purchases").rows.length > 0) {
				document.getElementById("purchases").deleteRow(0);
			}

			// Add all the purchases to the table
			purchases.map(addPurchase);

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

	var date = new Date(document.getElementById("addPur_date").value + ' GMT -0500');
	var purpose = document.getElementById("addPur_purpose").value;
	var category = document.getElementById("addPur_category").value;
	var amount = document.getElementById("addPur_amount").value;

	httpRequest.onreadystatechange = function() { handlePostPurchase(httpRequest) };
	httpRequest.open("POST", "/api/purchases/");
	console.log("POST Purchase Requested: /api/purchases/");

	var data = {};
	console.log(date);
	data["date"] = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();
	data["purpose"] = purpose;
	data["cat_id"] = parseInt(category);
	data["amount"] = amount;

	httpRequest.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

	console.log(JSON.stringify(data));
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
function addPurchase(item) {
	var tableRef = document.getElementById("purchases");
	var newRow   = tableRef.insertRow();
	dt = new Date(item.date);
	newRow.insertCell().appendChild(document.createTextNode((dt.getMonth()+1) + "/" + dt.getDate() + "/" + dt.getFullYear()));
	newRow.insertCell().appendChild(document.createTextNode(item.purpose));
	newRow.insertCell().appendChild(document.createTextNode(item.cat));
	newRow.insertCell().appendChild(document.createTextNode(item.amount));
}

window.addEventListener("load", setup, true);
