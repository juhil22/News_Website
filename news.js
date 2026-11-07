document.addEventListener("DOMContentLoaded", () => {
    const dateTimeElement = document.getElementById("date-time");
    const updateDateTime = () => {
        const now = new Date();
        const options = { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" };
        dateTimeElement.textContent = now.toLocaleString("en-IN", options);
    };

    updateDateTime();
    setInterval(updateDateTime, 60000);
});
