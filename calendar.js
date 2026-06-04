function openNote(dayElement) {
    let existing = dayElement.getAttribute("data-note") || "";

    let note = prompt("Write your entry:", existing);

    if(note !== null) {
        dayElement.setAttribute("data-note", note);

        localStorage.setItem("day-" + dayElement.innerText, note);

        dayElement.innerHTML = `
        ${dayElement.innerText}
        <div style="fonr-size:10px; margin-top:5px;">${note}</div>
        `;
    }
}

window.onload = function () {
    document.querySelectorAll(".day").forEach(day => {
        let saved= localStorage.getItem("day-" + day.innerText);
        if(saved){
            day.innerHTML = `
            ${day.innerText}
            <div style=font-size:10px; margin-top:5px;">${saved}</div>
            `;
        }
    });
};