'use strict';

// Configuring the groups module
angular.module('groups').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Supar Admin', 'groups', 'dropdown', '/groups(/create)?');
		Menus.addSubMenuItem('topbar', 'groups', 'List Groups', 'groups');
		Menus.addSubMenuItem('topbar', 'groups', 'New Group', 'groups/create');
	}
]);
