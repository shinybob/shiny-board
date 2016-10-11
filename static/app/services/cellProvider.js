(function () {

    function cellProvider($http) {

        this._server_host = "";

        this.get_all_cells = function (callback) {
            $http.get(this._server_host + "/v1/cells.json")
                .success(function (data, status, headers, conf) {
                    callback(null, data);
                })
                .error(function (data, status, headers, conf) {
                    callback(data);
                });
        };

        this.add_cell = function (cell_data, callback) {
            console.log("Rob - FE - About to put", this._server_host + "/v1/cells.json")
            $http.put(this._server_host + "/v1/cells.json", cell_data)
                .success(function (data, status, headers, conf) {
                    callback(null, data);
                })
                .error(function (data, status, headers, conf) {
                    callback(data);
                });
        };

        this.get_cell_by_id = function (cell_id, callback) {
            $http.get(this._server_host + "/v1/cells/" + cell_id + ".json")
                .success(function (data, status, headers, conf) {
                    callback(null, data);
                })
                .error(function (data, status, headers, conf) {
                    callback(data);
                });
        };

        this.delete_cell = function (cell_data, callback) {
            $http.delete(this._server_host + "/v1/cells/" + cell_data.cell_id + ".json")
                .success(function (data, status, headers, conf) {
                    callback(null, data);
                })
                .error(function (data, status, headers, conf) {
                    callback(data);
                });
        };

        this.upload_image = function (cell_data, callback) {
            $http.post(this._server_host + "/v1/cells.json", cell_data)
                .success(function (data, status, headers, conf) {
                    callback(null, data);
                })
                .error(function (data, status, headers, conf) {
                    callback(data);
                })
        };

        this.update_cell = function (cell_data, callback) {
            $http.post(this._server_host + "/v1/cells.json", cell_data)
                .success(function (data, status, headers, conf) {
                    callback(null, data);
                })
                .error(function (data, status, headers, conf) {
                    callback(data);
                })
        };
    }

    shinyBoardApp.service("cellProvider", cellProvider);
})();
