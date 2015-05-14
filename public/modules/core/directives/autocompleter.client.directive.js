'use strict';

angular.module('core').directive('autoComplete', ['$http', 'AutoComplete', function ($http, AutoComplete) {
    return {
        restrict:'AE',
        scope:{
            selectedTags:'=model',
            metaData: '=value',
            acPlaceholder: '@placeholder'
        },
        templateUrl: '/modules/core/views/autocomplete-template.html',
        link:function(scope, elem, attrs){
            scope.suggestions = [];
            scope.selectedTags = [];
            scope.selectedTagsIds = [];
            scope.selectedIndex = -1;

            scope.removeTag = function (index) {
                scope.selectedTags.splice(index,1);
            };

            scope.search = function () {
                if (!!scope.searchText) {
                    AutoComplete.getAutoCompleteData({
                        EntityName: scope.metaData.EntityName,
                        Projection: scope.metaData.Projection,
                        MatchField: scope.metaData.MatchField,
                        SearchText: scope.searchText,
                        selectedTagsIds: scope.selectedTagsIds
                    }).success(function (data) {
                        var finalData = [];
                        if (scope.selectedTags.length) {
                            finalData = data.filter(function(obj) { return scope.selectedTagsIds.indexOf(obj._id) === -1; });
                        } else {
                            finalData = data;
                        }
                        scope.suggestions = finalData;
                        scope.selectedIndex = -1;
                    });
                } else {
                    delete scope.suggestions;
                }
            };

            scope.addToSelectedTags = function (index) {
                if (index !==-1 && scope.selectedTags.indexOf(scope.suggestions[index])===-1) {
                    scope.selectedTags.push(scope.suggestions[index]);
                    scope.selectedTagsIds.push(scope.suggestions[index]._id);
                    scope.searchText = '';
                    scope.suggestions = [];
                }
            };

            scope.checkKeyDown = function (event) {
                if (event.keyCode===40) {
                    event.preventDefault();
                    if (scope.selectedIndex+1 !== scope.suggestions.length) {
                        scope.selectedIndex++;
                    }
                }
                else if (event.keyCode===38) {
                    event.preventDefault();
                    if (scope.selectedIndex-1 !== -1) {
                        scope.selectedIndex--;
                    }
                }
                else if (event.keyCode===13) {
                    scope.addToSelectedTags(scope.selectedIndex);
                }
            };

            scope.$watch('selectedIndex',function (val) {
                if(val!==-1) {
                    scope.searchText = scope.suggestions[scope.selectedIndex][scope.metaData.MatchField];
                }
            });
        }
    };
}]);
