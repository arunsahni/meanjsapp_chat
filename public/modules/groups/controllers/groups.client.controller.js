'use strict';

// Groups controller
angular.module('groups').controller('GroupsController', ['$scope', '$stateParams', '$location', 'toastr', 'Authentication', 'Groups',
	function($scope, $stateParams, $location, toastr, Authentication, Groups) {
		$scope.authentication = Authentication;

		// Create new Group
		$scope.create = function() {
			// Create new Group object
            Groups.saveGroup({
                name: this.name,
                createdBy: Authentication.user._id
            }).success(function(data) {
                toastr.success('Successfully', 'Group inserted');
                delete $scope.name;
            });
		};

        $scope.remove = function(group) {
            if (group) {
                Groups.deleteGroup(group).success(function (data) {
                    $location.path('groups');
                    toastr.success('Successfully', 'Group deleted');
                });
            }
        };

        $scope.update = function() {
            var group = $scope.group;
            Groups.updateGroup(group).success(function(data) {
                $location.path('groups/' + data._id);
                toastr.success('Successfully', 'Group updated');
            });
        };

        $scope.find = function() {
            Groups.getGroups().success(function(groups){
                $scope.groups = groups;
            });
        };

        $scope.findOne = function() {
            Groups.getGroupById({
                groupId: $stateParams.groupId
            }).success(function (group) {
                $scope.group = group;
            });
        };

	}
]);
