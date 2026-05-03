import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-analytics.js";

// 🔥 FIREBASE CONFIG (TVŮJ)
const firebaseConfig = {
    apiKey: "AIzaSyB5wWWLIFTqRbVoCS416p6n5EA1GahE0sw",
    authDomain: "t-manniot.firebaseapp.com",
    projectId: "t-manniot",
    storageBucket: "t-manniot.firebasestorage.app",
    messagingSenderId: "1090192887813",
    appId: "1:1090192887813:web:2191929ba45b468c400c6c",
    measurementId: "G-6VJSSWZKRG"
};

// Init
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
getAnalytics(app);

let total = 0;
let bookingData = {};
let bookingID = "";

// 🆔 ID generator
function generateID() {
    return "TMM-" + Math.floor(Math.random() * 99999);
}

/* PRICE */
let room = parseInt(document.getElementById("room").value);

let young = parseInt(document.getElementById("young").value) || 0;
let adult = parseInt(document.getElementById("adult").value) || 0;
let senior = parseInt(document.getElementById("senior").value) || 0;

let fromValue = document.getElementById("dateFrom").value;
let toValue = document.getElementById("dateTo").value;

if (!fromValue || !toValue) {
    alert("Vyber datum příjezdu a odjezdu");
    return;
}

let from = new Date(fromValue);
let to = new Date(toValue);

let nights = (to - from) / (1000 * 60 * 60 * 24);

if (nights <= 0) {
    alert("Datum odjezdu musí být později než příjezdu");
    return;
}

// 💰 výpočet ceny
total =
    ((young * room * 0.5) +
    (adult * room) +
    (senior * room * 0.25)) * nights;
    bookingID = generateID();

    bookingData = {
        id: bookingID,
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        from: document.getElementById("dateFrom").value,
        to: document.getElementById("dateTo").value,
        nights: nights,
        young,
        adult,
        senior,
        room,
        total
    };

    document.getElementById("priceText").innerText =
        "Celková cena: " + total + " T-t";

    document.getElementById("modal1").style.display = "flex";
}

/* PAYMENT FLOW */
function nextModal() {

    document.getElementById("modal1").style.display = "none";
    document.getElementById("paymentModal").style.display = "flex";

    let status = document.getElementById("payStatus");

    setTimeout(() => status.innerText = "Processing...", 1000);

    setTimeout(() => status.innerText = "Approved ✔", 3000);

    setTimeout(async () => {

        document.getElementById("paymentModal").style.display = "none";
        document.getElementById("modal2").style.display = "flex";

        // 💾 SAVE TO FIREBASE
        await addDoc(collection(db, "bookings"), bookingData);

    }, 4500);
}

/* CLOSE */
function closeAll() {
    document.getElementById("modal2").style.display = "none";
}

/* PDF + PNG ŠABLONA */
function downloadPDF() {

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF("p", "mm", "a4");

    let img = new Image();
    img.src = "template.png";

    img.onload = function () {

        const pageW = 210;
        const pageH = 297;

        doc.addImage(img, "PNG", 0, 0, pageW, pageH);

        let d = bookingData || {};

        // 🔥 FINÁLNÍ OFFSET (doladěno podle tvého PDF)
        const offsetX = -20;   // ← POSUN DOLEVA
        const offsetY = -5;    // ← POSU NAHORU

        // 🆔 ID
        doc.text(String(d.id || ""), 93 + offsetX, 18 + offsetY);

        // 👤 jméno
        doc.text(String(d.name || ""), 90 + offsetX, 140 + offsetY);

        doc.text("Od: " + d.from, 20, 160);
        doc.text("Do: " + d.to, 20, 170);
        doc.text("Počet nocí: " + d.nights, 20, 180);

        // 📧 email
        doc.text(String(d.email || ""), 90 + offsetX, 170 + offsetY);

        // 👶 young
        doc.text(String(d.young || 0), 145 + offsetX, 150 + offsetY);

        // 🧑 adult
        doc.text(String(d.adult || 0), 145 + offsetX, 175 + offsetY);

        // 👴 senior
        doc.text(String(d.senior || 0), 145 + offsetX, 190 + offsetY);

        // 🏝 pokoj
        doc.text(String(d.room || ""), 75 + offsetX, 225 + offsetY);

        // 💰 cena
        doc.text(String(d.total || 0) + " T-t", 90 + offsetX, 245 + offsetY);

        doc.save("T-MANNIOT-booking.pdf");
    };
}
/* SCROLL ANIMATION */
const elements = document.querySelectorAll(".fade");

window.addEventListener("scroll", () => {
    elements.forEach(el => {
        let top = el.getBoundingClientRect().top;

        if (top < window.innerHeight - 80) {
            el.style.transform = "translateY(0)";
            el.style.opacity = "1";
        }
    });
});

/* EXPORT (aby HTML viděl funkce) */
window.openModal = openModal;
window.nextModal = nextModal;
window.closeAll = closeAll;
window.downloadPDF = downloadPDF;

window.addEventListener("load", () => {
    document.getElementById("dateFrom").min = new Date().toISOString().split("T")[0];
});
