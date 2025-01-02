const canvas = document.getElementById("coloringCanvas");
const ctx = canvas.getContext("2d");

// Ukuran gambar dan canvas
const imageWidth = 600; // Ukuran gambar awal
const imageHeight = 600;
let zoomLevel = 1; // Level zoom (1 adalah ukuran normal)
let offsetX = 0,
    offsetY = 0; // Posisi geser gambar
let isDrawing = false;
let selectedColor = "black"; // Default warna hitam
let isPanning = false;
let startX = 0,
    startY = 0; // Koordinat mouse saat mulai pan
let currentImage = new Image(); // Gambar yang sedang dipilih

// Array untuk menyimpan titik yang telah digambar (x, y, warna)
let drawnColors = [];

// Daftar gambar (ubah dengan gambar Anda sendiri)
const imageOptions = {
    "gajah.jpg": "Gambar 1",
    "Kucing.jpg": "Gambar 2",
    "kelinci.jpg": "Gambar 3"
};

// Fungsi untuk mengganti gambar berdasarkan pilihan pengguna
function changeImage(imagePath) {
    currentImage.src = imagePath;
    currentImage.onload = () => {
        canvas.width = imageWidth;
        canvas.height = imageHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Bersihkan canvas
        drawImage(); // Gambar ulang dengan zoom level yang benar
    };
}

// Fungsi untuk menggambar gambar dengan zoom dan pan
function drawImage() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Bersihkan canvas
    ctx.save(); // Simpan state canvas
    ctx.scale(zoomLevel, zoomLevel); // Terapkan zoom
    ctx.translate(offsetX, offsetY); // Geser gambar berdasarkan offset
    ctx.drawImage(currentImage, 0, 0, imageWidth, imageHeight); // Gambar ulang
    ctx.restore(); // Kembalikan state canvas

    // Gambar ulang warna yang telah diterapkan
    for (let i = 0; i < drawnColors.length; i++) {
        const { x, y, color } = drawnColors[i];
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2); // Menggambar lingkaran kecil
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
    }
}

// Menambahkan event listener untuk tombol warna
const colorButtons = document.querySelectorAll(".color-btn");
colorButtons.forEach(button => {
    button.addEventListener("click", () => {
        selectedColor = button.getAttribute("data-color");
    });
});

// Event listener untuk memilih gambar
document.getElementById("imageSelect").addEventListener("change", (e) => {
    changeImage(e.target.value); // Ganti gambar saat pilihan berubah
});

// Memuat gambar pertama kali
changeImage("gajah.jpg");

// Fungsi untuk menggambar pada canvas
function draw(x, y) {
    // Simpan posisi dan warna yang digambar
    drawnColors.push({ x, y, color: selectedColor });

    // Gambar lingkaran pada titik yang diinginkan
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2); // Menggambar lingkaran kecil
    ctx.fillStyle = selectedColor;
    ctx.fill();
    ctx.closePath();
}

// Event listener untuk touchscreen (layar sentuh)
canvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    // Ambil posisi sentuhan pertama
    const touch = e.touches[0];
    const x = (touch.clientX - canvas.offsetLeft - offsetX) / zoomLevel;
    const y = (touch.clientY - canvas.offsetTop - offsetY) / zoomLevel;

    isDrawing = true;
    draw(x, y); // Mulai menggambar pada titik yang disentuh
}, { passive: false });

canvas.addEventListener("touchmove", (e) => {
    e.preventDefault();
    if (isDrawing) {
        // Ambil posisi sentuhan saat bergerak
        const touch = e.touches[0];
        const x = (touch.clientX - canvas.offsetLeft - offsetX) / zoomLevel;
        const y = (touch.clientY - canvas.offsetTop - offsetY) / zoomLevel;

        draw(x, y); // Gambar saat jari bergerak
    }
}, { passive: false });

canvas.addEventListener("touchend", () => {
    isDrawing = false; // Hentikan menggambar saat jari dilepas
});

// Fungsi untuk menyimpan gambar yang sudah diwarnai
document.getElementById("saveButton").addEventListener("click", () => {
    const dataUrl = canvas.toDataURL("image/png"); // Mengambil gambar dari canvas
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "gambar-warna.png"; // Nama file gambar yang diunduh
    link.click(); // Mengunduh file
});

// Fitur zoom
document.getElementById("zoomIn").addEventListener("click", () => {
    zoomLevel += 0.1; // Perbesar zoom
    drawImage(); // Gambar ulang dengan zoom baru
});

document.getElementById("zoomOut").addEventListener("click", () => {
    if (zoomLevel > 0.2) { // Mencegah zoom terlalu kecil
        zoomLevel -= 0.1; // Perkecil zoom
        drawImage(); // Gambar ulang dengan zoom baru
    }
});