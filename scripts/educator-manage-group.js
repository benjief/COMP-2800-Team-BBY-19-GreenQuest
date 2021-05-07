// JS for educator-manage-group.js

// Pull group name from URL and display it in the DOM
const parsedUrl = new URL(window.location.href);
var groupName = parsedUrl.searchParams.get("groupname");
$(".page-heading").html("Add Students to " + groupName);

/**
 * Adds the current group, along with a redirect flag, to the link address of the selected option.
 */
function onClick() {
    $(document).click(function (event) {
        let redirectLink = $(event.target).attr("href");
        redirectLink += "?groupname=" + groupName + "&redirectflag=true";
        $(event.target).attr("href", redirectLink);
    });
}