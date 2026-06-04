import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import { getDatabase, ref, push, onValue, update, get } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDBSYtptZlatPQW0VsMc4NpIhDRGua2HH4",
    authDomain: "acid-misandrist-firs-draft.firebaseapp.com",
    databaseURL: "https://acid-misandrist-firs-draft-default-rtdb.firebaseio.com",
    projectId: "acid-misandrist-firs-draft",
    storageBucket: "acid-misandrist-firs-draft.firebasestorage.app",
    messagingSenderId: "84027017237",
    appId: "1:84027017237:web:e5b3713d3d3e012cc5661c",
    measurementId: "G-B4L4VR6KG5"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// =====================
// LOCAL LIKE TRACKING (1 like per comment per browser)
// =====================
let likedComments = JSON.parse(localStorage.getItem("likedComments")) || {};

// =====================
// MUSIC
// =====================
function toggleMusic() {
    const music = document.getElementById("music");

    if (music.paused) {
        music.play();
    } else {
        music.pause();
    }
}
window.toggleMusic = toggleMusic;

// =====================
// TIME
// =====================
function formatTime() {
    const now = new Date();
    return now.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit"
    });
}

// =====================
// POST COMMENT
// =====================
function postComment() {
    const user = document.getElementById("usernameInput").value.trim();
    const text = document.getElementById("commentInput").value.trim();

    if (!user || !text) return;

    push(ref(db, "comments"), {
        user: user,
        text: text,
        time: formatTime(),
        likes: 0
    });

    document.getElementById("commentInput").value = "";
}
window.postComment = postComment;

// =====================
// LIKE COMMENT (1 per device)
// =====================
async function likeComment(commentId, currentLikes) {
    if (likedComments[commentId]) {
        return; // already liked
    }

    const commentRef = ref(db, `comments/${commentId}`);

    await update(commentRef, {
        likes: (currentLikes || 0) + 1
    });

    likedComments[commentId] = true;
    localStorage.setItem("likedComments", JSON.stringify(likedComments));
}
window.likeComment = likeComment;

// =====================
// LIVE COMMENTS
// =====================
const commentList = document.getElementById("commentList");

onValue(ref(db, "comments"), (snapshot) => {
    commentList.innerHTML = "";

    snapshot.forEach((child) => {
        const c = child.val();
        const id = child.key;

        const hasLiked = likedComments[id];

        const div = document.createElement("div");
        div.className = "comment";

        div.innerHTML = `
            <div class="comment-header">
                <span><b>${c.user}</b> · ${c.time}</span>

                <span class="like-btn" style="cursor:pointer; opacity:${hasLiked ? 0.5 : 1}">
                    💖 ${c.likes || 0}
                </span>
            </div>
            <div>${c.text}</div>
        `;

        div.querySelector(".like-btn").onclick = () => {
            likeComment(id, c.likes);
        };

        commentList.appendChild(div);
    });
});

// =====================
// SPARKLES
// =====================
document.addEventListener("mousemove", (e) => {
    const sparkle = document.createElement("div");
    sparkle.className = "sparkle";
    sparkle.innerText = "✨";

    sparkle.style.left = e.clientX + "px";
    sparkle.style.top = e.clientY + "px";

    document.body.appendChild(sparkle);

    setTimeout(() => sparkle.remove(), 800);
});
