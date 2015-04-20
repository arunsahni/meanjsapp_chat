'use strict';

// Configuring the Articles module
angular.module('admins').run(['Menus', 'Authentication',
	function(Menus, Authentication) {
		// Set top bar menu items

		if (Authentication.user.roles[0] === 'admin') {
			Menus.addMenuItem('topbar', 'Admins', 'admins', 'dropdown', '/admins(/create)?','admin');
			Menus.addSubMenuItem('topbar', 'admins', 'Role Management', 'userlist');
		}
	}
]);
