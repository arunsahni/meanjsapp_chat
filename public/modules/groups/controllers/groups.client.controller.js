'use strict';

// Groups controller
angular.module('groups').controller('GroupsController', ['$scope', '$stateParams', '$location', 'toastr', 'Authentication', 'Groups',
	function($scope, $stateParams, $location, toastr, Authentication, Groups) {
		$scope.authentication = Authentication;
        $scope.uploadedImage = 'https://s3.amazonaws.com/sumacrm/groups/' + $scope.authentication.user.group._id;


		// Create new Group
		$scope.create = function() {
			// Create new Group object
            Groups.saveGroup({
                name: this.name,
                createdBy: Authentication.user._id
            }).success(function(data) {
                toastr.success('Successfully', 'Group inserted');
                delete $scope.name;
            });
		};

        $scope.remove = function(group) {
            if (group) {
                Groups.deleteGroup(group).success(function (data) {
                    $location.path('groups');
                    toastr.success('Successfully', 'Group deleted');
                });
            }
        };

        $scope.update = function() {
            var group = $scope.group;
            if($scope.uploadedImage){
                group.isImage = true;
            }
            Groups.updateGroup(group).success(function(data) {
                $location.path('groups/' + data._id);
                toastr.success('Successfully', 'Group updated');
            });
        };

        $scope.find = function() {
            Groups.getGroups().success(function(groups){
                $scope.groups = groups;
            });
        };

        $scope.findOne = function() {
            Groups.getGroupById({
                groupId: $stateParams.groupId
            }).success(function (group) {
                $scope.group = group;
            });
        };

        var executeOnSignedUrl = function(file, callback) {
            var this_s3upload, xhr;
            this_s3upload = this;
            xhr = new XMLHttpRequest();
            xhr.open('GET', '/sign_s3' + '?s3_object_type=' + file.type + '&s3_object_name=' + 'default_name', true);
            xhr.overrideMimeType('text/plain; charset=x-user-defined');
            xhr.onreadystatechange = function(e) {
                var result;
                if (this.readyState === 4 && this.status === 200) {
                    try {
                        result = JSON.parse(this.responseText);
                    } catch (error) {
                        this_s3upload.onError('Signing server returned some ugly/empty JSON: "' + this.responseText + '"');
                        return false;
                    }
                    return callback(result.signed_request, result.url);
                } else if (this.readyState === 4 && this.status !== 200) {
                    return this_s3upload.onError('Could not contact request signing server. Status = ' + this.status);
                }
            };
            return xhr.send();
        };

        var createCORSRequest = function(method, url) {
            var xhr;
            xhr = new XMLHttpRequest();
            if (xhr.withCredentials !== null) {
                xhr.open(method, url, true);
            } else if (typeof XDomainRequest !== 'undefined') {
                xhr = new XDomainRequest();
                xhr.open(method, url);
            } else {
                xhr = null;
            }
            return xhr;
        };

        var uploadToS3 = function(file, url, public_url) {
            var this_s3upload, xhr;
            this_s3upload = this;
            xhr = createCORSRequest('PUT', url);
            if (!xhr) {
                this.onError('CORS not supported');
            } else {
                xhr.onload = function() {
                    if (xhr.status === 200) {
                        //this_s3upload.onProgress(100, 'Upload completed.');
                        //return this_s3upload.onFinishS3Put(public_url);
                        $scope.uploadedImage = public_url;
                        toastr.success('File Uploaded Succsessfully');
                        $scope.$apply();
                        window.location.reload();
                        //$location.path('/settings/profile');
                    } else {
                        console.log('Upload error: ' + xhr.status);
                        //return this_s3upload.onError('Upload error: ' + xhr.status);
                    }
                };
                xhr.onerror = function() {
                    return this_s3upload.onError('XHR error.');
                };
                xhr.upload.onprogress = function(e) {
                    var percentLoaded;
                    if (e.lengthComputable) {
                        percentLoaded = Math.round((e.loaded / e.total) * 100);
                        $scope.uploadProgress = percentLoaded;
                        $scope.$apply();
                        //return this_s3upload.onProgress(percentLoaded, percentLoaded === 100 ? 'Finalizing.' : 'Uploading.');
                    }
                };
            }
            xhr.setRequestHeader('Content-Type', file.type);
            xhr.setRequestHeader('x-amz-acl', 'public-read');
            return xhr.send(file);
        };

        var uploadFile = function(file) {
            return executeOnSignedUrl(file, function(signedURL, publicURL) {
                return uploadToS3(file, signedURL, publicURL);
            });
        };


        $scope.onFileSelect = function(image) {
            if (image.length) {
                if (angular.isArray(image)) {
                    image = image[0];
                }
                if (image.size > 500000) {
                    toastr.error('Image size should be less than 500KB');
                    return;
                }
                if (image.type !== 'image/png') {
                    toastr.error('Only PNG is accepted.');
                    return;
                }
                $scope.uploadInProgress = true;
                $scope.uploadProgress = 0;

                $scope.test = uploadFile(image);
            }
        };

	}
]);
