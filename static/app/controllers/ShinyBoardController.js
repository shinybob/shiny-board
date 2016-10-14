(function () {

    function ShinyBoardController ($scope, cellProvider) {

        $scope.default_image = "../../images/no-icon.png";
        $scope.new_cell_data = null;
        $scope.new_image = null;
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

        $scope.show_edit_window = function (cell_data) {
            var isEdit = (cell_data !== undefined);

            $scope.updateing_cell = isEdit;
            $scope.adding_cell = !isEdit;
            $scope.new_image = null;

            if(isEdit) {
                event.stopPropagation();
                $scope.new_cell_data = JSON.parse(JSON.stringify(cell_data));
            } else {
                $scope.new_cell_data = { fav:false, col:"#EEEEEE", image:$scope.default_image};
            }
        };

        $scope.hide_edit_window = function () {
            $scope.new_cell_data = null;
            $scope.updateing_cell = false;
            $scope.adding_cell = false;
        };

        $scope.accept_clicked = function (cell_data) {
            if($scope.new_image !== null) {
                cell_data.image = $scope.new_image.$ngfDataUrl;
            }

            if($scope.updateing_cell) {
                $scope.update_cell(cell_data);
            } else {
                $scope.add_cell(cell_data);
            }
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
