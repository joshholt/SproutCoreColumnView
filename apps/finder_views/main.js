// ==========================================================================
// Project:   FinderViews
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals FinderViews */

FinderViews.main = function main() {

  FinderViews.getPath('mainPage.mainPane').append() ;
  
  var data = FinderViews.store.find(FinderViews.TestObject);
  FinderViews.dataController.set('content',data); 

};

function main() { FinderViews.main(); }
