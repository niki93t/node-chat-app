var socket = io();

function scrollToBottom() {
    //Selectors
    var messages = $("#messages");
    var newMessage = messages.children("li:last-child");

    //Heights
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
}

socket.on("connect", function () {
    console.log("Connected to server");
});

socket.on("disconnect", function () {
    console.log("Disconnected from server");
});

socket.on("newMessage", function (message) {
    var template = $("#message-template").html();
    var formatedTime = moment(message.createdAt).format("h:mm a");

    var html = Mustache.render(template, {
        from: message.from,
        text: message.text,
        createdAt: formatedTime
    });

    $("#messages").append(html);

    scrollToBottom();
});

socket.on("newLocationMessage", function (message) {
    var template = $("#location-message-template").html();
    var formatedTime = moment(message.createdAt).format("h:mm a");

    var html = Mustache.render(template, {
        from: message.from,
        url: message.url,
        createdAt: formatedTime
    });

    $("#messages").append(html);

    scrollToBottom();
});

$("#message-form").on("submit", function (e) {
    e.preventDefault();

    var messageTextbox = $("[name=message]");

    socket.emit("createMessage", {
        from: "User",
        text: messageTextbox.val()
    }, function () {
        messageTextbox.val("");
    });
});


var locationButton = $("#send-location");
locationButton.on("click", function () {
    if (!navigator.geolocation) {
        alert("Geolocation not supported by your browser.");
    }

    locationButton.attr("disabled", true)
        .text("Sending location...");

    navigator.geolocation.getCurrentPosition(function (position) {
        locationButton.removeAttr("disabled")
            .text("Send location");
        socket.emit("createLocationMessage", {
            from: "User",
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, function () {
        });
    }, function () {
        locationButton.removeAttr("disabled")
            .text("Send location");

        alert("Unable to fetch location.")
    });
});