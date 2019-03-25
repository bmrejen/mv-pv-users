// Client ID and API key from the Developer Console
var CLIENT_ID = '370957812504-q434e61j772ehv68fl4722fraomiduc4.apps.googleusercontent.com';
var API_KEY = 'AIzaSyBeysOdY1ZjiSNpj-PA5Qr2Z-EaJGQNOTQ';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/admin/directory_v1/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = 'https://www.googleapis.com/auth/admin.directory.user.readonly';

var authorizeButton = null;
var signoutButton = null;

/**
*  Initializes the API client library and sets up sign-in state
*  listeners.
*/
function initClient() {
    console.log("init client from gapi-methods");
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function() {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
    }, function(error) {
        appendPre(JSON.stringify(error, null, 2));
    });
}

/**
*  Called when the signed in status changes, to update the UI
*  appropriately. After a sign-in, the API is called.
*/
function updateSigninStatus(isSignedIn) {
    authorizeButton = document.getElementById('authorize_button');
    signoutButton = document.getElementById('signout_button');

    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        listUsers();
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
    }
}

/**
*  Sign in the user upon button click.
*/
function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

/**
*  Sign out the user upon button click.
*/
function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}

/**
* Append a pre element to the body containing the given message
* as its text node. Used to display the results of the API call.
*
* @param {string} message Text to be placed in pre element.
*/
function appendPre(message) {
    var pre = document.getElementById('content');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
}

/**
* Print the first 10 users in the domain.
*/
function listUsers() {
    gapi.client.directory.users.list({
        'customer': 'my_customer',
        'maxResults': 500,
        'orderBy': 'email'
    }).then(function(response) {
        var users = response.result.users;
        appendPre('Users:');

        if (users && users.length > 0) {
            for (i = 0; i < users.length; i++) {
                var user = users[i];
                appendPre('-' + user.primaryEmail + ' (' + user.name.fullName + ')');
            }
        } else {
            appendPre('No users found.');
        }
    });
}
