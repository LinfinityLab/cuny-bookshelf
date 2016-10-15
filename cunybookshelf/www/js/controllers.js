angular.module('cunybookshelf.controllers', [])

.controller('BooksearchCtrl', function($scope,$http,factorysearchresults,$state,$ionicLoading,$cordovaBarcodeScanner) {
  $scope.searchby = {
    searchterm: null,
    model: null,
    availableOptions: [
      {id:"q" , name:"Keyword anywhere"},
      {id:"title" , name:"Title"},
      {id:"author" , name:"Author"},
      {id:"isbn", name:"ISBN"}
    ]};
  $scope.search = function(){
    $scope.show();
    $http({
      method: 'GET',
      url: 'http://openlibrary.org/search.json?'+$scope.searchby.model+"="+$scope.searchby.searchterm
    }).then(function successCallback(response) {
        factorysearchresults.updatesearchresults(response.data);
        $state.go('app.bookresults');
        $scope.hide();
      }, function errorCallback(response) {
        $scope.hide();
        alert("error: "+response.data);
      });
  }

  //BarCode Scanner
  $scope.scanBarcode = function() {
        $cordovaBarcodeScanner.scan().then(function(imageData) {
            this.searchby.model = 'isbn';
            this.searchby.searchterm = imageData.text;
            $http({
              method: 'GET',
              url: 'http://openlibrary.org/search.json?'+this.searchby.model+"="+this.searchby.searchterm
            }).then(function successCallback(response) {
                factorysearchresults.updatesearchresults(response.data);
                $state.go('app.bookresults');
              }, function errorCallback(response) {
                alert("error: "+response.data);
              });
        }.bind(this), function(error) {
            console.log("An error happened -> " + error);
        });
    };

  //Loading function
  $scope.show = function() {
    $ionicLoading.show({
      template: 'Loading...'
    }).then(function(){
       console.log("The loading indicator is now displayed");
    });
  };
  $scope.hide = function(){
    $ionicLoading.hide().then(function(){
       console.log("The loading indicator is now hidden");
    });
  };
})

.controller('BookresultsCtrl', function($scope, $stateParams, factorysearchresults,$http,$state,sellresult,$firebaseArray) {
  $scope.searchresults = factorysearchresults.getsearchresults();
  $scope.openInExternalBrowser = function(path)
  {
    // $scope.timestamp = new Date;
   // Open in external browser
   window.open(path,'_system','location=yes');
  };
  $scope.SalePost = function (result){
    sellresult.updatesellresult(result);
    $state.go('app.sell');
  };
  $scope.BuyGet = function (){
    //$state.go('app.buy');
    var ref = new Firebase('https://cunybookshell.firebaseio.com/');
    $scope.list = $firebaseArray(ref); // data is downloading
    console.log($scope.list.length); // will be undefined, data is downloading
    $scope.list.$loaded().then(function(list) {
      console.log(list); // data has been downloaded!
  });
  };
})

.controller('CunyResultsCtrl', function($scope, $stateParams, cunysearchresults) {
  $scope.cunyresults = cunysearchresults.getsearchresults();
})

.controller('SellCtrl', function($scope, $stateParams, cunysearchresults,$firebaseArray,$state,sellresult) {
  $scope.seller = {
    name:"",
    email:"",
    mobile:"",
    college:"",
    price:"",
    book:""
  };
  $scope.result = sellresult.getsellresult();
  $scope.SalePost = function (){
    var SellRef = new Firebase("https://cunybookshell.firebaseio.com/");

    var Sell = $firebaseArray(SellRef);
    $scope.seller["book"] = $scope.result
    return Sell.$add($scope.seller);
  };
})

.controller('BuyCtrl', function($scope, $stateParams,$firebaseArray) {

});
