
var db = require("./db.js"),
    async = require('async');

/**
 *  start, number, callback 
 *  start, number, ordervals, callback 
 *  filterfieldvals, start, number, ordervals, callback 
 */
exports.list_recipes = function (user_id, callback) {
    var filterfieldvals = {user_id:user_id};
    var filter = filterfieldvals ? filterfieldvals : {};
    // var orderby = ordervals ? ordervals : { name : 1 };
    var output = [];

    var cursor = db.cellsDB.find(filter)
        // .sort(orderby)
        // .skip(start)
        // .limit(number);

    cursor.on("data", function (recipe) {
        output.push(recipe);
    });

    cursor.once("end", function () {
        callback(null, output);
    });
};

exports.add_cell_data = function (cell_data, callback) {
    console.log("BE cell add")
    console.log(cell_data)
    try {
        if (!cell_data.name) throw new Error("missing_name");
        if (!cell_data.url) throw new Error("missing_url");
    } catch (e) {
        return callback({ error: e.message, message: "Please complete fields."});

    }

    async.waterfall([
        function (cb) {
            get_unique_cell_id(cell_data, cb);
        },
        function (cell_id, cb) {
            cell_data = JSON.parse(JSON.stringify(cell_data));
            cell_data.cell_id = cell_id;
            // store_image(cell_data);
            db.cellsDB.insertOne(cell_data, { w: 1 }, cb);
        }
    ], function (err, results) {
        callback(err, results);
    });
};

exports.get_cell_by_id = function (cell_id, callback) {
    var found_cell = null;

    var cursor = db.cellsDB.find({ cell_id: cell_id }).limit(1);

    cursor.on("data", function (cell) {
        found_cell = cell;
    });

    cursor.on("end", function () {
        callback(null, found_cell);
    });
};

exports.update_cell = function (cell_data, callback) {
console.log("BE cell")
console.log(cell_data)
    try {
        if (!cell_data.name) throw new Error("missing_name");
        if (!cell_data.url) throw new Error("missing_url");
    } catch (e) {
        return callback({ error: e.message, message: "Please complete fields."});
    }

    async.waterfall([
        function (cb) {
            db.cellsDB.updateOne({ cell_id: cell_data.cell_id }, {$set: {"name":cell_data.name, "image":cell_data.image,  "image_bg_colour":cell_data.image_bg_colour, "fav":cell_data.fav, "col":cell_data.col, "url":cell_data.url, "notes":cell_data.notes}} , {w: 1}, cb);
        }], function (err) {
        callback(null);
    });
};


exports.delete_cell_by_id = function (cell_id, callback) {
    async.waterfall([
        function (cb) {
            db.cellsDB.deleteOne({ cell_id: cell_id }, {w: 1}, cb);
        }], function (err) {
        callback(null);
    });
};

exports.delete_all = function (callback) {
    async.waterfall([
        function (cb) {
            db.cellsDB.deleteMany({}, {w: 1}, cb);
        }], function (err) {
        callback(null);
    });
};



/**
 * helper function to generate a recipe_id for us.
 */
function get_unique_cell_id (recipe_data, callback) {
    if (!recipe_data.name) {
        return undefined;
    }

    var ok = false;

    var proposed_id = recipe_data.name.split(" ").join("_");

    async.doUntil(
        function (cb) {
            proposed_id += "" + (new Date().getTime());

            // only set this to true if we see a recipe!
            ok = true;
            var cursor = db.cellsDB.find({ recipe_id: proposed_id }).limit(1);
            cursor.on("data", function (recipe) {
                if (recipe) {
                    ok = false;
                }
            });
            cursor.once("end", function () {
                cb(null);
            });
        },
        function () {
            return ok;
        },
        function (err, results) {
            callback(err, proposed_id);
        });
    
};
