// ==========================================================================
// Project:   FinderViews - mainPage
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals FinderViews */

sc_require('views/column_set');

FinderViews.mainPage = SC.Page.design({

  mainPane: SC.MainPane.design({
    childViews: 'columnSet'.w(),
    
    columnSet: SC.ScrollView.design({
      layout: { centerX: 0, centerY: 0, width: 600, height: 200 },
      hasVerticalScroller: NO,
      contentView: SC.ColumnSetView.design({
        contentBinding: 'FinderViews.dataController.arrangedObjects',
        columnContentValueKey: 'title',
        iconKey: 'sc-icon-info-16'
      })
    })
  })

});
