(function () {

    function LoginController ($scope, accountProvider) {
        $scope.DEFAULT_VIEW = 2;

        $scope.show_login = false;
        $scope.show_new_user = true;
        $scope.login_error = null;

        $scope.name = "";
        $scope.password = "";
        $scope.email = "";

        $scope.autoLogin = function () {
            var user_data = {user_id: localStorage.getItem("user_id")};

            if(user_data.user_id !== null) {
                accountProvider.get_user_data_from_id(user_data, function (error, user_data) {
                    if (error) {
                        $scope.on_login_fail(error);
                    } else {
                        $scope.on_login_sucessful(user_data);
                    }
                });
            }
        };

        $scope.show_new_user_dialogue = function () {
            $scope.show_login = false;
            $scope.show_new_user = true;
            $scope.login_error = null;
            $scope.name = "";
            $scope.password = "";
            $scope.email = "";
        };

        $scope.show_login_dialogue = function () {
            $scope.show_login = true;
            $scope.show_new_user = false;
            $scope.login_error = null;
            $scope.name = localStorage.getItem("name");
            $scope.password = "";
            $scope.email = "";
        };

        $scope.login = function () {
            var user_data = {};
            user_data.name = $scope.name;
            user_data.password = $scope.password;

            accountProvider.get_user_id(user_data, function (error, user_data) {
                if (error) {
                    $scope.on_login_fail(error);
                } else {
                    $scope.on_login_sucessful(user_data);
                }
            });
        };

        $scope.create_new_user = function () {
            var user_data = {};
            user_data.name = $scope.name;
            user_data.password = $scope.password;
            user_data.email = $scope.email;
            user_data.view = $scope.DEFAULT_VIEW;

            accountProvider.create_new_user(user_data, function (error, user_data) {
                if (error) {
                    $scope.on_login_fail(error);
                } else {
                    $scope.on_login_sucessful(user_data);
                }
            });
        };

        $scope.on_login_fail = function (error) {
            $scope.login_error = error.message;
        };

        $scope.on_login_sucessful = function (user_data) {
            $scope.add_cell_error = null;
            accountProvider.user_data = user_data;
            localStorage.setItem("user_id", user_data.user_id);
            localStorage.setItem("name", user_data.name);
            window.location = "#/cells";
        };

        $scope.autoLogin();
    }

    shinyBoardApp.controller("LoginController", ['$scope', 'accountProvider', LoginController]);

})();
