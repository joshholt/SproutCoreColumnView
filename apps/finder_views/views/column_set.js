// ==========================================================================
// Project:   SC.ColumnSetView
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals SC */

/** @class

  The Column Set View scrolls left to right and allows you to dive deeper into
  a Tree structure such as folders by displaying the treeItem's contents
  in a list view to the right of the folder..
  
  You can also view the meta data of a single item by clicking on it
  and the data will be displayed in the column to the right.
  
  The Column Set View uses an SC.ColumnView For Each Column.
  
  The Columns are seperated by a divider that can be used to resize the 
  column

  @extends SC.View
*/

sc_require('views/column');
sc_require('views/divider');

SC.ColumnSetView = SC.View.extend(
/** @scope SC.ColumnSetView.prototype */ {
  
  classNames: ['sc-column-set-view'],
  
  /**
   * The Array or Tree Structure holding the data that 
   * you would like to display
   */
  content: null,
  
  /**
   * The Example Scroll View determines what ScollView
   * Control is used for each internal Column
   */
  exampleScrollView: SC.ScrollView,
  
  /**
   * The Example Column View will display either a list of items
   * or the meta data of a single item
   */
  exampleColumnView: SC.ColumnView,
  
  /**
   * The initial width of a column in the set
   */
  initialColumnWidth: 250,
  
  /**
   * the thickness of the divider between cols
   */
  dividerThickness: 0,
  
  /**
   * The divider between the columns
   */
  exampleDividerView: SC.DividerView,
  
  /**
   * The meta data view for a single item
   */
  exampleMetaDataView: SC.ColumnMetaDataView,
  
  /**
   * The key used to determine whether we need to keep inching along
   */
  childrenContentKey: 'children',
  
  /**
   * The key used to display a nicer string for in the ColumnView
   */
  columnContentValueKey: 'name',
  
  /**
   * @optionnal
   *
   * The Item Open action can be a string representing a function on a target
   * or in your statechart. It can also be an anonymous function
   *
   * The Item open action will be fired when you double click on an items that
   * does not have a child array (either empty or with objects)
   */
  itemOpenAction: '',
  
  /**
   * @optional
   * 
   * The Item Open Target can be a property path representing some object with
   * your action to be fired. If you are using statecharts and have promoted 
   * it as your apps default responder this does not need to be specified if
   * your action is in your statechart.
   * 
   * If your action is an anonymous function then you should not define this 
   * property.
   *
   */
  itemOpenTarget: '',
  
  /**
   * The icon used for a single item as well as multiple at the moment
   */
  iconKey: '',
   
  
  /**
   * @private
   * 
   * Each Column has it's own controller and this is the book-keeper
   */
  _controllerCache: {},
  
  /**
   * @private
   *
   * This property is used to generate keys for controllers with out content
   * i.e. items with empty child arrays, etc...
   */
  _numControllers: 0,
  
  /**
   * Create a column
   */
  createColumn: function(idx, context, content) {
    var exampleScrollView     = context.get('exampleScrollView'),
        exampleColumnView     = context.get('exampleColumnView'),
        columnWidth           = context.get('initialColumnWidth'),
        dividerThickness      = context.get('dividerThickness'),
        columnContentValueKey = context.get('columnContentValueKey'),
        itemOpenAction        = context.get('itemOpenAction'),
        itemOpenTarget        = context.get('itemOpenTarget'),
        iconKey               = context.get('iconKey'),
        exampleMetaDataView   = context.get('exampleMetaDataView'),
        columnController      = context._createControllerForColumn(idx, context, content),
        myCurrentWidth        = context.$().width(),
        columnLeftPosition    = idx ? ((idx*columnWidth)+(idx*dividerThickness)) : 0,
        adjustment            = idx ? ((idx*columnWidth)+(idx*dividerThickness)+(columnWidth+dividerThickness)) : myCurrentWidth,
        depthKey              = "depth_%@".fmt(idx),
        viewCacheKey          = "%@_%@";
        
    // setup the view cache    
    context._sc_csv_cache = context._sc_csv_cache || {};
    
    // create the new child
    var newChild = context.createChildView(exampleColumnView.extend({
      layout: { top: 0, left: columnLeftPosition, bottom: 0, width: columnWidth},
      controller: columnController,
      wrapper: context,
      contentValueKey: columnContentValueKey,
      iconKey: iconKey,
      itemOpenAction: itemOpenAction,
      itemOpenTarget: itemOpenTarget,
      exampleScrollView: exampleScrollView,
      exampleMetaDataView: exampleMetaDataView
    }));
    
    // store new child in the cache
    viewCacheKey = viewCacheKey.fmt(depthKey, SC.guidFor(newChild));
    context._sc_csv_cache[viewCacheKey] = newChild;
    
    // Then keep the cache clean while adding the 
    // new view by replacing the old view at the same depth
    // or if we do not have a cached view at this depth insert it and it will
    // be replaced next trip around to it's same depth
    var cacheKeys = SC.keys(context._sc_csv_cache);
    var cacheLength = cacheKeys.length-1;
    cacheKeys.forEach(function(k, index) {
      var keyDepth = parseInt(k.split("_")[1],10);
      
      if (depthKey.match(k) && index < cacheLength) {
        context.replaceChild(context._sc_csv_cache[k], newChild);
        delete context._sc_csv_cache[k];
      }
      else if (k !== viewCacheKey && idx !== 0 && keyDepth >= idx) {
        context.removeChild(context._sc_csv_cache[k]);
        delete context._sc_csv_cache[k];
      }
      else if (index >= cacheLength ) {
        context.insertBefore(newChild, null);
      }
      
    });
    
    context.adjust('width', adjustment);
  },
  
  /**
   * @private
   * Creates a controller for the content of a column
   */
  _createControllerForColumn: function(idx, context, content) {
    var ret, childrenKey = context.get('childrenContentKey');
    
    
    if (content) {
      if (content.get('length') > 1) {
        ret = context._controllerCache[SC.guidFor(content)] = SC.ArrayController.create({
          content: content,
          wrapper: context,
          depth: idx+=1,
          
          selectionDidChange: function() {
            var selection       = this.get('selection');
            var selectionLength = selection.get('length');
            var wrapper         = this.get('wrapper');
            var depth           = this.get('depth');
            var children, obj;
            
            if (selectionLength === 1) {
               obj = selection.get('firstObject');
               children = obj.get(childrenKey);
               if (children) { 
                 wrapper.createColumn(depth, wrapper, children);
               }
               else { 
                 wrapper.createColumn(depth, wrapper, obj);
               }
            }
            
          }.observes('selection', 'wrapper')
          
        });
      }
      else {
        ret = this._controllerCache[SC.guidFor(content)] = SC.ObjectController.create({
          content: content
        });
      }
    }
    else {
      ret = this._controllerCache["columnController__%@".fmt(this._numControllers++)] = SC.ArrayController.create();
    }
    return ret;
  },
  
  _contentDidChange: function() {
    var content = this.get('content'), that = this;
    if (content) {
      that.createColumn(0, that, content);
    }
  }.observes('*content.[]')
   
});
