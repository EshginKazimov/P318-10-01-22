"use strict";

/*var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();*/

//Disable send button until connection is established
//document.getElementById("sendButton").disabled = true;

//connection.on("ReceiveMessage", function (user, message) {
//    var li = document.createElement("li");
//    document.getElementById("messagesList").appendChild(li);
//    // We can assign user-supplied strings to an element's textContent because it
//    // is not interpreted as markup. If you're assigning in any other way, you 
//    // should be aware of possible script injection concerns.
//    li.textContent = `${user} says ${message}`;
//});

//connection.start().then(function () {
//    document.getElementById("sendButton").disabled = false;
//}).catch(function (err) {
//    return console.error(err.toString());
//});

//document.getElementById("sendButton").addEventListener("click", function (event) {
//    var user = document.getElementById("userInput").value;
//    var message = document.getElementById("messageInput").value;
//    connection.invoke("SendMessage", user, message).catch(function (err) {
//        return console.error(err.toString());
//    });
//    event.preventDefault();
//});

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

connection.start().then(function () {
    if (localStorage.getItem("user")) {
        document.getElementById("inputArea").classList.add("d-none");
        document.getElementById("messageArea").classList.remove("d-none");

        var group = JSON.parse(localStorage.getItem("user")).group;

        connection.invoke("EnterGroup", group).catch(function (err) {
            return console.error(err.toString());
        });
    }
}).catch(function (err) {
    return console.error(err.toString());
});

document.getElementById("enterGroup").addEventListener("click", function (event) {
    event.preventDefault();

    document.getElementById("inputArea").classList.add("d-none");
    document.getElementById("messageArea").classList.remove("d-none");

    var username = document.getElementById("username").value;
    var group = document.getElementById("group").value;

    var user = { username: username, group: group };
    localStorage.setItem("user", JSON.stringify(user));

    connection.invoke("EnterGroup", group).catch(function (err) {
        return console.error(err.toString());
    });

    document.getElementById("username").value = "";
});

document.getElementById("leaveGroup").addEventListener("click", function (event) {
    event.preventDefault();

    document.getElementById("messageArea").classList.add("d-none");
    document.getElementById("inputArea").classList.remove("d-none");

    var group = JSON.parse(localStorage.getItem("user")).group;

    connection.invoke("LeaveGroup", group).catch(function (err) {
        return console.error(err.toString());
    });

    localStorage.removeItem("user");
});

document.getElementById("sendMessage").addEventListener("click", function (event) {
    event.preventDefault();

    var username = JSON.parse(localStorage.getItem("user")).username;
    var group = JSON.parse(localStorage.getItem("user")).group;
    var message = document.getElementById("message").value;

    connection.invoke("SendMessage", username, group, message).catch(function (err) {
        return console.error(err.toString());
    });

    document.getElementById("message").value = "";
});

connection.on("ReceiveMessage", function (username, message) {
    var li = document.createElement("li");
    document.getElementById("messagesList").appendChild(li);
    // We can assign user-supplied strings to an element's textContent because it
    // is not interpreted as markup. If you're assigning in any other way, you 
    // should be aware of possible script injection concerns.
    li.textContent = `${username} says ${message}`;
});
