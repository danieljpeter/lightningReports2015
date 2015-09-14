({
    showReport : function(component, event, helper) {
	 	var report = component.get("v.report");        
		var rLoadEvent = $A.get("e.c:reportLoadEvent");
		rLoadEvent.setParams({"report": report});
		rLoadEvent.fire();
    }  
})