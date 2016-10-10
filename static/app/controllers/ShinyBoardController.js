(function () {

    function ShinyBoardController ($scope, cellProvider) {

        $scope.new_cell_data = { fav:false, col:"#EEEEEE"};
        $scope.update_cell_data = {};
        $scope.add_cell_error = "";
        $scope.update_cell_error = "";
        $scope.finished_loading = false;
        $scope.adding_cell = false;
        $scope.updateing_cell = false;

        function get_all_cells() {
            $scope.cells = cellProvider.get_all_cells(function (err, cells) {
                $scope.finished_loading = true;
                if (err) {
                    $scope.page_load_error = err.message;
                } else {
                    $scope.cells = cells;
                }                
            });
        }

        $scope.show_add_cell = function () {
            $scope.adding_cell = true;
            $scope.updateing_cell = false;
        };

        $scope.hide_add_cell = function () {
            $scope.adding_cell = false;
        };

        $scope.add_cell = function (cell_data) {
            cellProvider.add_cell(cell_data, function (err, cell) {
                if (err) {
                    $scope.add_cell_error = "(" + err.error + ") " + err.message;
                } else {
                    $scope.adding_cell = false;
                    $scope.add_cell_error = null;
                    get_all_cells();
                }
            });
        };

        $scope.show_update_cell = function (cell_data) {
            event.stopPropagation();
            $scope.update_cell_data = JSON.parse(JSON.stringify(cell_data));
            $scope.updateing_cell = true;
            $scope.adding_cell = false;
        };

        $scope.delete_cell = function (cell_data) {
            cellProvider.delete_cell(cell_data, function (err, cell) {
                if (err) {
                    $scope.update_cell_error = "(" + err.error + ") " + err.message;
                } else {
                    $scope.updateing_cell = false;
                    $scope.update_cell_error = null;
                    get_all_cells();
                }
            });
        };

        $scope.hide_update_cell = function () {
            $scope.updateing_cell = false;
        };

        $scope.update_cell = function (cell_data) {
            cellProvider.update_cell(cell_data, function (err, cell) {
                if (err) {
                    $scope.update_cell_error = "(" + err.error + ") " + err.message;
                } else {
                    $scope.updateing_cell = false;
                    $scope.update_cell_error = null;
                    get_all_cells();
                }
            });
        };

        $scope.launch = function (url) {
            window.location = url;
        };

        $scope.set_favourite = function (cell_data, state) {
            event.stopPropagation();
            cell_data.fav = state;
        };

        get_all_cells();
    }

    shinyBoardApp.controller("ShinyBoardController", ['$scope', 'cellProvider', ShinyBoardController]);

})();
