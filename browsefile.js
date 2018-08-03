/*!
 * initFileInput for the browse btn
 */



function initFileInput(ctrlName)
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
                constructTree(e.target.result)
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
