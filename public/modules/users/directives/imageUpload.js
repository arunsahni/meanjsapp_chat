/**
 * Created by arunsahni on 4/7/15.
 */
/**
 * Created by sumasoft on 3/25/15.
 */
'use strict';

angular.module('users').directive('uiUpload', function($upload) {
    return {
        templateUrl: 'meanjsapp/public/modules/users/views/settings/uploadImage.html',
        scope: {
            fileDest: '=',
            filename: '=',
            uploadCallback: '&',
            uploadFileCallback: '&'
        },
        restrict: 'E',
        replace: false,
        link: function($scope, element, attrs) {
            $scope.onFileSelect = function($files) {
                var files = [];
                $scope.files = $files;

                //$files: an array of files selected, each file has name, size, and type.
                //for (var i = 0; i < $files.length; i++) {
                    var file = $files[0];
                    console.log(file);
                    $scope.upload = $upload.upload({
                        url: 'fileUpload/upload',
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        },
                        data: {
                            dest: $scope.fileDest,
                            filename:$scope.filename
                        },
                        file: file
                    }).progress(function(evt) {
                        console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                    }).success(function(data, status, headers, config) {
                        if (data.success) {
                            if (angular.isDefined(attrs.uploadFileCallback)) {
                                $scope.uploadFileCallback({
                                    file: data.file
                                });
                            }
                            files.push(data.file);
                        }
                        if (files.length === $files.length) {
                            if (angular.isDefined(attrs.uploadCallback)) {
                                $scope.uploadCallback({
                                    files: files
                                });
                            }
                        }
                    });
                //}
            };
        }
    };
});
