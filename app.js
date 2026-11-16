// SIT Canteen - interactive order cart
// 1. Application state: quantity per item name
const cart = {};          // { "Poha": {price: 30, qty: 2}, ... }

// 2. References to HTML elements
const itemCountEl = document.getElementById("itemCount");
const totalPriceEl = document.getElementById("totalPrice");
const orderBar = document.getElementById("orderBar");
const modal = document.getElementById("orderModal");
const orderList = document.getElementById("orderList");
const modalTotal = document.getElementById("modalTotal");

// 3. Functions
function getTotals() {
  let items = 0, total = 0;
  for (const name in cart) {
    items += cart[name].qty;
    total += cart[name].qty * cart[name].price;
  }
  return { items, total };
}

function updateDisplay() {
  const { items, total } = getTotals();
  itemCountEl.textContent = items;
  totalPriceEl.textContent = "₹" + total;
  orderBar.classList.toggle("active", items > 0);
}

function changeQty(name, price, delta, qtyEl) {
  const current = cart[name] ? cart[name].qty : 0;
  const next = Math.max(0, current + delta);
  console.log(`${name}: before = ${current}, after = ${next}`);
  if (next === 0) {
    delete cart[name];
  } else {
    cart[name] = { price: price, qty: next };
  }
  qtyEl.textContent = next;
  updateDisplay();
}

function resetCart() {
  console.log("Resetting order");
  for (const name in cart) delete cart[name];
  document.querySelectorAll(".qty").forEach(q => (q.textContent = 0));
  updateDisplay();
}

function showOrder() {
  orderList.innerHTML = "";
  const names = Object.keys(cart);
  if (names.length === 0) {
    orderList.innerHTML = "<li>No items selected yet.</li>";
  }
  names.forEach(name => {
    const li = document.createElement("li");
    li.textContent = `${name} × ${cart[name].qty} = ₹${cart[name].qty * cart[name].price}`;
    orderList.appendChild(li);
  });
  modalTotal.textContent = "₹" + getTotals().total;
  modal.hidden = false;
}

function placeOrder() {
  const { items, total } = getTotals();
  if (items === 0) {
    console.warn("Place order clicked with empty cart");
    alert("Please add at least one item first.");
    return;
  }
  console.log("Order placed:", JSON.parse(JSON.stringify(cart)), "Total:", total);
  showOrder();
  document.querySelector("#orderModal h2").textContent = "Order Placed ✅";
}

// 4. Add +/- controls to every menu item (reads name & price from the HTML)
document.querySelectorAll(".menu-item").forEach(card => {
  const name = card.querySelector("h3").textContent.trim();
  const price = parseInt(card.querySelector(".price").textContent.replace(/[^\d]/g, ""), 10);

  const ctrl = document.createElement("div");
  ctrl.className = "qty-control";
  ctrl.innerHTML = '<button class="minus" aria-label="Remove one">−</button>' +
                   '<span class="qty">0</span>' +
                   '<button class="plus" aria-label="Add one">+</button>';
  card.appendChild(ctrl);

  const qtyEl = ctrl.querySelector(".qty");
  ctrl.querySelector(".plus").addEventListener("click", () => changeQty(name, price, 1, qtyEl));
  ctrl.querySelector(".minus").addEventListener("click", () => changeQty(name, price, -1, qtyEl));
});

// 5. Attach event listeners to order bar buttons
document.getElementById("resetBtn").addEventListener("click", resetCart);
document.getElementById("placeBtn").addEventListener("click", placeOrder);
document.getElementById("viewBtn").addEventListener("click", () => {
  document.querySelector("#orderModal h2").textContent = "Your Order";
  showOrder();
});
document.getElementById("closeBtn").addEventListener("click", () => (modal.hidden = true));

// Initial display
updateDisplay();
