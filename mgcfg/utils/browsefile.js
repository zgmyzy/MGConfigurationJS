/*!
 * initFileInput for the browse btn
 */


function initFileInput(ctrlName, treeId, tabId, resId, refId, plainId)
{
    var control = $('#' + ctrlName);
    control.fileinput
    ({
        showPreview : false,
        showUpload : false,
        showRemove: false
    }).on("filebatchselected", function(event, files)
    {
        if (window.FileReader)
        {
            constructTree(treeId, resId, refId, plainId, files[0]);
            document.getElementById(tabId).style.visibility = "visible";

        }
        else
        {
            alert("Failed to open the file " + files[0].name + "! ");
        }

    });
}


