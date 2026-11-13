// --- PAGE 1: LOGIN STEPS ---
function goToStep2() {
  const school = document.getElementById('school-select').value;
  localStorage.setItem('qc_school', school);
  document.getElementById('selected-school-badge').innerText = school;
  document.getElementById('step-1').classList.add('hidden');
  document.getElementById('step-2').classList.remove('hidden');
}

function completeLogin() {
  const name = document.getElementById('student-name').value.trim() || "Alex Carter";
  const id = document.getElementById('student-id').value.trim() || "GWA-2948";
  localStorage.setItem('qc_name', name);
  localStorage.setItem('qc_id', id);
  window.location.href = 'menu.html';
}

// --- PAGE 2, 2.5 & 3: DATA HYDRATION ---
let cart = [];

window.addEventListener('DOMContentLoaded', () => {
  const savedName = localStorage.getItem('qc_name') || "User";
  const savedSchool = localStorage.getItem('qc_school') || "GEMS World Academy - Dubai";
  const savedId = localStorage.getItem('qc_id') || "GWA-2948";
  const savedOrder = JSON.parse(localStorage.getItem('qc_order') || '[]');
  const total = localStorage.getItem('qc_total') || '0.00';
  const slot = localStorage.getItem('qc_slot') || 'Lunch Break';

  // Populate Menu Page (menu.html)
  if (document.getElementById('hello-user')) {
    document.getElementById('hello-user').innerText = `Hello, ${savedName.split(' ')[0]}!`;
    document.getElementById('user-school').innerText = savedSchool;
    document.getElementById('header-id-badge').innerText = `ID: ${savedId}`;
  }

  // Populate Payment Page (payment.html)
  if (document.getElementById('pay-student-name')) {
    document.getElementById('pay-school-name').innerText = savedSchool.toUpperCase();
    document.getElementById('pay-student-name').innerText = savedName;
    document.getElementById('pay-student-id').innerText = `ID: ${savedId}`;
    document.getElementById('pay-slot-badge').innerText = slot.split('(')[0].trim();
    document.getElementById('receipt-total').innerText = `AED ${total}`;

    const receiptHTML = savedOrder.length
      ? savedOrder.map(i => `<div class="receipt-row"><span>${i.name}</span><span>AED ${i.price.toFixed(2)}</span></div>`).join('')
      : '<div class="receipt-row"><span>Express Lunch Bundle</span><span>AED 15.00</span></div>';
    document.getElementById('receipt-items').innerHTML = receiptHTML;
  }

  // Populate Pass Page (pass.html)
  if (document.getElementById('pass-student-name')) {
    document.getElementById('pass-student-name').innerText = `${savedName} (${savedId})`;
    document.getElementById('pass-slot').innerText = `${slot} • Est. Wait: < 1 min`;
    
    const itemsHTML = savedOrder.length 
      ? savedOrder.map(i => `• ${i.name} (AED ${i.price})`).join('<br/>') 
      : '• Express Grab & Go Bundle';
    
    document.getElementById('pass-items-list').innerHTML = `<strong>Order Summary (Paid AED ${total}):</strong><br/>${itemsHTML}`;
    document.getElementById('locker-num').innerText = `EXP-0${Math.floor(Math.random() * 9) + 1}`;
  }
});

// --- CART FUNCTIONS ---
function toggleItem(btn, name, price) {
  const index = cart.findIndex(item => item.name === name);
  if (index === -1) {
    cart.push({ name, price });
    btn.innerText = "✓ Added";
    btn.classList.add('added');
  } else {
    cart.splice(index, 1);
    btn.innerText = "+ Add";
    btn.classList.remove('added');
  }
  updateTotal();
}

function selectChip(chip) {
  chip.classList.toggle('selected');
}

function addCustomSandwich(btn) {
  const selected = Array.from(document.querySelectorAll('#sandwich-chips .chip.selected'))
    .map(c => c.innerText)
    .join(', ');
  const label = selected ? `Custom Sandwich (${selected})` : 'Custom Sandwich';
  cart.push({ name: label, price: 14 });
  btn.innerText = "✓ Custom Sandwich Added!";
  btn.classList.add('btn-lime');
  updateTotal();
}

function updateTotal() {
  const sum = cart.reduce((acc, item) => acc + item.price, 0);
  document.getElementById('cart-total').innerText = `AED ${sum.toFixed(2)}`;
}

// Routes from Menu -> Payment Page
function payPreOrder() {
  if (cart.length === 0) {
    alert("Please add at least one item to your pre-order first!");
    return;
  }
  const slot = document.getElementById('pickup-slot').value;
  const total = cart.reduce((acc, item) => acc + item.price, 0).toFixed(2);
  localStorage.setItem('qc_order', JSON.stringify(cart));
  localStorage.setItem('qc_slot', slot);
  localStorage.setItem('qc_total', total);
  window.location.href = 'payment.html';
}

// Routes from Payment Page -> Express Pick-Up Pass
function processStudentIDPayment() {
  const btn = document.getElementById('confirm-pay-btn');
  btn.innerText = "✓ Verifying Student ID...";
  btn.style.backgroundColor = "#0F3D2E";
  btn.style.color = "#8CC63F";
  
  setTimeout(() => {
    window.location.href = 'pass.html';
  }, 800);
}

// Clears completed order and returns to the menu homepage
function returnToMenu() {
  localStorage.removeItem('qc_order');
  localStorage.removeItem('qc_total');
  window.location.href = 'menu.html';
}