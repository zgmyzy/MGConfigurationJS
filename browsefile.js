/*!
 * initFileInput for the browse btn
 */



function initFileInput(ctrlName, treeId, loadId, refId)
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
            var fr = new FileReader();
            fr.onloadend = function(e)
            {
                // setTimeout(treeView(treeId, e.target.result, refId), 10000);
                // setTimeout(function(){document.getElementById(loadId).style.visibility = "hidden";}, 200);
                // document.getElementById(loadId).style.visibility = "visible";
                treeView(treeId, e.target.result, refId); 
                // document.getElementById(loadId).style.visibility = "hidden";
            }
            fr.onerror = function()
            {
                alert("Failed when opening the file " + files[0].name + "! ")
            }
            fr.readAsText(files[0]);
        }
        else
        {
            alert("Failed to open the file " + files[0].name + "! ");
        }

    });
}
