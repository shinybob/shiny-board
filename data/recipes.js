
var db = require("./db.js"),
    async = require('async');

/**
 *  start, number, callback 
 *  start, number, ordervals, callback 
 *  filterfieldvals, start, number, ordervals, callback 
 */
exports.list_recipes = function () {
    var start, number, callback, ordervals, filterfieldvals;

    switch (arguments.length) {
      case 3:
        start = arguments[0];
        number = arguments[1];
        callback = arguments[2];
        break;
      case 4:
        start = arguments[0];
        number = arguments[1];
        ordervals = arguments[2];
        callback = arguments[3];
        break;
      case 5:
        filterfieldvals = arguments[0];
        start = arguments[1];
        number = arguments[2];
        ordervals = arguments[3];
        callback = arguments[4];
        break;
      default:
        throw new Error("This is not a valid use");
    }

    var filter = filterfieldvals ? filterfieldvals : {};
    var orderby = ordervals ? ordervals : { name : 1 };
    var output = [];

    var cursor = db.recipes.find(filter)
        .sort(orderby)
        .skip(start)
        .limit(number);

    cursor.on("data", function (recipe) {
        output.push(recipe);
    });

    cursor.once("end", function () {
        callback(null, output);
    });
};

exports.add_cell_data = function (cell_data, callback) {

    console.log("Rob - About to add recipe")
    try {
        if (!cell_data.name) throw new Error("missing_name");
        if (!cell_data.url) throw new Error("missing_url");
    } catch (e) {
        console.log("Rob - Error thrown!!!!")
        return callback({ error: e.message, message: "Please complete fields."});

    }
    console.log("Rob - Should not rech this")


    async.waterfall([
    // console.log("Should not be here if missing data!!!!!!!!")
        // get a unique id for this new recipe.
        function (cb) {
            get_unique_cell_id(cell_data, cb);
        },
        // pass it on to the database.
        function (cell_id, cb) {
            cell_data = JSON.parse(JSON.stringify(cell_data));
            cell_data.cell_id = cell_id;
            console.log(JSON.parse(JSON.stringify(cell_data)));

            db.recipes.insertOne(cell_data, { w: 1 }, cb);
        }
    ], function (err, results) {
        callback(err, results);
    });
};

exports.get_cell_by_id = function (cell_id, callback) {
    var found_cell = null;

    var cursor = db.recipes.find({ cell_id: cell_id }).limit(1);

    cursor.on("data", function (cell) {
        found_cell = cell;
    });

    cursor.on("end", function () {
        callback(null, found_cell);
    });
};


exports.update_cell = function (cell_data, callback) {
    async.waterfall([
        function (cb) {
            db.recipes.updateOne({ cell_id: cell_data.cell_id }, {$set: {"name":cell_data.name, "fav":cell_data.fav, "col":cell_data.col, "url":cell_data.url}} , {w: 1}, cb);
        }], function (err) {
        callback(null);
    });
};


exports.delete_cell_by_id = function (cell_id, callback) {
    async.waterfall([
        function (cb) {
            db.recipes.deleteOne({ cell_id: cell_id }, {w: 1}, cb);
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
            var cursor = db.recipes.find({ recipe_id: proposed_id }).limit(1);
            cursor.on("data", function (recipe) {
                console.log("I got a recipe.....");
                if (recipe) {
                    ok = false;
                }
            });
            cursor.once("end", function () {
                console.log("Im done.....");
                cb(null);
            });
        },
        function () {
            console.log("QUeried about OK: " + ok);
            return ok;
        },
        function (err, results) {
            callback(err, proposed_id);
        });
    
};
