// JS for educator-manage-group.js

// Pull group name from URL and display it in the DOM
const parsedUrl = new URL(window.location.href);
var groupName = parsedUrl.searchParams.get("groupname");
$(".page-heading").html("Add Students to " + groupName);

/**
 * Adds the current group to the link address of the selected option.
 */
function onClick() {
    $(document).click(function (event) {
        $(event.target).attr("href", $(event.target).attr("href") + "?groupname=" + groupname);
    });
}