'use strict';

// Configuring the Articles module
angular.module('admins').run(['Menus', 'Authentication',
	function(Menus, Authentication) {
		// Set top bar menu items

		Menus.addMenuItem('topbar', 'admin.adm', 'admins', 'dropdown', '/admins(/create)?', false, ['admin', 'superadmin']);
		Menus.addSubMenuItem('topbar', 'admins', 'admin.rmgt', 'userlist','userlist', false, ['admin', 'superadmin']);
		Menus.addSubMenuItem('topbar', 'admins', 'admin.accmgt', 'featuresAccess','featuresAccess', false, ['admin','superadmin']);
	}
]);
