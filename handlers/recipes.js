
var recipe_data = require("../data/cells.js");


exports.get_user_cells = function (user_id, callback) {
    recipe_data.list_recipes(user_id, callback);
};

exports.add_cell_data = function (cell_data, callback) {
    recipe_data.add_cell_data(cell_data, callback);
};
//
// exports.get_cell_by_id = function (cell_id, callback) {
//     recipe_data.get_cell_by_id(cell_id, callback);
// };

exports.update_cell = function (cell_data, callback) {
    recipe_data.update_cell(cell_data, callback);
};

exports.delete_cell_by_id = function (cell_id, callback) {
    recipe_data.delete_cell_by_id(cell_id, callback);
};

exports.delete_all_cells = function (callback) {
    recipe_data.delete_all(callback);
};