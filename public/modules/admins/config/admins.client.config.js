'use strict';

// Configuring the Articles module
angular.module('admins').run(['Menus', 'Authentication',
	function(Menus, Authentication) {
		// Set top bar menu items

		Menus.addMenuItem('topbar', 'admin.admin', 'admins', 'dropdown', '/admins(/create)?', false, ['admin', 'superadmin']);
		Menus.addSubMenuItem('topbar', 'admins', 'admin.role', 'userlist','userlist', false, ['admin', 'superadmin']);
		Menus.addSubMenuItem('topbar', 'admins', 'admin.access', 'featuresAccess','featuresAccess', false, ['admin']);

	}
]);
