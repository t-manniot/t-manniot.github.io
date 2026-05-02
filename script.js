let totalPrice = 0;

function calculate() {

    const persons = document.getElementById("persons").value;
    const room = document.getElementById("room").value;
    const from = new Date(document.getElementById("from").value);
    const to = new Date(document.getElementById("to").value);
    const age = document.getElementById("ageGroup").value;

    const days = (to - from) / (1000 * 60 * 60 * 24);

    let discount = 1;

    if (age === "young") discount = 0.5;
    if (age === "senior") discount = 0.25;

    totalPrice = days * persons * room * discount;

    document.getElementById("price").innerText =
        "Celková cena: " + totalPrice + " T-t";
}

document.getElementById("bookingForm").addEventListener("submit", function(e) {
    e.preventDefault();

    document.getElementById("result").classList.remove("hidden");

    document.getElementById("summary").innerText =
        "Rezervace vytvořena. Celková cena: " + totalPrice + " T-t";
});

function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text("T-MANNIOT HOTEL", 20, 20);
    doc.text("Reservation Confirmation", 20, 30);
    doc.text("Total Price: " + totalPrice + " T-t", 20, 50);

    doc.save("reservation.pdf");
}
