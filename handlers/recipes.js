
var recipe_data = require("../data/recipes.js");


/**
 *  start, number, callback 
 *  start, number, ordervals, callback 
 *  filterfieldvals, start, number, ordervals, callback 
 */
exports.get_recipes = function () {
    recipe_data.list_recipes.apply(this, arguments);
};

exports.add_cell_data = function (cell_data, callback) {
    recipe_data.add_cell_data(cell_data, callback);
};

exports.get_cell_by_id = function (cell_id, callback) {
    recipe_data.get_cell_by_id(cell_id, callback);
};

exports.update_cell = function (cell_data, callback) {
    recipe_data.update_cell(cell_data, callback);
};

exports.delete_cell_by_id = function (cell_id, callback) {
    recipe_data.delete_cell_by_id(cell_id, callback);
};