(function () {

    function accountProvider($http) {

        this._server_host = "";
        this.user_data = null;

        this.update_user = function (user_data, callback) {
            $http.post(this._server_host + "/v1/update_user.json", user_data)
                .success(function (data, status, headers, conf) {
                    callback(null, data);
                })
                .error(function (data, status, headers, conf) {
                    callback(data);
                })
        };

        this.get_user_data_from_id = function (user_data, callback) {
            $http.post(this._server_host + "/v1/get_user_data_from_id", user_data)
                .success(function (data, status, headers, conf) {
                    callback(null, data);
                })
                .error(function (data, status, headers, conf) {
                    callback(data);
                });
        };

        this.get_user_id = function (user_data, callback) {
            $http.post(this._server_host + "/v1/account.json", user_data)
                .success(function (data, status, headers, conf) {
                    callback(null, data);
                })
                .error(function (data, status, headers, conf) {
                    callback(data);
                });
        };

        this.create_new_user = function (user_data, callback) {
            $http.put(this._server_host + "/v1/create_new_user", user_data)
                .success(function (data, status, headers, conf) {
                    callback(null, data);
                })
                .error(function (data, status, headers, conf) {
                    callback(data);
                });
        };

    }

    shinyBoardApp.service("accountProvider", accountProvider);
})();
