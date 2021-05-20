// JS for educator-manage-class.js

// Pull class name from URL and display it in the DOM
const parsedUrl = new URL(window.location.href);
var className = parsedUrl.searchParams.get("classname");
$(".page-heading").html("Add Students to " + className);

/**
 * Adds the current class, along with a redirect flag, to the link address of the selected option.
 */
function onClick() {
    $(document).click(function (event) {
        let redirectLink = $(event.target).attr("href");
        redirectLink += "?classname=" + className + "&redirectflag=true";
        $(event.target).attr("href", redirectLink);
    });
}