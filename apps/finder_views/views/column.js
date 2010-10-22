// ==========================================================================
// Project:   SC.ColumnView
// Copyright: ©2010
// ==========================================================================
/*globals SC */

/** @class

  The ColumnView serves as a dual purpose view. It can be a listView
  or a meta data view.
  
  ******* It expects to recieve it's own controller

  @extends SC.View
*/

SC.COLUMN_VIEW_ROLE_LIST = 'list';
SC.COLUMN_VIEW_ROLE_META = 'meta-data';

SC.ColumnView = SC.View.extend(
/** @scope SC.ColumnView.prototype */ {
  
  classNames: ['sc-column-view'],
  
  /**
   * The controller this column will use for it's data
   */
  controller: null,
  
  /**
   * A reference to the this column's ColumnSetView
   * 
   * This is how we are able to continue to create more columns
   */
  wrapper: null,
  
  /**
   * Tells the user something useful
   */
  contentValueKey: null,
  
  /**
   * Gives the user something pretty
   */
  iconKey: null,
  
  /**
   * Allows the user to do something with the content
   */
  itemOpenAction: null,
  
  /**
   * Gives the user some place to do their something above
   */
  itemOpenTarget: null,
  
  /**
   * The example Scroll View is provided for this column but the 
   * column set
   */
  exampleScrollView: null,
  
  /**
   * The Example Meta Data View needs to be supplied to the ColumnSetView
   * it is used to display information about a single item.
   */
  exampleMetaDataView: null,
  
  /**
   * Create Child Views
   */
  createChildViews: function() {
    var views = [], view, that = this, controller = this.get('controller');
    
    view = this._createViewForMyRole(that, controller);
    views.push(view);
    
    this.set('childViews',views);
  },
  
  /**
   * @private
   * Create a my inner view based on my role
   */
  _createViewForMyRole: function(context, controller) {
    var role                  = context._setupMyRole(controller);
    var view, contentValueKey = context.get('contentValueKey');
    var exampleScrollView     = context.get('exampleScrollView');
    var exampleMetaDataView   = context.get('exampleMetaDataView');
    var icon                  = context.get('iconKey');
    
    if (role === SC.COLUMN_VIEW_ROLE_LIST) {
      view = context.createChildView(exampleScrollView.extend({
        hasHorizontalScroller: NO,
        contentView: SC.ListView.extend({
          contentBinding: SC.binding('.arrangedObjects', controller),
          selectionBinding: SC.binding('.selection', controller),
          contentValueKey: contentValueKey,
          hasContentIcon: icon ? YES : NO,
          contentIconKey: icon,
          // enabled reordering and dragging
          delegate: SC.ColumnDelegate,
          canReorderContent: YES,
          isDropTarget: YES
        })
      }));  
    }
    else {
      view = context.createChildView(exampleMetaDataView.extend({ 
        iconKey: icon, 
        content: controller.get('content')
      }));
    }
    return view;
  },
  
  /**
   * @private
   * 
   * Determines what this column's role should be [list | meta-data]
   * 
   * @params {Controller}       ObjectController | ArrayController
   * @returns {String}          The Column's role
   */
  _setupMyRole: function(controller) {
    var role;
    
    if (SC.kindOf(controller, SC.ArrayController)) {
      role = SC.COLUMN_VIEW_ROLE_LIST;
    }
    else {
      role = SC.COLUMN_VIEW_ROLE_META;
    }
    
    
    return role;
  }
   
});
