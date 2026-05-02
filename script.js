function calculatePrice() {

    let room = parseInt(document.getElementById("room").value);

    let young = document.getElementById("young").value || 0;
    let adult = document.getElementById("adult").value || 0;
    let senior = document.getElementById("senior").value || 0;

    let total =
        (young * room * 0.5) +
        (adult * room) +
        (senior * room * 0.25);

    return total;
}

function openModal() {
    let price = calculatePrice();

    document.getElementById("priceText").innerText =
        "Celková cena: " + price + " T-t";

    document.getElementById("modal1").style.display = "flex";
}

function nextModal() {

    document.getElementById("modal1").style.display = "none";

    // SHOW FAKE PAYMENT
    document.getElementById("paymentModal").style.display = "flex";

    let status = document.getElementById("payStatus");

    setTimeout(() => {
        status.innerText = "Verifying Citizenship Agreement...";
    }, 1500);

    setTimeout(() => {
        status.innerText = "Payment approved ✔";
    }, 3000);

    setTimeout(() => {
        document.getElementById("paymentModal").style.display = "none";
        document.getElementById("modal2").style.display = "flex";
    }, 4500);
}

/* PDF */
function downloadPDF() {

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text("T-MANNIOT RESERVATION", 20, 20);
    doc.text("Teatropica Island", 20, 30);

    doc.save("booking.pdf");
}

/* scroll animace */
const sections = document.querySelectorAll("section");

window.addEventListener("scroll", () => {
    sections.forEach(sec => {
        const top = sec.getBoundingClientRect().top;
        if (top < window.innerHeight - 100) {
            sec.classList.add("show");
        }
    });
});
