const TICKET_PRICE = 85000;
const VIP_PRICE = 120000;
const VIP_ROWS = ["F", "G"];

const bookedSeats = [
    "A3", "A4", "B5", "B6", "C2", "D7", "D8",
    "E1", "E9", "F4", "F5", "G3", "H6", "H7"
];

let selectedSeats = [];

function initSeatMap() {
    const seatMap = document.getElementById("seatMap");
    if (!seatMap) return;

    const rows = "ABCDEFGH";
    seatMap.innerHTML = "";

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const rowEl = document.createElement("div");
        rowEl.className = "seat-row";

        const label = document.createElement("span");
        label.className = "row-label";
        label.textContent = row;
        rowEl.appendChild(label);

        const group = document.createElement("div");
        group.className = "seats-group";

        for (let col = 1; col <= 10; col++) {
            if (col === 6) {
                const gap = document.createElement("div");
                gap.className = "seat-gap";
                group.appendChild(gap);
            }

            const seatId = row + col;
            const seat = document.createElement("button");
            seat.className = "seat";
            seat.dataset.seat = seatId;
            seat.setAttribute("aria-label", `Ghế ${seatId}`);

            if (VIP_ROWS.includes(row)) {
                seat.classList.add("vip");
            }

            if (bookedSeats.includes(seatId)) {
                seat.classList.add("booked");
                seat.disabled = true;
            }

            seat.addEventListener("click", () => toggleSeat(seatId, seat));
            group.appendChild(seat);
        }

        rowEl.appendChild(group);

        const labelRight = document.createElement("span");
        labelRight.className = "row-label";
        labelRight.textContent = row;
        rowEl.appendChild(labelRight);

        seatMap.appendChild(rowEl);
    }
}

function toggleSeat(seatId, seatEl) {
    const index = selectedSeats.indexOf(seatId);

    if (index > -1) {
        selectedSeats.splice(index, 1);
        seatEl.classList.remove("selected");
    } else {
        if (selectedSeats.length >= 8) {
            alert("Bạn chỉ có thể chọn tối đa 8 ghế!");
            return;
        }
        selectedSeats.push(seatId);
        seatEl.classList.add("selected");
    }

    updateSummary();
}

function getSeatPrice(seatId) {
    const row = seatId.charAt(0);
    return VIP_ROWS.includes(row) ? VIP_PRICE : TICKET_PRICE;
}

function updateSummary() {
    const seatsList = document.getElementById("selectedSeats");
    const seatCount = document.getElementById("seatCount");
    const totalPrice = document.getElementById("totalPrice");
    const confirmBtn = document.getElementById("confirmBtn");

    if (!seatsList) return;

    if (selectedSeats.length === 0) {
        seatsList.innerHTML = '<span style="color: var(--text-muted)">Chưa chọn ghế nào</span>';
    } else {
        seatsList.innerHTML = selectedSeats
            .sort()
            .map(s => `<span class="seat-chip">${s}</span>`)
            .join("");
    }

    const total = selectedSeats.reduce((sum, s) => sum + getSeatPrice(s), 0);

    if (seatCount) seatCount.textContent = selectedSeats.length;
    if (totalPrice) totalPrice.textContent = formatPrice(total);
    if (confirmBtn) confirmBtn.disabled = selectedSeats.length === 0;
}

function formatPrice(amount) {
    return amount.toLocaleString("vi-VN") + "đ";
}

function generateTicketCode() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
}

function openModal() {
    const name = document.getElementById("customerName")?.value.trim();
    const phone = document.getElementById("customerPhone")?.value.trim();

    if (!name || !phone) {
        alert("Vui lòng nhập đầy đủ họ tên và số điện thoại!");
        return;
    }

    if (selectedSeats.length === 0) {
        alert("Vui lòng chọn ít nhất 1 ghế!");
        return;
    }

    const code = generateTicketCode();
    document.getElementById("ticketCode").textContent = code;

    const total = selectedSeats.reduce((sum, s) => sum + getSeatPrice(s), 0);
    document.getElementById("modalSummary").textContent =
        `${selectedSeats.length} ghế (${selectedSeats.sort().join(", ")}) — ${formatPrice(total)}`;

    document.getElementById("successModal").classList.add("show");
}

function closeModal() {
    document.getElementById("successModal").classList.remove("show");
}

function initShowtimes() {
    document.querySelectorAll(".showtime-tag").forEach(tag => {
        tag.addEventListener("click", () => {
            document.querySelectorAll(".showtime-tag").forEach(t => t.classList.remove("active"));
            tag.classList.add("active");
        });
    });
}

function initDateTabs() {
    document.querySelectorAll(".date-tab").forEach(tab => {
        tab.addEventListener("click", () => {
            document.querySelectorAll(".date-tab").forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initSeatMap();
    updateSummary();
    initShowtimes();
    initDateTabs();

    document.getElementById("confirmBtn")?.addEventListener("click", openModal);
    document.getElementById("closeModal")?.addEventListener("click", closeModal);
    document.getElementById("successModal")?.addEventListener("click", (e) => {
        if (e.target.id === "successModal") closeModal();
    });
});
