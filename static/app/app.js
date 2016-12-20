var shinyBoardApp = angular.module("shinyBoardApp", [ "ngRoute", "ngFileUpload"]);

shinyBoardApp.config(function ($routeProvider) {
    $routeProvider
        .when("/cells",  { controller: "ShinyBoardController", templateUrl: "/app/partials/shiny_board.html" })
        .when("/login",  { controller: "LoginController", templateUrl: "/app/partials/login.html" })
        .when("/",  { redirectTo: "/login" })
        .otherwise({ redirectTo: "/404_page" });
});
