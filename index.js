
var express = require('express'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    recipe_handler = require("./handlers/recipes.js"),
    db = require("./data/db.js"),
    async = require("async");

var app = express();

// var _port = 8082;
// new line
app.set('port', (process.env.PORT || 5000));

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/static"));

app.get("/v1/cells.json", function (req, res) {
    var start = req.query.start ? parseInt(req.query.start) : 0;
    var pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 100;

    recipe_handler.get_recipes(start, pageSize, function (err, recipes) {
        if (err) {
            return send_error_resp(res, err);
        } else {
            return send_success_resp(res, recipes);
        }
    });
});

app.get("/v1/cells/:cell_id.json", function (req, res) {
    recipe_handler.get_cell_by_id(req.params.cell_id, function (err, cell) {
        if (err) {
            return send_error_resp(res, err);
        } else if (!cell) {
            return send_error_resp(res, 400, "no_such_cell", "That does not appear to be a valid cell for cell_id ");
        } else {
            send_success_resp(res, cell);
        }
    });
});

app.put("/v1/cells.json", function (req, res) {
    console.log("Rob - BE - Recieved put for adding ne cell");
    recipe_handler.add_cell_data(req.body, function(err, recipe) {
        if (err) {
            return send_error_resp(res, err);
        } else {
            return send_success_resp(res, recipe);
        }
    });
});

app.post("/v1/cells.json", function (req, res) {
    recipe_handler.update_cell(req.body, function(err, recipe) {
        if (err) {
            return send_error_resp(res, err);
        } else {
            return send_success_resp(res, recipe);
        }
    });
});

app.post("/v1//upload", function (req, res) {
    // recipe_handler.update_cell(req.body, function(err, recipe) {
    //     if (err) {
    //         return send_error_resp(res, err);
    //     } else {
    //         return send_success_resp(res, recipe);
    //     }
    // });
});


app.delete("/v1/cells/:cell_id.json", function (req, res) {
    recipe_handler.delete_cell_by_id(req.params.cell_id, function(err) {
        if (err) {
            return send_error_resp(res, err);
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send();
            res.end();
        }
    });
});


db.init_db(function (err) {
    if (err) {
        console.log("Error initialising DB, aborting: " + JSON.stringify(err, 0, 2));
        exit(-1);
    } else {
        console.error("Starting Server.");
        app.listen(app.get('port'));
    }
});







/**
 * res, http_status, code, message
 * res, http_status, err obj
 * res, err obj
 */
function send_error_resp() {
    var res, http_status, code, message;
    if (arguments.length == 4) {
        res = arguments[0];
        http_status = arguments[1];
        code = arguments[2];
        message = arguments[3];
    } else if (arguments.length == 3) {
        res = arguments[0];
        http_status = arguments[1];
        code = arguments[2].error;
        message = arguments[2].message;
    } else if (arguments.length == 2) {
        res = arguments[0];
        http_status = _http_code_from_error(arguments[1].error);
        code = arguments[1].error;
        message = arguments[1].message;
    } else {
        console.error("send_error_resp: YOU'RE DOING IT WRONG");
        throw new Error("send_error_resp called wrong-est-ly");
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(http_status).send(JSON.stringify({ error: code, message: message }));
    res.end();
}

function send_success_resp(res, obj) {
    if (arguments.length != 2) {
        console.error("send_success_resp: YOU'RE DOING IT WRONG");
        throw new Error();
    }
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify(obj));
    res.end();
}


function _http_code_from_error (error_code) {
    switch (error_code) {
      // add other messages here when they're not server problems.
      default:
        return 503;
    }
}


