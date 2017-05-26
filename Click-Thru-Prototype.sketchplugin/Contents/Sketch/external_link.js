@import "constants.js"
@import "utils.js"
@import "ui.js"

var buildAlertWindow = function(link, openLinkInNewWindow) {
  var alertWindow = COSAlertWindow.new()
  alertWindow.addButtonWithTitle("Add")
  alertWindow.addButtonWithTitle("Remove")
  alertWindow.addButtonWithTitle("Cancel")
  alertWindow.setMessageText("External Link")
  alertWindow.setInformativeText("Open the following URL when you click on the selected layers.")
  
  var accessoryView = NSView.alloc().initWithFrame(NSMakeRect(0, 0, 300, 64))
  var linkLabel = UI.buildLabel("URL", 12, NSMakeRect(0, 44, 300, 20))
  accessoryView.addSubview(linkLabel)
  var linkTextField = UI.buildTextField(link, NSMakeRect(0, 24, 300, 20))
  accessoryView.addSubview(linkTextField)
  var openLinkInNewWindowCheckbox = UI.buildCheckbox("Open link in new window", openLinkInNewWindow, NSMakeRect(0, 0, 300, 20))
  accessoryView.addSubview(openLinkInNewWindowCheckbox)
  alertWindow.addAccessoryView(accessoryView)

  return [alertWindow, [linkTextField, openLinkInNewWindowCheckbox]]
}

var onRun = function(context) {
  var doc = context.document
  var selection = context.selection
  
  if (selection.length == 0) {
    UI.displayDialog("Select a one or more layers.")
    return
  }
  
  var link = Utils.valueForKeyOnLayers(Constants.EXTERNAL_LINK, selection, context, "")
  var openLinkNewWindow = Utils.valueForKeyOnLayers(Constants.OPEN_LINK_IN_NEW_WINDOW, selection, context, false)
  var retVals = buildAlertWindow(link, openLinkNewWindow), alertWindow = retVals[0], inputControls = retVals[1]
  var response = alertWindow.runModal()
  if (response != 1002) {
    var link = inputControls[0].stringValue()
    if (link == "" || response == 1001) {
      // remove
      Utils.setValueOnLayers(null, Constants.EXTERNAL_LINK, selection, context)
    } else {
      // add
      Utils.setValueOnLayers(link, Constants.EXTERNAL_LINK, selection, context)
      Utils.setValueOnLayers(inputControls[1].state(), Constants.OPEN_LINK_IN_NEW_WINDOW, selection, context, false)
    }
  }
}