(function () {

    function ShinyBoardController ($scope, cellProvider, accountProvider) {
        if(accountProvider.user_data === null) {
            window.location = "#/";
            return;
        }



        ShinyBoardController.VIEW_MODE_COMPACT = 1;
        ShinyBoardController.VIEW_MODE_REGULAR = 2;
        ShinyBoardController.VIEW_MODE_LARGE = 3;

        $scope.cell_properties = ["fav", "image", "name", "url", "notes"];

        $scope.default_image = "../../images/no-icon.png";
        $scope.default_image_medium = "../../images/blank.png";
        $scope.new_cell_data = null;
        $scope.new_user_data = null;
        $scope.new_image = null;
        $scope.new_cells_csv = null;
        $scope.add_cell_error = "";
        $scope.update_cell_error = "";
        $scope.export_csv_error = "";
        $scope.update_user_error = "";
        $scope.finished_loading = false;
        $scope.adding_cell = false;
        $scope.updateing_cell = false;
        $scope.show_user_details = false;
        $scope.user_data = accountProvider.user_data;
        $scope.view_mode = accountProvider.user_data.view || ShinyBoardController.VIEW_MODE_REGULAR;

        $scope.update_user_clicked = function (user_data) {
            $scope.update_user_error = "";

            accountProvider.update_user(user_data, function (err, cell) {
                if (err) {
                    $scope.update_user_error = "(" + err.error + ") " + err.message;
                } else {
                    $scope.show_user_details = false;
                    $scope.new_user_data = null;
                }
            });
        };

        $scope.show_user_details_dialogue = function () {
            $scope.adding_cell = false;
            $scope.updateing_cell = false;
            $scope.show_user_details = true;
            $scope.update_user_error = "";
            $scope.new_user_data = JSON.parse(JSON.stringify($scope.user_data));
        };

        $scope.hide_user_details_dialogue = function () {
            $scope.show_user_details = false;
            $scope.update_user_error = "";
        };

        $scope.show_cell_dialogue = function (cell_data) {
            var isEdit = (cell_data !== undefined);
            $scope.updateing_cell = isEdit;
            $scope.adding_cell = !isEdit;
            $scope.new_image = null;

            if(isEdit) {
                event.stopPropagation();
                $scope.new_cell_data = JSON.parse(JSON.stringify(cell_data));
            } else {
                // $scope.new_cell_data = { fav:false, image:$scope.default_image, user_id:accountProvider.user_data._id};
                $scope.new_cell_data = { fav:false, image:null, user_id:accountProvider.user_data._id};
            }
        };

        $scope.toggle_view_mode = function () {
            $scope.view_mode++;
            if($scope.view_mode > 3) $scope.view_mode = 1;

            $scope.user_data.view = $scope.view_mode;

            accountProvider.update_user($scope.user_data, function (err, cell) {
                if (err) {
                    $scope.update_user_error = "(" + err.error + ") " + err.message;
                } else {
                    $scope.update_user_error = null;
                    $scope.show_user_details = false;
                    $scope.new_user_data = null;
                }
            });
        };

        $scope.hide_edit_window = function () {
            $scope.new_cell_data = null;
            $scope.updateing_cell = false;
            $scope.adding_cell = false;
        };

        $scope.accept_clicked = function (cell_data) {
            if($scope.new_image !== null) {
                cell_data.image = $scope.new_image.$ngfDataUrl;
                cell_data.image_bg_colour = $scope.get_image_colour(cell_data.image);
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
            cellProvider.update_cell(cell_data, function (err, status) {
                if (err) {
                    if(status === 413) {
                        $scope.update_cell_error = "File to large! (" + status + ") ";
                    } else {
                        $scope.update_cell_error = "(" + err.error + ") " + err.message;
                    }
                } else {
                    $scope.updateing_cell = false;
                    $scope.update_cell_error = null;
                    get_all_cells();
                }
            });
        };

        $scope.delete_all_cells = function () {
            cellProvider.delete_all_cells(function (err) {
                if (err) {
                    $scope.delete_all_cells_error = "(" + err.error + ") " + err.message;
                } else {
                    $scope.delete_all_cells_error = null;
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

        $scope.get_image_colour = function (imageURI) {
            var image = new Image();
            image.src = imageURI;
            var canvas = document.createElement("canvas");
            var context = canvas.getContext('2d');
            context.drawImage(image, 0, 0);

            function componentToHex(c) {
                var hex = c.toString(16);
                return hex.length == 1 ? "0" + hex : hex;
            }

            function rgbToHex(rgb) {
                return "#" + componentToHex(rgb[0]) + componentToHex(rgb[1]) + componentToHex(rgb[2]);
            }

            var rgb = context.getImageData(0,0,1,1).data;
            var hex = rgbToHex(rgb);

            return hex;
        };

        $scope.get_image = function () {
            var image = $scope.default_image;

            if($scope.new_image !== null) {image = $scope.new_image;}
            if($scope.new_cell_data && $scope.new_cell_data.image !== null) {image = $scope.new_cell_data.image;}

            return image;
        };

        $scope.remove_image = function () {
            $scope.new_image = null;
            $scope.new_cell_data.image = null;
            $scope.update_cell_error = null;
        };

        $scope.onKeyUp = function (event) {
            if(event.code === "Enter" && $scope.filteredList.length > 0) {
                $scope.launch($scope.filteredList[0].url);
            }
        };

        $scope.launch = function (url) {
            var win = window.open(url, '_blank');
            win.focus();
            // window.location = url;
        };

        $scope.getStyle = function (isFav) {
            var style = {};

            if(isFav) {
                return {
                    'border': '1px solid #ffec62',
                    'background': 'linear-gradient(to bottom, #fcffcc 0%,#f9f9e8 100%)'};
            }

            return style;
        };

        $scope.set_favourite = function (cell_data, state) {
            event.stopPropagation();
            cell_data.fav = state;
        };

        $scope.logout = function () {
            localStorage.removeItem("user_id");
            window.location = "#/";
        };

        $scope.export_csv = function () {
            var text = create_csv($scope.cells);
            var element = document.createElement("a");

            element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
            element.setAttribute("download", "cells.csv");
            element.style.display = "none";
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        };

        $scope.import_csv = function () {
            var reader = new FileReader();
            reader.readAsText($scope.new_cells_csv);

            reader.onload = function(event) {
                var csv = event.target.result;
                var lines = csv.split(/\r\n|\n|\r/);
                var keys = lines[0].split(",");
                var new_cells = [];

                for(var i = 1; i < lines.length - 1; i++) {
                    var new_cell = {};
                    var cell_data = lines[i].split(",");

                    for(var j = 0; j < keys.length; j++) {
                        var value = cell_data[j];

                        if(value === "true" || value === "false") value = Boolean(value);
                        if(value === "null") value = null;
                        if(value === "undefined") value = undefined;

                        if(keys[j] == "image") {
                            value = value.split("-comma-").join(",");
                        }


                        new_cell[keys[j]] = value;
                    }

                    new_cell["user_id"] = accountProvider.user_data._id;

                    new_cells.push(new_cell);
                    $scope.add_cell(new_cell);
                }
            };

            reader.onEror = function(event) {
                console.log("error")
            };
        };

        function create_csv(cells) {
            var csv = "";
            var value = "";

            for(var i = 0; i < $scope.cell_properties.length; i++) {
                value = $scope.cell_properties[i];
                csv += value;
                if(i != $scope.cell_properties.length - 1) csv += ",";
            }
            csv += "\n";

            for(var j = 0; j < cells.length; j++) {
                for(var k = 0; k < $scope.cell_properties.length; k++) {
                    value = cells[j][$scope.cell_properties[k]];

                    if($scope.cell_properties[k] === "image" && value) {
                        value = value.split(",").join("-comma-");
                    }

                    csv += value;
                    if(k != $scope.cell_properties.length - 1) csv += ",";
                }
                csv += "\n";
            }

            return csv;
        }

        function refreshTimer() {
            window.location = "#/";
        }

        function get_all_cells() {
            $scope.cells = cellProvider.get_all_cells(accountProvider.user_data._id, function (err, cells) {
                $scope.finished_loading = true;
                if (err) {
                    $scope.page_load_error = err.message;
                } else {
                    $scope.cells = cells;
                }
            });
        }

        get_all_cells();
        setTimeout(refreshTimer, (60000 * 5));
    }

    shinyBoardApp.controller("ShinyBoardController", ['$scope', 'cellProvider', 'accountProvider', ShinyBoardController]);

})();
