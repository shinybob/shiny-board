var account_data = require("../data/accounts.js");

exports.get_user_data_from_id = function (user_data, callback) {
    account_data.get_user_data_from_id(user_data, callback);
};

exports.login = function (user_data, callback) {
    account_data.login(user_data, callback);
};

exports.create_new_user = function (user_data, callback) {
    account_data.create_new_user(user_data, callback);
};

exports.update_user = function (user_data, callback) {
    account_data.update_user(user_data, callback);
};