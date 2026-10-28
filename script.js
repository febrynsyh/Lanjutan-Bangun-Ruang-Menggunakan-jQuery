
$(document).ready(function () {
    const $shapeSelect = $("#shape");
    const $inputFields = $("#inputFields");
    const $calculatorForm = $("#calculatorForm");
    const $result = $("#result");

    const shapes = {
        kubus: {
            name: "Kubus",
            fields: [
                ["sisi", "Panjang sisi (cm)"]
            ]
        },

        balok: {
            name: "Balok",
            fields: [
                ["panjang", "Panjang (cm)"],
                ["lebar", "Lebar (cm)"],
                ["tinggi", "Tinggi (cm)"]
            ]
        },

        tabung: {
            name: "Tabung",
            fields: [
                ["jari", "Jari-jari (cm)"],
                ["tinggi", "Tinggi (cm)"]
            ]
        },

        kerucut: {
            name: "Kerucut",
            fields: [
                ["jari", "Jari-jari (cm)"],
                ["tinggi", "Tinggi (cm)"]
            ]
        },

        bola: {
            name: "Bola",
            fields: [
                ["jari", "Jari-jari (cm)"]
            ]
        },

        limas: {
            name: "Limas Segi Empat Beraturan",
            fields: [
                ["sisi", "Panjang sisi alas (cm)"],
                ["tinggi", "Tinggi tegak limas (cm)"]
            ]
        },

        prisma: {
            name: "Prisma Segitiga Siku-siku",
            fields: [
                ["alas", "Sisi tegak segitiga (cm)"],
                ["tinggiSegitiga", "Sisi tegak segitiga lainnya (cm)"],
                ["panjangPrisma", "Panjang prisma (cm)"]
            ]
        },

        limasSegitiga: {
            name: "Limas Segitiga Beraturan",
            fields: [
                ["sisi", "Panjang sisi alas segitiga (cm)"],
                ["tinggi", "Tinggi tegak limas (cm)"]
            ]
        }
    };

    // Membuat input sesuai bangun ruang yang dipilih
    function tampilkanInput() {
        const jenis = $shapeSelect.val();
        const shape = shapes[jenis];

        const html = shape.fields.map(([id, label]) => `
            <label for="${id}">${label}</label>
            <input
                type="number"
                id="${id}"
                min="0.01"
                step="any"
                placeholder="Masukkan ${label.toLowerCase()}"
                required
            >
        `).join("");

        $inputFields.stop(true, true).fadeOut(150, function () {
            $inputFields.html(html).fadeIn(250);
        });

        $result.stop(true, true).slideUp(200);
    }

    // Mengambil dan memvalidasi nilai input
    function ambilNilai(id) {
        const $input = $("#" + id);
        const nilai = $input.valAsNumber
            ? $input.valAsNumber()
            : Number($input.val());

        if (
            $input.val().trim() === "" ||
            !Number.isFinite(nilai) ||
            nilai <= 0
        ) {
            $input.trigger("focus");
            throw new Error(
                "Semua ukuran harus diisi dengan angka lebih dari 0."
            );
        }

        return nilai;
    }

    // Menghitung volume dan luas permukaan
    function hitungBangunRuang(jenis) {
        const pi = Math.PI;
        let volume;
        let luas;
        const nama = shapes[jenis].name;

        switch (jenis) {
            case "kubus": {
                const s = ambilNilai("sisi");
                volume = s ** 3;
                luas = 6 * s ** 2;
                break;
            }

            case "balok": {
                const p = ambilNilai("panjang");
                const l = ambilNilai("lebar");
                const t = ambilNilai("tinggi");
                volume = p * l * t;
                luas = 2 * (p * l + p * t + l * t);
                break;
            }

            case "tabung": {
                const r = ambilNilai("jari");
                const t = ambilNilai("tinggi");
                volume = pi * r ** 2 * t;
                luas = 2 * pi * r * (r + t);
                break;
            }

            case "kerucut": {
                const r = ambilNilai("jari");
                const t = ambilNilai("tinggi");
                const garisPelukis = Math.sqrt(r ** 2 + t ** 2);
                volume = pi * r ** 2 * t / 3;
                luas = pi * r * (r + garisPelukis);
                break;
            }

            case "bola": {
                const r = ambilNilai("jari");
                volume = 4 / 3 * pi * r ** 3;
                luas = 4 * pi * r ** 2;
                break;
            }

            case "limas": {
                const s = ambilNilai("sisi");
                const t = ambilNilai("tinggi");
                const tinggiSisi = Math.sqrt(t ** 2 + (s / 2) ** 2);
                volume = s ** 2 * t / 3;
                luas = s ** 2 + 2 * s * tinggiSisi;
                break;
            }

            case "prisma": {
                const a = ambilNilai("alas");
                const b = ambilNilai("tinggiSegitiga");
                const p = ambilNilai("panjangPrisma");
                const sisiMiring = Math.sqrt(a ** 2 + b ** 2);
                const luasAlas = a * b / 2;
                volume = luasAlas * p;
                luas = 2 * luasAlas + (a + b + sisiMiring) * p;
                break;
            }

            case "limasSegitiga": {
                const s = ambilNilai("sisi");
                const t = ambilNilai("tinggi");
                const luasAlas = Math.sqrt(3) / 4 * s ** 2;
                const jarakPusat = s * Math.sqrt(3) / 6;
                const tinggiSisi = Math.sqrt(t ** 2 + jarakPusat ** 2);
                volume = luasAlas * t / 3;
                luas = luasAlas + 3 * (s * tinggiSisi / 2);
                break;
            }

            default:
                throw new Error("Bangun ruang tidak dikenali.");
        }

        return { nama, volume, luas };
    }

    // Format angka sesuai bahasa Indonesia
    function formatAngka(nilai) {
        return nilai.toLocaleString("id-ID", {
            maximumFractionDigits: 4
        });
    }

    // Event submit menggunakan jQuery
    $calculatorForm.on("submit", function (event) {
        event.preventDefault();

        try {
            const hasil = hitungBangunRuang($shapeSelect.val());
            const volume = formatAngka(hasil.volume);
            const luas = formatAngka(hasil.luas);

            const pesan = `
                <div class="hasil-kalkulasi">
                    <h3>Hasil Perhitungan</h3>
                    <p><strong>Bangun Ruang:</strong> ${hasil.nama}</p>
                    <p><strong>Volume:</strong> ${volume} cm³</p>
                    <p><strong>Luas Permukaan:</strong> ${luas} cm²</p>
                </div>
            `;

            $result
                .stop(true, true)
                .hide()
                .html(pesan)
                .slideDown(600);

        } catch (error) {
            alert(error.message);
        }
    });

    // Event perubahan pilihan bangun ruang
    $shapeSelect.on("change", tampilkanInput);

    // Validasi input secara langsung
    $inputFields.on("input", 'input[type="number"]', function () {
        const nilai = Number($(this).val());

        if ($(this).val() !== "" && nilai > 0) {
            $(this).removeClass("input-error");
        } else {
            $(this).addClass("input-error");
        }
    });

    // Inisialisasi halaman
    $result.hide();
    tampilkanInput();

    console.log("Kalkulator bangun ruang dengan jQuery siap digunakan.");
});
