var mysql = require("mysql");
var inquirer = require("inquirer");
var itemDisplay;
var addInventory;
var chosenItemId;
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
 managerMenu();
 });

 function managerMenu(){
 inquirer.prompt([
{
	type: "list",
	message: "Please select what you would like to do.",
	choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
	name: "manager"
}
]).then(function(managerResponse){
	switch(managerResponse.manager){
		case "View Products for Sale":
			productsSale();
			break;
		case "View Low Inventory":
			lowInventory();
			break;
		case "Add to Inventory":
			addInventory();
			break;
		case "Add New Product":
			newProduct();
			break;
	}
	});
};



function productsSale(){
	connection.query("SELECT * FROM products", function(err, res) {
		itemDisplay = res;
        if (err) throw err;
        console.log('\n');
        	for (var i = 0; i<itemDisplay.length; i++){
	           var displayItems = "-------------------------------------------------------------------------------------------" + "\r\n" +
	           " Item Id: " + itemDisplay[i].item_id + "     Product Name: " + itemDisplay[i].product_name + "      Department Name: " + itemDisplay[i].department_name + 
	           "     Price: " + itemDisplay[i].price + "     Stock Quantity: " + itemDisplay[i].stock_quantity
	           console.log(displayItems);
	          };
	    console.log('\n');
	   	managerMenu();
	});
	 
};

function lowInventory(){
	connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, res) {
		itemDisplay = res;
        if (err) throw err;
        console.log('\n');
        	for (var i = 0; i<itemDisplay.length; i++){
	           var displayItems = "-------------------------------------------------------------------------------------------" + "\r\n" +
	           " Item Id: " + itemDisplay[i].item_id + "     Product Name: " + itemDisplay[i].product_name + "      Department Name: " + itemDisplay[i].department_name + 
	           "     Price: " + itemDisplay[i].price + "     Stock Quantity: " + itemDisplay[i].stock_quantity
	           console.log(displayItems);
	          };
	    console.log('\n');
	    managerMenu();
	});
	 
};

function addInventory(){
	connection.query("SELECT * FROM products", function(err, res) {
		itemDisplay = res;
        if (err) throw err;
        console.log('\n');
        	for (var i = 0; i<itemDisplay.length; i++){
	           var displayItems = "-------------------------------------------------------------------------------------------" + "\r\n" +
	           " Item Id: " + itemDisplay[i].item_id + "     Product Name: " + itemDisplay[i].product_name + "      Department Name: " + itemDisplay[i].department_name + 
	           "     Price: " + itemDisplay[i].price + "     Stock Quantity: " + itemDisplay[i].stock_quantity
	           console.log(displayItems);
	          };
       inquirer.prompt([
   {
       type: "input",
       name: "itemId",
       message: "Which item ID would you like to add inventory for?"
   },{
       type: "input",
       name: "quantity",
       message: "How many of this item would you like to add?"
   }
   ]).then(function(inventory){
   		for (var a = 0; a<itemDisplay.length; a++){
           	 if (itemDisplay[a].item_id == inventory.itemId){
               chosenItemId = itemDisplay[a].item_id;
               chosenItemStock = +itemDisplay[a].stock_quantity;
             }
         }
   		connection.query("UPDATE products SET ? WHERE ? ", [
             {stock_quantity:  +inventory.quantity + chosenItemStock},
             {item_id: inventory.itemId}
             ], function(err, res) {
             	if (err) throw err;
                	console.log ("The item's inventory has been updated!");
                	console.log('\n');
                	managerMenu();
                })
   	});
   
	});
	//managerMenu(); 
};

function newProduct(){
	inquirer.prompt([
   {
       type: "input",
       name: "name",
       message: "What is the name of the item?"
   },{
       type: "input",
       name: "department",
       message: "What department does the item belong in?"
   },{
       type: "input",
       name: "price",
       message: "How much would you like to sell the item for?"
   },{
   	   type: "input",
       name: "stock",
       message: "How many do you have in inventory?"
   }
   ]).then(function(addProduct){
       connection.query("INSERT INTO products SET ?", {
         product_name: addProduct.name,
         department_name: addProduct.department,
         price: addProduct.price,
         stock_quantity: addProduct.stock
       }, function(err, res) {
         if (err) throw err;
         console.log("You have successfully added the new item!");
         console.log('\n');
         managerMenu();
       });
       
   });
    
};





