'use strict';
var hours = ['6am', '7am', '8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm'];
var locations = [];
var makeNewElement = function(elementTag, elementContent, target){
  var newEl = document.createElement(elementTag);
  newEl.innerText = elementContent;
  target.appendChild(newEl);
};

function CookieStore (location, minHourly, maxHourly, avgSale) {
  this.location = location;
  this.minHourly = minHourly;
  this.maxHourly = maxHourly;
  this.avgSale = avgSale;
  this.hourlySales = [];
  this.totalDailySales = [];
  this.storeTotals = 0;

  // random customer amount
  this.randomNumCust = function () {
    return Math.floor(Math.random() * (this.maxHourly - this.minHourly) + this.minHourly);
  };
  // calculate cookie sales
  this.calcCookieSales = function() {
    for (var i = 0; i < hours.length; i++) {
      this.totalDailySales[i] = Math.floor(this.randomNumCust() * this.avgSale);
      this.storeTotals += this.totalDailySales[i];
    }
  };

  // create a row of data for each store
  this.createTableRow = function() {
    var table = document.getElementById('store-data');
    var tr = document.createElement('tr');
    var tBody = document.getElementById('store-body');
    var locationCell = document.createElement('td');
    tBody.appendChild(tr);
    // create table header
    makeNewElement('th', this.location, tr);
    for (var i = 0; i < this.totalDailySales.length; i++) {
      makeNewElement('td', this.totalDailySales[i], tr);
    }
    locationCell.innerText = this.storeTotals;
    tr.appendChild(locationCell);
  };
  this.renderSales = function() {
    this.calcCookieSales();
    this.createTableRow();
  };
  locations.push(this);
};

var createStoreTable = function() {
  var content = document.getElementById('content');
  var table = document.createElement('table');
  table.id = 'store-data';
  content.appendChild(table);
  var tHead = document.createElement('thead');
  table.appendChild(tHead);
  var tBody = document.createElement('tbody');
  tBody.id = 'store-body';
  table.appendChild(tBody);
  var tr = document.createElement('tr');
  tHead.appendChild(tr);
  var th = document.createElement('th');
  th.innerText = ' ';
  tr.appendChild(th);
  for (var i = 0; i < hours.length; i++) {
    makeNewElement('th', hours[i], tr);
  }
  makeNewElement('th', 'Store Totals: ', tr);
};
createStoreTable();

// create total cookie row
function createTotalRow() {
  var table = document.getElementById('store-data');
  var tr = document.createElement('tr');
  var tBody = document.getElementById('store-body');
  tBody.appendChild(tr);
  makeNewElement('th', 'Total: ', tr);
  var allTotal = 0;
  for (var i = 0; i < hours.length; i++) {
    var hourlySales = 0;
    for (var j = 0; j < locations.length; j++) {
      hourlySales += locations[j].totalDailySales[i];
    }
    makeNewElement('td', hourlySales, tr);
    allTotal += hourlySales;
  }
  makeNewElement('td', allTotal, tr);
};

var firstAndPike = new CookieStore('1st and Pike', 23, 65, 6.3);
var seatac = new CookieStore('SeaTac Airport', 3, 24, 1.2);
var seattleCent = new CookieStore('Seattle Center', 11, 38, 3.7);
var capHill = new CookieStore('Capitol Hill', 20, 38, 2.3);
var alki = new CookieStore('Alki', 2, 16, 4.6);

function populateTable(){
  var tBody = document.getElementById('store-body');
  tBody.innerHTML = '';
  for(var i = 0; i < locations.length; i++){
    locations[i].renderSales();
  }
  createTotalRow();
}
populateTable();

var submitForm = document.getElementById('newStoreForm');
function postForm(event) {
  event.preventDefault();
  var location = event.target[1].value;
  var minHourly = parseInt(event.target[2].value);
  var maxHourly = parseInt(event.target[3].value);
  var avgSale = parseFloat(event.target[4].value);
  var newStore = new CookieStore(location, minHourly, maxHourly, avgSale);
  newStore.renderSales();
  populateTable();
};

submitForm.addEventListener('submit', postForm);
