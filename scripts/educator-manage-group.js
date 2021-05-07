// JS for educator-manage-group.js

// Pull group name from URL and display it in the DOM
const parsedUrl = new URL(window.location.href);
var groupName = parsedUrl.searchParams.get("groupname");
$(".page-heading").html("Add Students to " + groupName);
