const formatTanggal = t =>
  new Date(t).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

const beritaUrut = [...DAFTAR_BERITA].sort((a, b) => b.tanggal.localeCompare(a.tanggal));

// Halaman Berita
const daftarBerita = document.getElementById("daftar-berita");
beritaUrut.forEach(b => {
  const fotoHTML = b.foto
    ? `<div class="galeri">${b.foto.map(f => `<img src="${f}" alt="Dokumentasi ${b.judul}">`).join("")}</div>`
    : "";
  daftarBerita.innerHTML += `
    <article>
      <h3>${b.judul}</h3>
      <p class="tgl">${formatTanggal(b.tanggal)}</p>
      <p>${b.ringkasan}</p>
      ${fotoHTML}
    </article>`;
});

// 3 berita terbaru di Beranda
const beritaBeranda = document.getElementById("berita-beranda");
beritaUrut.slice(0, 3).forEach(b => {
  const ringkas = b.ringkasan.length > 140 ? b.ringkasan.slice(0, 140).trim() + "..." : b.ringkasan;
  const gambar = b.foto ? `<img class="thumb" src="${b.foto[0]}" alt="${b.judul}">` : "";
  beritaBeranda.innerHTML += `
    <article>
      ${gambar}
      <p class="tgl">${formatTanggal(b.tanggal)}</p>
      <h3>${b.judul}</h3>
      <p>${ringkas}</p>
      <a class="kembali" href="#berita">Baca selengkapnya →</a>
    </article>`;
});

// Menu dan perpindahan halaman
const menuLinks = document.querySelectorAll(".nav-link");
const semuaHalaman = document.querySelectorAll(".halaman");

function tampilkanHalaman(id) {
  let target = document.getElementById(id);
  if (!target || !target.classList.contains("halaman")) {
    id = "beranda";
    target = document.getElementById(id);
  }
  const menuAktif = target.dataset.induk || id;
  semuaHalaman.forEach(h => h.classList.toggle("aktif", h === target));
  menuLinks.forEach(a => a.classList.toggle("aktif", a.getAttribute("href") === "#" + menuAktif));
  window.scrollTo(0, 0);
}

document.addEventListener("click", e => {
  const a = e.target.closest("a[href^='#']");
  if (!a) return;
  e.preventDefault();
  const id = a.getAttribute("href").substring(1);
  history.pushState(null, "", "#" + id);
  bootstrap.Collapse.getOrCreateInstance(document.getElementById("menuUtama"), { toggle: false }).hide();
  tampilkanHalaman(id);
});

window.addEventListener("popstate", () => tampilkanHalaman(location.hash.substring(1)));
tampilkanHalaman(location.hash.substring(1));

// Animasi muncul saat scroll
const elemenAnimasi = document.querySelectorAll(
  ".hero, .statistik div, .kotak, article, .kartu-info, .mapel, .kartu-kontak"
);
if ("IntersectionObserver" in window) {
  const pengamat = new IntersectionObserver(daftar => {
    daftar.forEach(item => {
      if (item.isIntersecting) {
        item.target.classList.add("terlihat");
        pengamat.unobserve(item.target);
      }
    });
  }, { threshold: 0.12 });
  elemenAnimasi.forEach(el => { el.classList.add("reveal"); pengamat.observe(el); });
}

// Pencarian berita
const kolomCari = document.getElementById("cari-berita");
const pesanKosong = document.getElementById("berita-kosong");
kolomCari.addEventListener("input", () => {
  const kata = kolomCari.value.toLowerCase().trim();
  let ada = 0;
  document.querySelectorAll("#daftar-berita article").forEach(a => {
    const cocok = a.textContent.toLowerCase().includes(kata);
    a.style.display = cocok ? "" : "none";
    if (cocok) ada++;
  });
  pesanKosong.hidden = ada > 0;
});

// Form kontak dengan validasi
const formKontak = document.getElementById("form-kontak");
const pesanSukses = document.getElementById("sukses");

function setGalat(id, teks) {
  document.getElementById("galat-" + id).textContent = teks;
  document.getElementById(id).classList.toggle("salah", teks !== "");
}

formKontak.addEventListener("submit", e => {
  e.preventDefault();
  pesanSukses.hidden = true;
  const nama = document.getElementById("nama").value.trim();
  const email = document.getElementById("email").value.trim();
  const pesan = document.getElementById("pesan").value.trim();

  const galatNama = nama.length < 3 ? "Nama minimal 3 huruf." : "";
  const galatEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "" : "Format email belum benar.";
  const galatPesan = pesan.length < 10 ? "Pesan minimal 10 karakter." : "";
  setGalat("nama", galatNama);
  setGalat("email", galatEmail);
  setGalat("pesan", galatPesan);
  if (galatNama || galatEmail || galatPesan) return;

  const teks = `Halo, saya ${nama} (${email}).\n\n${pesan}`;
  window.open("https://wa.me/6285713359721?text=" + encodeURIComponent(teks), "_blank");
  pesanSukses.hidden = false;
  formKontak.reset();
});
