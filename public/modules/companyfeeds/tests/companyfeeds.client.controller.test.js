'use strict';

(function() {
	// Companyfeeds Controller Spec
	describe('Companyfeeds Controller Tests', function() {
		// Initialize global variables
		var CompanyfeedsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Companyfeeds controller.
			CompanyfeedsController = $controller('CompanyfeedsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Companyfeed object fetched from XHR', inject(function(Companyfeeds) {
			// Create sample Companyfeed using the Companyfeeds service
			var sampleCompanyfeed = new Companyfeeds({
				name: 'New Companyfeed'
			});

			// Create a sample Companyfeeds array that includes the new Companyfeed
			var sampleCompanyfeeds = [sampleCompanyfeed];

			// Set GET response
			$httpBackend.expectGET('companyfeeds').respond(sampleCompanyfeeds);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.companyfeeds).toEqualData(sampleCompanyfeeds);
		}));

		it('$scope.findOne() should create an array with one Companyfeed object fetched from XHR using a companyfeedId URL parameter', inject(function(Companyfeeds) {
			// Define a sample Companyfeed object
			var sampleCompanyfeed = new Companyfeeds({
				name: 'New Companyfeed'
			});

			// Set the URL parameter
			$stateParams.companyfeedId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/companyfeeds\/([0-9a-fA-F]{24})$/).respond(sampleCompanyfeed);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.companyfeed).toEqualData(sampleCompanyfeed);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Companyfeeds) {
			// Create a sample Companyfeed object
			var sampleCompanyfeedPostData = new Companyfeeds({
				name: 'New Companyfeed'
			});

			// Create a sample Companyfeed response
			var sampleCompanyfeedResponse = new Companyfeeds({
				_id: '525cf20451979dea2c000001',
				name: 'New Companyfeed'
			});

			// Fixture mock form input values
			scope.name = 'New Companyfeed';

			// Set POST response
			$httpBackend.expectPOST('companyfeeds', sampleCompanyfeedPostData).respond(sampleCompanyfeedResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Companyfeed was created
			expect($location.path()).toBe('/companyfeeds/' + sampleCompanyfeedResponse._id);
		}));

		it('$scope.update() should update a valid Companyfeed', inject(function(Companyfeeds) {
			// Define a sample Companyfeed put data
			var sampleCompanyfeedPutData = new Companyfeeds({
				_id: '525cf20451979dea2c000001',
				name: 'New Companyfeed'
			});

			// Mock Companyfeed in scope
			scope.companyfeed = sampleCompanyfeedPutData;

			// Set PUT response
			$httpBackend.expectPUT(/companyfeeds\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/companyfeeds/' + sampleCompanyfeedPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid companyfeedId and remove the Companyfeed from the scope', inject(function(Companyfeeds) {
			// Create new Companyfeed object
			var sampleCompanyfeed = new Companyfeeds({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Companyfeeds array and include the Companyfeed
			scope.companyfeeds = [sampleCompanyfeed];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/companyfeeds\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCompanyfeed);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.companyfeeds.length).toBe(0);
		}));
	});
}());