// ==========================================================================
// Project:   FinderViews.TestObject
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals FinderViews */

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
FinderViews.TestObject = SC.Record.extend(
/** @scope FinderViews.TestObject.prototype */ {

  toString: function() { return "TestObject(%@)".fmt(this.get('title')); }

});
