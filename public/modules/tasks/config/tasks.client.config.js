'use strict';

// Configuring the Articles module
angular.module('tasks').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'task.tsk', 'tasks', 'dropdown', '/tasks');
		Menus.addSubMenuItem('topbar', 'tasks', 'task.tsk', 'tasks/assign/me');
		Menus.addSubMenuItem('topbar', 'tasks', 'task.issu', 'issues');
	}
]);
