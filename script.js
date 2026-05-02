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
function openModal() {

    let room = parseInt(document.getElementById("room").value);

    let young = parseInt(document.getElementById("young").value) || 0;
    let adult = parseInt(document.getElementById("adult").value) || 0;
    let senior = parseInt(document.getElementById("senior").value) || 0;

    total =
        (young * room * 0.5) +
        (adult * room) +
        (senior * room * 0.25);

    bookingID = generateID();

    bookingData = {
        id: bookingID,
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
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
    const doc = new jsPDF();

    let img = new Image();
    img.src = "template.png"; // tvoje šablona

    img.onload = function () {

        // 📄 přesné vložení šablony (NEŠKÁLOVAT)
        doc.addImage(img, "PNG", 0, 0, 210, 297);

        // 🧠 DATA (z booking flow – musí existovat globálně)
        let data = bookingData || {};

        // 🆔 ID
        doc.text(String(data.id || ""), 577, 150);

        // 👤 jméno
        doc.text(String(data.name || ""), 520, 780);

        // 📧 email
        doc.text(String(data.email || ""), 520, 900);

        // 👶 young
        doc.text(String(data.young || 0), 1080, 1030);

        // 🧑 adult
        doc.text(String(data.adult || 0), 1080, 1140);

        // 👴 senior
        doc.text(String(data.senior || 0), 1080, 1250);

        // 🏝 pokoj
        doc.text(String(data.room || ""), 350, 1400);

        // 💰 cena
        doc.text(String(data.total || 0) + " T-t", 520, 1550);

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
