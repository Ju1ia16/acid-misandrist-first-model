function toggleMusic() {
    const music = document.getElementById("music");

    if (music.paused) {
        music.play();
    } else {
        music.pause();
    }
}

let comments = JSON.parse(localStorage.getItem("comments")) || [];

function saveComments() {
    localStorage.setItem("comments", JSON.stringify(comments));
}

function formatTime() {
    const now = new Date();
    return now.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit"
    });
}

function renderComments() {
    const list = document.getElementById("commentList");
    list.innerHTML = "";

    comments.forEach((c, index) => {
        const div = document.createElement("div");
        div.className = "comment";

        div.innerHTML = `
            <div class="comment-header">
                <span><b>${c.user}</b> · ${c.time}</span>
                <span class="like-btn" onclick="likeComment(${index})">
                💖 ${c.likes}
                </span>
            </div>
            <div>${c.text}</div>
        `;

        list.appendChild(div);
    });
}

function postComment() {
    const user = document.getElementById("usernameInput").value.trim();
    const text = document.getElementById("commentInput").value.trim();

    if (!user || !text) return;

    const newComment = {
        user: user,
        text: text,
        time: formatTime(),
        likes: 0
    };

    comments.unshift(newComment);

    saveComments();
    renderComments();

    document.getElementById("commentInput").value = "";
}

function likeComment(index, event) {
    comments[index].likes += 1;
    saveComments();
    renderComments();

    spawnHearts(event);
}

function renderComments() {
    const list = document.getElementById("commentList");
    list.innerHTML = "";

    comments.forEach((c, index) => {
        const div = document.createElement("div");
        div.className = "comment";

        div.innerHTML = `
            <div class="comment-header">
                <span><b>${c.user}</b> · ${c.time}</span>
                <span class="like-btn" onclick="likeComment(${index}, event)">
                    💖${c.likes}
                </span>
            </div>
            <div>${c.text}</div>
        `;

        list.appendChild(div);
    });
}

function spawnHearts(event) {
    const emojis = ["💖", "✨", "💗", "💞", "💘"];

    for (let i = 0; i < 6; i++) {
        const heart = document.createElement("div");
        heart.className = "glitter-heart";
        heart.innerText = emojis[Math.floor(Math.random() * emojis.length)];

        heart.style.left = event.clientX + "px";
        heart.style.top = event.clientY + "px";

        // random spread
        heart.style.transform = `translate(${(Math.random() - 0.5) * 40}px, 0px)`;

        document.body.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 1000);
    }
}

document.addEventListener("mousemove", function(e) {
    createSparkle(e.clientX, e.clientY);
});

function createSparkle(x, y) {
    const sparkles = ["✨"];

    const sparkle = document.createElement("div");
    sparkle.className = "sparkle";
    sparkle.innerText = sparkles[Math.floor(Math.random() * sparkles.length)];

    sparkle.style.left = x + "px";
    sparkle.style.top = y + "px";

    document.body.appendChild(sparkle);

    setTimeout(() => {
        sparkle.remove();
    }, 800);
}