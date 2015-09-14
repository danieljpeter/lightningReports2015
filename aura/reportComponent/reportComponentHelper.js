({
    getReportsForSearch : function(component) {
        var action = component.get("c.getReportsForSearch");
        var self = this;
        action.setCallback(this, function(a){
            var reportListAll = a.getReturnValue();
            component.set("v.reportListAll", reportListAll);
        });
         $A.enqueueAction(action);
    },  
    doReportSearch : function(component) {
		var reportListMatched = [];
		var searchText = component.find("searchReports").get("v.value").toLowerCase();
        var reportListAll = component.get("v.reportListAll");

        //loop through all the reports and find any which match
        for (var i=0; i<reportListAll.length; i++) {
            var report = reportListAll[i];
            var nameLcase = report.Name.toLowerCase();
            if (nameLcase.indexOf(searchText) > -1) {
            	reportListMatched.push(report);   
            } 
        }
        component.set("v.reportList", reportListMatched);
    },        
    getReportResponse : function(component, event, helper) {
        var action = component.get("c.getReportResponse");
		var report = event.getParam("report");
        
        console.log(report);
        
        //clear the matched list of report search results
		component.set("v.reportList", []);        
        
        action.setParams({"reportId": report.Id});
        action.setCallback(this, function(a){
			var reportResponseObj = JSON.parse(a.getReturnValue());
            
            console.log('reportResponseObj');
            console.log(reportResponseObj);
            
            
            if (reportResponseObj.reportType != 'summary') { //matrix, tabular
                //massage the JS object a bit.  put the heading back into the object for each record
                var reportFields = reportResponseObj.tabResp.reportFields;
                var records = reportResponseObj.tabResp.fieldDataList;
                
                //loop over the data and add in the label
                for (var i=0; i<records.length; i++) {
                    //loop over the fields
                    for (var j=0; j<reportFields.length; j++) {
                        records[i][j].heading = reportFields[j].fieldLabel;
                    }
                }                    
            } else { //summary
                //similar to above, but the records are in groups

                //massage the JS object a bit.  put the heading back into the object for each record
                var reportFields = reportResponseObj.sumResp.reportFields;
                var groups = reportResponseObj.sumResp.groupList;
                
                //loop over the groups and data in the groups and add in the label
                for (var g=0; g<groups.length; g++) {
                    var records = groups[g].fieldDataList;
                    for (var i=0; i<records.length; i++) {
                        //loop over the fields
                        for (var j=0; j<reportFields.length; j++) {
                            records[i][j].heading = reportFields[j].fieldLabel;
                        }
                    }     
                }     
                
            }
            

            
            console.log('reportResponseObj');
            console.log(reportResponseObj);            
            
            component.set("v.tabResp", reportResponseObj.tabResp);
            component.set("v.sumResp", reportResponseObj.sumResp);
            component.set("v.reportResponse", reportResponseObj);
            
        });
        $A.enqueueAction(action);
    }
    
 
   
})