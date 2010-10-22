// ==========================================================================
// Project:   FinderViews
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals FinderViews */

/** @namespace

  My cool new app.  Describe your application.
  
  @extends SC.Object
*/

FinderViews = SC.Application.create(
  /** @scope FinderViews.prototype */ {

  NAMESPACE: 'FinderViews',
  VERSION: '0.1.0',

  // This is your application store.  You will use this store to access all
  // of your model data.  You can also set a data source on this store to
  // connect to a backend server.  The default setup below connects the store
  // to any fixtures you define.
  store: SC.Store.create().from(SC.Record.fixtures)

}) ;
