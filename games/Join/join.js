

const socket = new WebSocket("ws://localhost:3000");

socket.addEventListener("open", () => {
    // envoi d'un message au serveur
    socket.send(JSON.stringify({
        type: "bonjour du client",
        content: [ 3, "4" ]
    }));
});

// réception d'un message envoyé par le serveur
socket.addEventListener("message", ({ data }) => {
    const packet = JSON.parse(data);

    switch (packet.type) {
        case "bonjour du serveur":
            console.log("Le serveur m'a dit : " + packet.content);
            break;
    }
});