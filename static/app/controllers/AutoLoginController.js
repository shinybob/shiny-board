(function () {

    function AutoLoginController ($scope, accountProvider) {

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

        $scope.on_login_fail = function (error) {
            window.location = "#/login";
        };

        $scope.on_login_sucessful = function (user_data) {
            accountProvider.user_data = user_data;
            localStorage.setItem("user_id", user_data.user_id);
            localStorage.setItem("name", user_data.name);
            window.location = "#/cells";
        };

        $scope.autoLogin();
    }

    shinyBoardApp.controller("AutoLoginController", ['$scope', 'accountProvider', AutoLoginController]);

})();
