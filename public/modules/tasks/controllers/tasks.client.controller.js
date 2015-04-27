'use strict';

// Tasks controller
angular.module('tasks').controller('TasksController', ['$scope', '$stateParams', '$location', 'Authentication', 'Tasks','toastr',
	function($scope, $stateParams, $location, Authentication, Tasks, toastr) {
		$scope.authentication = Authentication;
        $scope.task = {};
		$scope.items = ['Urgent','High','Nomal','Low'];
        $scope.task.priority = $scope.items[0];
		// Create new Task
		$scope.createTask = function() {
			Tasks.saveTasks({
				data: $scope.task
			}).success(function (data) {
				toastr.success('Successfully', 'Task Inserted');
				delete $scope.task;
				delete $scope.assignees;
			});
		};

        $scope.autoCompleteData = {
            EntityName: ['User'],
            Projection: ['firstName', '_id', 'isImage'],
            MatchField: 'firstName'
        };

        $scope.$watchCollection('assignees',function(val){
			/*if($scope.task.assignees && $scope.task.assignees[0].displayName) {
				$scope.assignees = $scope.task.assignees.map(function(assigne) {
					return {
						_id: assigne._id,
						firstName: assigne.firstName,
						isImage: assigne.isImage
					};
				});
			}*/
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
			for (var i = 0, len = $scope.assigneesList.length; i < len; i++) {
				$scope.task.assignees.push($scope.assigneesList[i]._id);
			}

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
			$scope.assigneesList = [];
			Tasks.getTaskById({
				taskId: $stateParams.taskId
			}).success(function (task) {
				var d1 = new Date();
				var d2 = new Date(task.createdDate);
				var miliseconds = d1-d2;
				var seconds = miliseconds/1000;
				var minutes = seconds/60;
				var hours = minutes/60;
				var days = hours/24;
				$scope.task = task;
				$scope.assigneesList = task.assignees;
				$scope.task.assignees = [];
				$scope.days = Math.round(days);
			});
		};
		$scope.removeAssignee = function(AssigneeId){
			Tasks.updateAssigneesList({
				taskId : $stateParams.taskId,
				assigneeId : AssigneeId
			}).success(function (task) {
				$scope.task = task;
				$scope.assigneesList = task.assignees;
				$scope.task.assignees = [];
			});
		};
	}
]);
