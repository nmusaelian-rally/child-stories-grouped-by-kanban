//child stories updated in the last 30 days
Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    launch: function() {
        var millisecondsInDay = 86400000;
        var currentDate = new Date();
        var startDate = new Date(currentDate - millisecondsInDay*30); //in the last 30 days
        var startDateUTC = startDate.toISOString();
	
	var filters =  [
	    {
		property: 'LastUpdateDate',
		operator: '>',
		value: startDateUTC
	    },
	    {
		property: 'Parent',
		operator: '!=',
		value: null
	    }
        ];
	var myStore = Ext.create('Rally.data.WsapiDataStore',{
   		model: 'UserStory',
   		autoLoad:true,
   		fetch: ['Name','FormattedID','Parent', 'LastUpdateDate', 'c_MyKB'],
   		filters: filters,
		groupField: 'c_MyKB',
   		listeners: {
   			load: function(store,records,success){
   				console.log("loaded %i records", records.length);
   				this._makeGrid(myStore);
   			},
   			scope:this
   		}
   	});
	
	
    },
    
    _makeGrid: function(myStore){

   	this._myGrid = Ext.create('Ext.grid.Panel', {
   		store: myStore,
		features: [{ftype:'grouping'}],
   		columns: [
   		        {text: 'ID', dataIndex: 'FormattedID', xtype: 'templatecolumn',
                            tpl: Ext.create('Rally.ui.renderer.template.FormattedIDTemplate')},
   			{text: 'Name', dataIndex: 'Name'},
			{text: 'Kanban', dataIndex: 'c_MyKB'},
   			{
			text: 'Parent', dataIndex: 'Parent',
			    renderer: function(parent){
				return '<a href="' + Rally.nav.Manager.getDetailUrl(parent) + '">' + parent.FormattedID + '</a>'
			}
                        
                }
   		],
   		height: 400
   	});
   	this.add(this._myGrid);
    }
});

