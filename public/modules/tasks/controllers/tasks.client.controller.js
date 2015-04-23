'use strict';

// Tasks controller
angular.module('tasks').controller('TasksController', ['$scope', '$stateParams', '$location', 'Authentication', 'Tasks','toastr',
	function($scope, $stateParams, $location, Authentication, Tasks, toastr) {
		$scope.authentication = Authentication;
        $scope.task = {};
		$scope.items = ['Urgent','High','Nomal','Low'];
		// Create new Task
		$scope.createTask = function() {
			Tasks.saveTasks({
				data: $scope.task
			}).success(function (data) {
				toastr.success('Successfully', 'Task Inserted');
				$scope.task = '';
			});
		};

        $scope.autoCompleteData = {
            EntityName: ['User'],
            Projection: ['firstName', '_id', 'isImage'],
            MatchField: 'firstName'
        };

        $scope.$watchCollection('assignees',function(val){
            if ($scope.assignees && $scope.assignees.length) {
                var userIds = $scope.assignees.map(function (user) {
                    return user._id;
                });
                $scope.task.assignees = userIds;
            }
        });
		// Remove existing Task
		$scope.remove = function(task) {
			if ( task ) { 
				task.$remove();

				for (var i in $scope.tasks) {
					if ($scope.tasks [i] === task) {
						$scope.tasks.splice(i, 1);
					}
				}
			} else {
				$scope.task.$remove(function() {
					$location.path('tasks');
				});
			}
		};

		// Update existing Task
		$scope.update = function() {
			/*var task = $scope.task;

			task.$update(function() {
				$location.path('tasks/' + task._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});*/
			var task = $scope.task;
			Tasks.updateTask(task).success(function(data) {
				$location.path('tasks/' + data._id);
				toastr.success('Successfully', 'task updated');
			});
		};

		// Find a list of Tasks
		$scope.find = function() {
			Tasks.getTasks().success(function(tasks){
				$scope.tasks = tasks;
			});
		};

		// Find existing Task
		$scope.findOne = function() {
			Tasks.getTaskById({
				taskId: $stateParams.taskId
			}).success(function (task) {
				console.log(task)
				$scope.task = task;
			});
		};
	}
]);
