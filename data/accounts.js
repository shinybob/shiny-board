var db = require("./db.js"),
    async = require('async');

var use_name_min_length = 3;
var use_name_max_length = 16;
var password_min_length = 6;
var password_max_length = 20;
var email_min_length = 4;
var email_max_length = 60;

var user_name_invalid_error = {error:200, message:"Please enter a valid user name!"};
var user_name_not_found_error = {error: 200, message: "User name could not be found!"};
var user_name_exists_error = {error:200, message:"User name taken!"};
var email_exists_error = {error:200, message:"Email address is already in use!"};
var passsword_invalid_error = {error:200, message:"Please enter a valid password!"};
var password_incorrect_error = {error: 200, message: "Incorrect password"};

var email_to_short = {error: 200, message: "Email must be at least 4 characters!"};
var email_to_long = {error: 200, message: "Password exceeded maximum length!"};
var email_invalid = {error:200, message:"Please enter a valid email address!"};

var password_to_short = {error: 200, message: "Password must be at least 6 characters!"};
var password_to_long = {error: 200, message: "Password exceeded maximum length!"};
var password_invalid_characters = {error: 200, message: "Password must contain letters and numbers"};

var user_name_to_short = {error: 200, message: "User name must be at least 3 characters!"};
var user_name_to_long = {error: 200, message: "User name exceeded maximum length!"};
var user_name_invalid_characters = {error: 200, message: "User name must only contain alphanumeric characters!"};

var user_not_found = {error: 200, message: "User not found!"};

exports.get_user_data_from_id = function (user_to_find, callback) {
    var found_user_data = null;
    var filter = {user_id: Number(user_to_find.user_id)};
    var cursor = db.accountsDB.find(filter).limit(1);

//rob1479980359177 password1 1479980360474
//rob1479980383504 password1 1479980384591

    cursor.on("data", function (user_data) {
        found_user_data = user_data;
    });

    cursor.on("end", function () {
        callback(null, found_user_data);
    });
};

exports.login = function (user_data, callback) {
    if (user_data.name == null || user_data.name.length < use_name_min_length) return callback(user_name_invalid_error);
    if (user_data.password == null || user_data.password.length < password_min_length) return callback(passsword_invalid_error);

    var found_user = null;
    var filter = {name: user_data.name};
    var cursor = db.accountsDB.find(filter).limit(1);

    cursor.on("data", function (user) {
        found_user = user;
    });

    cursor.on("end", function () {
        if (found_user === null) {
            callback(user_name_not_found_error)
        } else if (found_user.password !== user_data.password) {
            callback(password_incorrect_error)
        } else {
            callback(null, found_user);
        }
    });
};

exports.create_new_user = function (user_data, callback) {
    var error = validate_user_details(user_data, callback);
    if(error) return callback(error);

    async.waterfall([
        function (cb) {
            var filter = { name: user_data.name };
            var error = user_name_exists_error;
            does_data_exist(filter, error, cb);
        },
        function (cb) {
            var filter = { email: user_data.email };
            var error = email_exists_error;
            does_data_exist(filter, error, cb);
        },
        function (cb) {
            user_data = JSON.parse(JSON.stringify(user_data));
            user_data.user_id = new Date().getTime();
            db.accountsDB.insertOne(user_data, { w: 1 }, cb);
        }
    ], function (err, results) {
        callback(err, user_data);
    });
};

exports.update_user = function (new_user_data, callback) {
    var error = validate_user_details(new_user_data, callback);
    if(error) return callback(error);

    console.log(new_user_data)

    async.waterfall([
        function (cb) {
            get_user_by_name(new_user_data.name, cb);
        },
        function (current_user_data, cb) {
            if(current_user_data.email !== new_user_data.email) {
                var filter = { email: new_user_data.email };
                var error = email_exists_error;
                does_data_exist(filter, error, cb);
            } else {
                cb(null);
            }
        },
        function (cb) {
            delete new_user_data._id;
            db.accountsDB.updateOne({ user_id: new_user_data.user_id }, {$set: new_user_data} , {w: 1}, cb);
            // get_user_by_name(new_user_data.name, cb);
        }//,
        // function (current_user_data, cb) {
        //     // var diff = get_diff(current_user_data, new_user_data);
        //     // console.log(diff)
        //     // var filter = { name: user_data.name };
        //     // var error = user_name_exists_error;
        //     // does_data_exist(filter, error, cb);
        // },
        // function (cb) {
        //     var filter = { email: user_data.email };
        //     var error = email_exists_error;
        //     does_data_exist(filter, error, cb);
        // },
        // function (cb) {
        //     user_data = JSON.parse(JSON.stringify(user_data));
        //     user_data.user_id = new Date().getTime();
        //     db.accountsDB.insertOne(user_data, { w: 1 }, cb);
        // }
    ], function (err, results) {
        callback(err);
    });

    // var update = {email:user_data.email, password:user_data.password, view:user_data.view};
    //
    // async.waterfall([
    //     function (cb) {
    //         db.accountsDB.updateOne({ user_id: user_data.user_id }, {$set: update} , {w: 1}, cb);
    //     }], function (err) {
    //     callback(null);
    // });
};

// function get_diff(a, b) {
//     for(var key in a) {
//         if(key !== "_id") {
//             console.log(key, a[key],typeof a[key],b[key],typeof  b[key], (a[key] === b[key]));
//         }
//     }
// }

function get_user_by_name(name, callback) {
    var found_user = null;
    var filter = {name: name};
    var cursor = db.accountsDB.find(filter).limit(1);

    cursor.on("data", function (user) {
        found_user = user;
    });

    cursor.on("end", function () {
        if(found_user === null) {
            callback(user_not_found);
        } else {
            callback(null, found_user);
        }
    });
}

function validate_user_details(user_data, callback) {
    var usernamError = validateUsername(user_data.name);
    var passwordError = validatePassword(user_data.password);
    var emailError = validateEmail(user_data.email);

    if (usernamError) return usernamError;
    if (passwordError) return passwordError;
    if (emailError) return emailError;

    return null;
}

function does_data_exist(filter, error, callback) {
    var cursor = db.accountsDB.find(filter).limit(1);
    var found = false;

    cursor.on("data", function (data) {
        found = true;
    });

    cursor.on("end", function () {
        if(found) {
            callback(error, filter);
        } else {
            callback(null);
        }
    });
}

function validateUsername(user_name) {
    if(user_name.length < use_name_min_length) {
        return  user_name_to_short;
    }

    if(user_name.length > use_name_max_length) {
        return  user_name_to_long;
    }

    var pattern = new RegExp(/^[a-zA-Z0-9]+$/);
    var valid = pattern.test(user_name);

    if(!valid) {
        return user_name_invalid_characters;
    }

    return null;
}

function validatePassword(password) {
    if(password.length < password_min_length) {
        return  password_to_short;
    }

    if(password.length > password_max_length) {
        return  password_to_long;
    }

    var pattern = new RegExp(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/);
    var valid = pattern.test(password);

    if(!valid) {
        return password_invalid_characters;
    }

    return null;
}

function validateEmail(email) {
    if(email.length < email_min_length) {
        return  email_to_short;
    }

    if(email.length > email_max_length) {
        return  email_to_long;
    }

    var pattern = new RegExp(/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i);
    var valid = pattern.test(email);

    if(!valid) {
        return email_invalid;
    }
    
    return null;
}