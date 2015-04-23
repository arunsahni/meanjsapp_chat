'use strict';

// Configuring the groups module
angular.module('groups').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'grp.sadm', 'groups', 'dropdown', '/groups(/create)?', false, ['superadmin']);
		Menus.addSubMenuItem('topbar', 'groups', 'grp.lgrp', 'groups');
		Menus.addSubMenuItem('topbar', 'groups', 'grp.ngp', 'groups/create');
	}
]);
