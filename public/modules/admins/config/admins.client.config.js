'use strict';

// Configuring the Articles module
angular.module('admins').run(['Menus', 'Authentication',
	function(Menus, Authentication) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Admins', 'admins', 'dropdown', '/admins(/create)?', false, ['admin', 'superadmin']);
		Menus.addSubMenuItem('topbar', 'admins', 'Role Management', 'userlist','userlist', false, ['admin', 'superadmin']);
	}
]);
