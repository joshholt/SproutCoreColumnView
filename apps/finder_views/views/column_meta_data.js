//============================================================================
// SC.ColumnMetaDataView
//============================================================================
/*globals SC*/

/**

  This is just a basic meta data view for a single item in an SC.ColumnView
  
  @extends SC.View
  @author Josh Holt
  @version 1.4
  @since 1.4

*/

SC.ColumnMetaDataView = SC.View.extend(SC.ContentDisplay,
  /** @scope SC.ColumnMetaDataView.prototype */{
    
  classNames: ['sc-column-meta-data-view'],
  
  /**
   * For the basic view we make the assumption that your model 
   * has the following properties 
   *
   *    created, updated, name
   *
   */
  content: null,
  
  displayProperties: [],
  
  contentDisplayProperties: [],
  
  /**
   * The key for the Icon
   */
  iconKey: '',
  
  /**
   * If there are actions for the item represented by this view, define this
   * property with a string or anonymous function
   */
  action: '',
  
  /**
   * If there are actions that require a target for the item represented by 
   * this view, define this property with a propertyPath or leave null if 
   * you have set up a statechart as the default responder
   */
  target: '',
  
  createChildViews: function() {
   var view, views = [], content = this.get('content'), that = this;
   var action = this.get('action');
   
   // The Image representing the Item
   view = that.iconView = that.createChildView(SC.ImageView, {
     layout: { top: 10, centerX: 0, height: 48, width: 48},
     classNames: ['sc-column-meta-data-icon'],
     value: that.get('iconKey')
   });
   views.push(view);
   
   // The Meta Data
   view = that.metadataView = that.createChildView(SC.View, {
     layout: { top: 64, left: 0, right:0, bottom: 0},
     classNames: ['sc-column-meta-data-info'],
     childViews: [
      SC.LabelView.extend({
        layout: { top: 0, left: 10, height: 22, right: 10},
        content: content,
        contentValueKey: 'name'
      }),
      SC.LabelView.extend({
        layout: { top: 28, left: 10, height: 22, right: 10},
        content: content,
        contentValueKey: 'updatedAt'
      }),
      SC.LabelView.extend({
        layout: { top: 56, left: 10, height: 22, right: 10},
        content: content,
        contentValueKey: 'createdAt'
      })
     ]
   });
   views.push(view);
   
   // Button Bar if needed
   if (action) {
    view = that.buttonBarView = that.createChildView(SC.View, {
      // TODO Implement the button bar
    });
    //views.push(view);
   }
   
   this.set('childViews',views);
  }
  
  
});