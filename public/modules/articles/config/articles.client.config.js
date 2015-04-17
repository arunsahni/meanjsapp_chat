'use strict';

// Configuring the Articles module
angular.module('articles').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'acc.sub.das', 'dashboard', '/#!(/dashboard)');
		Menus.addMenuItem('topbar', 'acc.sub.art', 'articles', 'dropdown', '/articles(/create)?');
		Menus.addSubMenuItem('topbar', 'articles', 'acc.sub.item', 'articles');
		Menus.addSubMenuItem('topbar', 'articles', 'acc.sub.new', 'articles/create');
	}
]);
