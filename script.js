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
    img.src = "template.png"; // 👉 SEM TVOU PNG ŠABLONU

    img.onload = function () {

        doc.addImage(img, "PNG", 0, 0, 210, 297);

        const k = 0.2645;

        // 🆔 ID
        doc.text(bookingData.id, 380 * k, 85 * k);

        // 👤 name
        doc.text(bookingData.name, 365 * k, 645 * k);

        // 📧 email
        doc.text(bookingData.email, 365 * k, 735 * k);

        // 👶 young
        doc.text(String(bookingData.young), 675 * k, 905 * k);

        // 🧑 adult
        doc.text(String(bookingData.adult), 675 * k, 995 * k);

        // 👴 senior
        doc.text(String(bookingData.senior), 675 * k, 1085 * k);

        // 🏝 room
        doc.text(String(bookingData.room), 150 * k, 1240 * k);

        // 💰 total
        doc.text(bookingData.total + " T-t", 245 * k, 1415 * k);

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
