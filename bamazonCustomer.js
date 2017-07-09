var mysql = require("mysql");
var inquirer = require("inquirer");
var itemDisplay;
var purchaseResponse;
var chosenItemId;
var chosenItemPrice;
var chosenItemStock;

var connection = mysql.createConnection({
 host: "localhost",
 port: 3306,

 // Your username
 user: "root",

 // Your password
 password: "lkjfds28",
 database: "bamazon"
});

connection.connect(function(err) {
 if (err) throw err;
 console.log("connected as id " + connection.threadId);
 console.log("-------------------------------------------------------------------------------------------");
 console.log("Welcome to Bamazon! Please take a look at the items available for sale today!");
 mainMenu();
});

function mainMenu(){
	
	connection.query("SELECT * FROM products", function(err, res) {
		itemDisplay = res;
        if (err) throw err;
        console.log('\n');
        	for (var i = 0; i<itemDisplay.length; i++){
	           var displayItems = "-------------------------------------------------------------------------------------------" + "\r\n" +
	           " Item Id: " + itemDisplay[i].item_id + "     Product Name: " + itemDisplay[i].product_name + "      Department Name: " + itemDisplay[i].department_name + 
	           "     Price: " + itemDisplay[i].price
	           console.log(displayItems);
	          };
       inquirer.prompt([
   {
       type: "input",
       name: "itemId",
       message: "Which item ID would you like to purchase?"
   },{
       type: "input",
       name: "quantity",
       message: "How many of this item would you like to purchase?"
   }
   ]).then(function(purchase){
   		purchaseResponse = purchase;
        for (var a = 0; a<itemDisplay.length; a++){
           	 if (itemDisplay[a].item_id == purchaseResponse.itemId){
               chosenItemId = itemDisplay[a].item_id;
               chosenItemPrice = +itemDisplay[a].price;
               chosenItemStock = +itemDisplay[a].stock_quantity;
             }
         }

           	if (chosenItemStock < purchaseResponse.quantity && chosenItemStock > 0){
                   console.log("Insufficient Quantity! There's only " + chosenItemStock + " left in stock.");
                   inquirer.prompt([
                   {
                   		type: "list",
                   		message: "Would you like to purchase the just the remaining inventory?",
                   		choices: ["Yes", "No, take me back to the item list"],
                   		name: "stock"
                   }
                   ]).then(function(stockResponse){
                   		switch(stockResponse.stock){
                   			case "Yes":
                   				purchaseResponse.quantity = chosenItemStock;
                   				completePurchase();
                   				break;
                   			case "No, take me back to the item list":
                   				mainMenu();
                   				break;
                   		}
                   	 });
            }

            if (chosenItemStock == 0){
            	console.log("Unfortunately this item is completely out of stock. Please select another item to purchase.");
            	mainMenu();
            }

            if (chosenItemStock >= purchaseResponse.quantity){
                completePurchase();
            }
       });
 });

function completePurchase(){
	var newStock = chosenItemStock - purchaseResponse.quantity;
	var totalCost = chosenItemPrice * purchaseResponse.quantity;
	connection.query("UPDATE products SET ? WHERE ? ", [
             {stock_quantity:  newStock },
             {item_id: purchaseResponse.itemId}
             ], function(err, res) {
             	if (err) throw err;
                	console.log ("You have completed your purchase! You will be charged a total of $" + totalCost + " Please take a look at our other available items.");
                	mainMenu();
                });
            };

};



