(function(angular, undefined) {
  angular.module("angularAdminFullstackApp.constants", [])

.constant("appConfig", {
	"userRoles": [
		"guest",
		"user",
		"admin"
	]
})

;
})(angular);