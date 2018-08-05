/*!
 * initFileInput for the browse btn
 */



function initFileInput(ctrlName, treeId, loadId)
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
                document.getElementById(loadId).style.display = "";
                treeView(treeId, e.target.result); 
                document.getElementById(loadId).style.display = "none";
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
