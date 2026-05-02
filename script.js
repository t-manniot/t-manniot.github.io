let total = 0;

function openModal() {

    let room = parseInt(document.getElementById("room").value);

    let young = parseInt(document.getElementById("young").value) || 0;
    let adult = parseInt(document.getElementById("adult").value) || 0;
    let senior = parseInt(document.getElementById("senior").value) || 0;

    total =
        (young * room * 0.5) +
        (adult * room) +
        (senior * room * 0.25);

    document.getElementById("priceText").innerText =
        "Celková cena: " + total + " T-t";

    document.getElementById("modal1").style.display = "flex";
}

function nextModal() {

    document.getElementById("modal1").style.display = "none";
    document.getElementById("paymentModal").style.display = "flex";

    let status = document.getElementById("payStatus");

    setTimeout(() => {
        status.innerText = "Processing payment...";
    }, 1000);

    setTimeout(() => {
        status.innerText = "Payment approved ✔";
    }, 3000);

    setTimeout(() => {
        document.getElementById("paymentModal").style.display = "none";
        document.getElementById("modal2").style.display = "flex";
    }, 4500);
}

function closeAll() {
    document.getElementById("modal2").style.display = "none";
}

function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text("T-MANNIOT RESERVATION", 20, 20);
    doc.text("Teatropica Island", 20, 30);
    doc.text("Total: " + total + " T-t", 20, 40);

    doc.save("booking.pdf");
}
