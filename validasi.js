
const form = document.getElementById("contactForm");
const hasil = document.getElementById("hasil");
const tombol = document.getElementById("btnKirim");

// Konfigurasi EmailJS
const PUBLIC_KEY = "YcXEMJJvFMi2Ml25n";
const SERVICE_ID = "service_3q91jcy";
const TEMPLATE_ID = "template_67whozn";

// Inisialisasi EmailJS
emailjs.init({
    publicKey: PUBLIC_KEY
});

// Menampilkan pesan error
function tampilkanError(id, pesan) {
    document.getElementById(id).textContent = pesan;
}

// Menghapus pesan error
function hapusError(id) {
    document.getElementById(id).textContent = "";
}

// Mengatur tampilan input
function aturInput(id, valid) {
    const input = document.getElementById(id);

    input.classList.remove("valid", "invalid");
    input.classList.add(valid ? "valid" : "invalid");
}

// Validasi Nama
function cekNama() {
    const nama = document.getElementById("nama").value.trim();

    if (nama === "") {
        tampilkanError("errorNama", "Nama wajib diisi.");
        aturInput("nama", false);
        return false;
    }

    // Memeriksa apakah nama mengandung angka
    let adaAngka = false;

    for (let i = 0; i < nama.length; i++) {
        if (nama[i] >= "0" && nama[i] <= "9") {
            adaAngka = true;
            break;
        }
    }

    if (adaAngka) {
        tampilkanError(
            "errorNama",
            "Nama tidak boleh mengandung angka."
        );
        aturInput("nama", false);
        return false;
    }

    hapusError("errorNama");
    aturInput("nama", true);
    return true;
}

// Validasi Email
function cekEmail() {
    const email = document.getElementById("email").value.trim();

    if (email === "") {
        tampilkanError("errorEmail", "Email wajib diisi.");
        aturInput("email", false);
        return false;
    }

    const posisiAt = email.indexOf("@");
    const posisiTitik = email.indexOf(".", posisiAt + 1);

    if (
        posisiAt <= 0 ||
        !email.includes("@") ||
        posisiTitik <= posisiAt + 1 ||
        posisiTitik === email.length - 1 ||
        email.includes(" ")
    ) {
        tampilkanError(
            "errorEmail",
            "Masukkan alamat email dengan format yang benar."
        );
        aturInput("email", false);
        return false;
    }

    hapusError("errorEmail");
    aturInput("email", true);
    return true;
}

// Validasi Subjek
function cekSubjek() {
    const subjek = document.getElementById("subjek").value.trim();

    if (subjek === "") {
        tampilkanError("errorSubjek", "Subjek wajib diisi.");
        aturInput("subjek", false);
        return false;
    }

    hapusError("errorSubjek");
    aturInput("subjek", true);
    return true;
}

// Validasi Pesan
function cekPesan() {
    const pesan = document.getElementById("pesan").value.trim();

    if (pesan === "") {
        tampilkanError("errorPesan", "Pesan wajib diisi.");
        aturInput("pesan", false);
        return false;
    }

    hapusError("errorPesan");
    aturInput("pesan", true);
    return true;
}

// Validasi dan kirim email
form.addEventListener("submit", async function(event) {
    event.preventDefault();

    hasil.textContent = "";
    hasil.className = "";

    // Menjalankan seluruh validasi
    const hasilValidasi = [
        cekNama(),
        cekEmail(),
        cekSubjek(),
        cekPesan()
    ];

    // Memeriksa seluruh hasil validasi
    const semuaValid = hasilValidasi.every(function(valid) {
        return valid === true;
    });

    if (!semuaValid) {
        hasil.textContent =
            "Form belum bisa dikirim. Periksa kembali isian yang salah.";
        hasil.className = "gagal";
        return;
    }

    // Mengubah tombol ketika proses pengiriman
    tombol.disabled = true;
    tombol.textContent = "SENDING...";

    try {
        // Mengirim data form ke EmailJS
        await emailjs.sendForm(
            SERVICE_ID,
            TEMPLATE_ID,
            form
        );

        // Jika berhasil
        hasil.textContent =
            "Pesan berhasil dikirim! Terima kasih sudah menghubungi saya.";

        hasil.className = "sukses";

        // Mengosongkan form
        form.reset();

        // Menghapus warna validasi
        document.querySelectorAll(".valid, .invalid")
            .forEach(function(input) {
                input.classList.remove("valid", "invalid");
            });

        // Menghapus pesan error
        ["errorNama", "errorEmail", "errorSubjek", "errorPesan"]
            .forEach(hapusError);

    } catch (error) {

        // Jika gagal mengirim
        console.error("Gagal mengirim email:", error);

        hasil.textContent =
            "Pesan gagal dikirim. Silakan coba kembali.";

        hasil.className = "gagal";

    } finally {

        // Mengembalikan tombol
        tombol.disabled = false;
        tombol.textContent = "SEND MESSAGE";
    }
});

// Validasi ketika pengguna mengetik
document.getElementById("nama")
    .addEventListener("input", cekNama);

document.getElementById("email")
    .addEventListener("input", cekEmail);

document.getElementById("subjek")
    .addEventListener("input", cekSubjek);

document.getElementById("pesan")
    .addEventListener("input", cekPesan);  