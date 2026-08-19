/* ==========================================================================
    ObraGourmet - Rediseño JS (Lógica Simplificada y Feedback Visual)
   ========================================================================== */

// --- INITIAL SEED DATA ---
const DEFAULT_STATE = {
  currentUser: null,
  users: [
    { id: 'usr_admin', email: 'admin@restaurante.com', password: 'admin123', name: 'Administrador Obra', role: 'admin', type: 'admin', initials: 'AD' },
    { id: 'usr_jefe_1', email: 'jefe.obra@bolivar.com', password: 'obra123', name: 'Construcción Bolívar', representative: 'Carlos Restrepo', role: 'jefe_obra', type: 'empresa', initials: 'CB', phone: '310 456 7890' },
    { id: 'usr_jefe_2', email: 'jefe.vial@consorcio.com', password: 'obra123', name: 'Consorcio Vial 2026', representative: 'María Gómez', role: 'jefe_obra', type: 'empresa', initials: 'CV', phone: '315 888 9900' },
    { id: 'usr_indep_1', email: 'pedro.independiente@gmail.com', password: 'cliente123', name: 'Pedro Pérez (Carpintero)', representative: 'Cuenta Propia', role: 'independiente', type: 'independiente', initials: 'PP', phone: '301 222 3344' },
    { id: 'usr_indep_2', email: 'juan.fierrero@gmail.com', password: 'cliente123', name: 'Juan Delgado (Fierrero)', representative: 'Cuenta Propia', role: 'independiente', type: 'independiente', initials: 'JD', phone: '302 555 4411' }
  ],
  inventory: [
    { id: 'ins_1', code: 'INS-01', name: 'Arroz Roa', category: 'Granos y Harinas', stock: 45, minStock: 20, unit: 'Kg' },
    { id: 'ins_2', code: 'INS-02', name: 'Carne de Res', category: 'Proteínas', stock: 12, minStock: 25, unit: 'Kg' },
    { id: 'ins_3', code: 'INS-03', name: 'Pollo Entero', category: 'Proteínas', stock: 38, minStock: 30, unit: 'Kg' },
    { id: 'ins_4', code: 'INS-04', name: 'Aceite Vegetal', category: 'Granos y Harinas', stock: 3, minStock: 8, unit: 'Bidones' },
    { id: 'ins_5', code: 'INS-05', name: 'Gaseosa Postobón', category: 'Bebidas', stock: 8, minStock: 15, unit: 'Botellas' },
    { id: 'ins_6', code: 'INS-06', name: 'Empaques de Icopor', category: 'Desechables', stock: 180, minStock: 100, unit: 'Unidades' }
  ],
  dishes: [
    { id: 'dish_1', name: 'Desayuno Tradicional', type: 'desayuno', price: 10000, description: 'Arepa, huevos, carne, chocolate.' },
    { id: 'dish_2', name: 'Almuerzo Ejecutivo', type: 'almuerzo', price: 14000, description: 'Sopa, seco con proteína, ensalada y jugo.' },
    { id: 'dish_3', name: 'Cena para Turno', type: 'cena', price: 12000, description: 'Plato fuerte reconfortante.' },
    { id: 'dish_4', name: 'Gaseosa 1.5L', type: 'extra', price: 6000, description: 'Bebida familiar.' },
    { id: 'dish_5', name: 'Porción Carne Extra', type: 'extra', price: 5000, description: 'Proteína adicional.' }
  ],
  deliveries: [
    { id: 'del_1', date: '2026-08-10', clientId: 'usr_jefe_1', clientName: 'Construcción Bolívar', mealType: 'Desayuno', qty: 25, unitPrice: 10000, extraItem: 'Gaseosa 1.5L', extraQty: 4, extraPrice: 6000, total: 274000, status: 'pendiente' },
    { id: 'del_2', date: '2026-08-10', clientId: 'usr_jefe_1', clientName: 'Construcción Bolívar', mealType: 'Almuerzo', qty: 28, unitPrice: 14000, extraItem: 'Porción Carne Extra', extraQty: 6, extraPrice: 5000, total: 422000, status: 'pendiente' },
    { id: 'del_3', date: '2026-08-05', clientId: 'usr_indep_2', clientName: 'Juan Delgado (Fierrero)', mealType: 'Almuerzo', qty: 1, unitPrice: 14000, extraItem: '', extraQty: 0, extraPrice: 0, total: 14000, status: 'pagado', paymentMethod: 'Efectivo', payDate: '2026-08-05' }
  ],
  payments: []
};

let state = {};

// --- STATE MANAGEMENT ---
function loadState() {
  const saved = localStorage.getItem('obragourmet_state_v2');
  if (saved) {
    try { state = JSON.parse(saved); } catch (e) { state = JSON.parse(JSON.stringify(DEFAULT_STATE)); }
  } else {
    state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    saveState();
  }
}

function saveState() {
  localStorage.setItem('obragourmet_state_v2', JSON.stringify(state));
}

// --- INIT ---
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  initDateInputs();
  bindFormEvents();

  if (state.currentUser) {
    showMainApp();
  } else {
    showLoginScreen();
  }
});

function initDateInputs() {
  const today = new Date().toISOString().split('T')[0];
  const dispatchDate = document.getElementById('dispatch-date');
  const clientOrderDate = document.getElementById('client-order-date');
  if (dispatchDate) dispatchDate.value = today;
  if (clientOrderDate) clientOrderDate.value = today;
}

// --- VISUAL FEEDBACK (WHATSAPP STYLE) ---
function showGiantSuccess(message) {
  const overlay = document.getElementById('success-overlay');
  const textEl = document.getElementById('success-text');
  if (overlay && textEl) {
    textEl.textContent = message;
    overlay.classList.add('active');
    setTimeout(() => {
      overlay.classList.remove('active');
    }, 2000); // Muestra el check verde por 2 segundos
  }
}

function showError(message) {
  alert("❌ Error: " + message);
}

// --- FORMS & BINDINGS ---
function bindFormEvents() {
  // Login
  document.getElementById('login-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const user = state.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    
    if (user) {
      state.currentUser = user;
      saveState();
      showGiantSuccess(`¡Bienvenido!`);
      setTimeout(() => showMainApp(), 800);
    } else {
      showError('Usuario o contraseña incorrectos');
    }
  });

  // Stock
  document.getElementById('stock-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const insumoId = document.getElementById('stock-insumo-id').value;
    const newQty = parseInt(document.getElementById('stock-insumo-qty').value, 10);
    const insumo = state.inventory.find(i => i.id === insumoId);
    if (insumo) {
      insumo.stock = newQty;
      saveState();
      closeModal('stock-modal');
      renderInventory();
      showGiantSuccess('¡Cantidad Guardada!');
    }
  });

  // Pago
  document.getElementById('payment-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const clientId = document.getElementById('pay-client-id').value;
    const method = document.getElementById('pay-method').value;
    processPaymentForClient(clientId, method);
    closeModal('payment-modal');
  });

  // Despacho
  document.getElementById('dispatch-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    processNewDispatch();
  });

  // Nuevo Insumo
  document.getElementById('insumo-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('ins-name').value;
    const category = document.getElementById('ins-category').value;
    const stock = parseInt(document.getElementById('ins-stock').value, 10);
    const minStock = parseInt(document.getElementById('ins-min').value, 10);
    const unit = document.getElementById('ins-unit').value;

    state.inventory.push({
      id: 'ins_' + Date.now(),
      code: 'INS-' + (state.inventory.length + 1).toString().padStart(2, '0'),
      name, category, stock, minStock, unit
    });
    saveState();
    closeModal('insumo-modal');
    e.target.reset();
    renderInventory();
    showGiantSuccess('¡Insumo Guardado!');
  });

  // Nuevo Plato
  document.getElementById('dish-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('dish-name').value;
    const type = document.getElementById('dish-type').value;
    const price = parseInt(document.getElementById('dish-price').value, 10);
    const description = document.getElementById('dish-desc').value;

    state.dishes.push({
      id: 'dish_' + Date.now(),
      name, type, price, description
    });
    saveState();
    closeModal('dish-modal');
    e.target.reset();
    renderMenuDishes();
    showGiantSuccess('¡Plato Guardado!');
  });
}

function quickLogin(roleType) {
  const targetUser = state.users.find(u => u.role === roleType);
  if (targetUser) {
    state.currentUser = targetUser;
    saveState();
    showMainApp();
  }
}

function logout() {
  state.currentUser = null;
  saveState();
  showLoginScreen();
}

function showLoginScreen() {
  document.getElementById('login-view').style.display = 'flex';
  document.getElementById('main-app').style.display = 'none';
}

function showMainApp() {
  document.getElementById('login-view').style.display = 'none';
  document.getElementById('main-app').style.display = 'block';

  const user = state.currentUser;
  document.getElementById('nav-user-initials').textContent = user.initials || 'US';
  document.getElementById('nav-user-name').textContent = user.name;
  
  if (user.role === 'admin') {
    document.getElementById('nav-user-role').textContent = 'Administrador';
    document.getElementById('admin-home-menu').style.display = 'grid';
    document.getElementById('client-home-menu').style.display = 'none';
    populateClientSelectOptions();
  } else {
    document.getElementById('nav-user-role').textContent = user.type === 'empresa' ? 'Jefe Obra' : 'Independiente';
    document.getElementById('admin-home-menu').style.display = 'none';
    document.getElementById('client-home-menu').style.display = 'grid';
  }
  
  goHome();
}

// --- NAVIGATION LOGIC ---
function goHome() {
  const views = document.querySelectorAll('.view-section');
  views.forEach(v => v.classList.remove('active'));
  document.getElementById('view-home').classList.add('active');
}

function switchView(viewName) {
  const views = document.querySelectorAll('.view-section');
  views.forEach(v => v.classList.remove('active'));
  
  const target = document.getElementById(`view-${viewName}`);
  if (target) target.classList.add('active');

  if (viewName === 'inventory') renderInventory();
  if (viewName === 'accounts') renderAccounts();
  if (viewName === 'reports') generateReport();
  if (viewName === 'menu') renderMenuDishes();
  if (viewName === 'client-order') renderClientOrderView();
  if (viewName === 'client-balance') renderClientBalanceView();
}

// --- INVENTORY ---
let currentInventoryFilter = 'all';
function filterInventory(category) {
  currentInventoryFilter = category;
  const buttons = document.querySelectorAll('#inventory-category-tabs .filter-tab-btn');
  buttons.forEach(btn => btn.classList.toggle('active', btn.getAttribute('onclick')?.includes(category)));
  renderInventory();
}

function renderInventory() {
  const tbody = document.getElementById('inventory-table-body');
  if(!tbody) return;
  tbody.innerHTML = '';
  let list = state.inventory;
  if (currentInventoryFilter !== 'all') list = list.filter(i => i.category === currentInventoryFilter);

  list.forEach(item => {
    const isCritical = item.stock <= item.minStock;
    const badge = isCritical ? 
      `<span class="badge badge-danger">¡Pedir Más!</span>` : 
      `<span class="badge badge-success">Bien</span>`;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${item.name}</strong></td>
      <td>${item.category}</td>
      <td style="font-size: 1.2rem; font-weight: 900; color: ${isCritical ? 'var(--accent-red)' : 'var(--text-main)'};">${item.stock} ${item.unit}</td>
      <td style="color: var(--text-muted);">${item.minStock} ${item.unit}</td>
      <td>${badge}</td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="openStockModal('${item.id}')">
          <i class="ri-edit-2-fill"></i> Cambiar Cantidad
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function openStockModal(insumoId) {
  const insumo = state.inventory.find(i => i.id === insumoId);
  if (insumo) {
    document.getElementById('stock-insumo-id').value = insumo.id;
    document.getElementById('stock-insumo-name').value = insumo.name;
    document.getElementById('stock-insumo-qty').value = insumo.stock;
    openModal('stock-modal');
  }
}
function openNewInsumoModal() {
  document.getElementById('insumo-form').reset();
  openModal('insumo-modal');
}

// --- ACCOUNTS ---
let currentAccountTab = 'empresa';
function filterAccountsTab(type) {
  currentAccountTab = type;
  document.getElementById('tab-btn-empresas').classList.toggle('active', type === 'empresa');
  document.getElementById('tab-btn-independientes').classList.toggle('active', type === 'independiente');
  renderAccounts();
}

function renderAccounts() {
  const tbody = document.getElementById('accounts-table-body');
  if(!tbody) return;
  tbody.innerHTML = '';

  state.users.filter(u => u.type === currentAccountTab).forEach(client => {
    const pending = state.deliveries.filter(d => d.clientId === client.id && d.status === 'pendiente');
    const owedTotal = pending.reduce((sum, d) => sum + d.total, 0);
    const meals = pending.reduce((sum, d) => sum + d.qty, 0);

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${client.name}</strong></td>
      <td>${meals} Platos</td>
      <td style="font-size: 1.2rem; font-weight: 900; color: ${owedTotal > 0 ? 'var(--accent-red)' : 'var(--accent-green)'};">$${owedTotal.toLocaleString()}</td>
      <td>${owedTotal > 0 ? `<span class="badge badge-warning">Debe</span>` : `<span class="badge badge-success">Pagado</span>`}</td>
      <td>
        ${owedTotal > 0 ? 
          `<button class="btn btn-success btn-sm" onclick="openPaymentModal('${client.id}')">Cobrar Plata</button>` : 
          `-`}
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function openPaymentModal(clientId) {
  const client = state.users.find(u => u.id === clientId);
  if (!client) return;
  const owedTotal = state.deliveries.filter(d => d.clientId === clientId && d.status === 'pendiente').reduce((sum, d) => sum + d.total, 0);

  document.getElementById('pay-client-id').value = client.id;
  document.getElementById('pay-client-name').value = client.name;
  document.getElementById('pay-total-amount').value = `$${owedTotal.toLocaleString()}`;
  openModal('payment-modal');
}

function processPaymentForClient(clientId, method) {
  const pending = state.deliveries.filter(d => d.clientId === clientId && d.status === 'pendiente');
  if (pending.length === 0) return;

  pending.forEach(d => {
    d.status = 'pagado';
    d.paymentMethod = method;
    d.payDate = new Date().toISOString().split('T')[0];
  });
  saveState();
  renderAccounts();
  if (state.currentUser && state.currentUser.role !== 'admin') {
    renderClientBalanceView();
  }
  showGiantSuccess('¡Pago Registrado!');
}

// --- DISPATCH ---
function populateClientSelectOptions() {
  const select = document.getElementById('dispatch-client');
  if (!select) return;
  select.innerHTML = '';
  state.users.filter(u => u.role !== 'admin').forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = c.name;
    select.appendChild(opt);
  });
}

function processNewDispatch() {
  const dateStr = document.getElementById('dispatch-date').value;
  const clientId = document.getElementById('dispatch-client').value;
  const mealType = document.getElementById('dispatch-meal-type').value;
  const qty = parseInt(document.getElementById('dispatch-qty').value, 10);
  const extraItem = document.getElementById('dispatch-extra-item').value;
  const extraQty = parseInt(document.getElementById('dispatch-extra-qty').value, 10) || 0;

  if (new Date(dateStr + 'T00:00:00').getDay() === 0) {
    showError('No se entregan comidas los domingos.');
    return;
  }

  const client = state.users.find(u => u.id === clientId);
  if (!client) return;

  let mealPrice = 14000;
  if (mealType === 'Desayuno') mealPrice = 10000;
  if (mealType === 'Cena') mealPrice = 12000;

  let extraUnitPrice = 0;
  if (extraItem === 'Gaseosa 1.5L') extraUnitPrice = 6000;
  if (extraItem === 'Jugos Naturales') extraUnitPrice = 3500;
  if (extraItem === 'Postre Casero') extraUnitPrice = 4000;
  if (extraItem === 'Porción Carne Extra') extraUnitPrice = 5000;

  const total = (qty * mealPrice) + (extraQty * extraUnitPrice);

  state.deliveries.push({
    id: 'del_' + Date.now(),
    date: dateStr,
    clientId: client.id,
    clientName: client.name,
    mealType, qty, unitPrice: mealPrice,
    extraItem: extraQty > 0 ? extraItem : '',
    extraQty, extraPrice: extraUnitPrice,
    total, status: 'pendiente'
  });

  saveState();
  document.getElementById('dispatch-form').reset();
  document.getElementById('dispatch-date').value = dateStr; // keep date
  
  showGiantSuccess('¡Comida Entregada!');
  setTimeout(() => goHome(), 1000);
}

// --- REPORTS ---
function generateReport() {
  const filterSelect = document.getElementById('report-filter-client');
  if (filterSelect && filterSelect.options.length <= 1) {
    state.users.filter(u => u.role !== 'admin').forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = c.name;
      filterSelect.appendChild(opt);
    });
  }

  const clientFilter = filterSelect?.value || 'all';
  let filtered = state.deliveries;
  if (clientFilter !== 'all') filtered = filtered.filter(d => d.clientId === clientFilter);

  const totalOwed = filtered.filter(d => d.status === 'pendiente').reduce((sum, d) => sum + d.total, 0);
  const totalPaid = filtered.filter(d => d.status === 'pagado').reduce((sum, d) => sum + d.total, 0);

  document.getElementById('rep-summary-total-owed').textContent = `$${totalOwed.toLocaleString()}`;
  document.getElementById('rep-summary-total-paid').textContent = `$${totalPaid.toLocaleString()}`;

  const tbody = document.getElementById('report-details-body');
  if(!tbody) return;
  tbody.innerHTML = '';

  const clients = clientFilter === 'all' ? state.users.filter(u => u.role !== 'admin') : state.users.filter(u => u.id === clientFilter);
  
  clients.forEach(c => {
    const cDelivs = state.deliveries.filter(d => d.clientId === c.id);
    if (cDelivs.length === 0) return;

    const des = cDelivs.filter(d => d.mealType === 'Desayuno').reduce((sum, d) => sum + d.qty, 0);
    const alm = cDelivs.filter(d => d.mealType === 'Almuerzo').reduce((sum, d) => sum + d.qty, 0);
    const cen = cDelivs.filter(d => d.mealType === 'Cena').reduce((sum, d) => sum + d.qty, 0);
    const total = cDelivs.reduce((sum, d) => sum + d.total, 0);
    const pend = cDelivs.filter(d => d.status === 'pendiente').reduce((sum, d) => sum + d.total, 0);

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${c.name}</strong></td>
      <td>${des}</td>
      <td>${alm}</td>
      <td>${cen}</td>
      <td style="font-weight: 800;">$${total.toLocaleString()}</td>
      <td>${pend > 0 ? `<span class="badge badge-danger">Debe $${pend.toLocaleString()}</span>` : `<span class="badge badge-success">Al Día</span>`}</td>
    `;
    tbody.appendChild(tr);
  });
}

// --- MENU ---
function renderMenuDishes() {
  const container = document.getElementById('admin-dishes-grid');
  if(!container) return;
  container.innerHTML = '';
  state.dishes.forEach(dish => {
    const card = document.createElement('div');
    card.className = 'glass-card dish-card';
    card.innerHTML = `
      <div>
        <div class="dish-header"><span class="dish-type-tag type-${dish.type}">${dish.type}</span></div>
        <h4 class="dish-title">${dish.name}</h4>
        <p class="dish-desc">${dish.description}</p>
      </div>
      <div class="dish-footer">
        <span class="dish-price">$${dish.price.toLocaleString()}</span>
        <button class="btn btn-secondary btn-sm" onclick="deleteDish('${dish.id}')"><i class="ri-delete-bin-fill"></i> Borrar</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function openNewDishModal() {
  document.getElementById('dish-form').reset();
  openModal('dish-modal');
}

function deleteDish(dishId) {
  if (confirm('¿Borrar este plato?')) {
    state.dishes = state.dishes.filter(d => d.id !== dishId);
    saveState();
    renderMenuDishes();
    showGiantSuccess('¡Plato Borrado!');
  }
}

// --- CLIENT ORDER ---
let clientCart = {};
function renderClientOrderView() {
  const grid = document.getElementById('client-dishes-grid');
  if(!grid) return;
  grid.innerHTML = '';

  state.dishes.forEach(dish => {
    const qty = clientCart[dish.id] || 0;
    const card = document.createElement('div');
    card.className = 'glass-card dish-card';
    card.innerHTML = `
      <div>
        <h4 class="dish-title">${dish.name}</h4>
        <p class="dish-desc">${dish.description}</p>
      </div>
      <div class="dish-footer">
        <span class="dish-price">$${dish.price.toLocaleString()}</span>
        <div class="qty-control">
          <button class="qty-btn" onclick="updateCartItem('${dish.id}', -1)">-</button>
          <span class="qty-val" id="qty-val-${dish.id}">${qty}</span>
          <button class="qty-btn" onclick="updateCartItem('${dish.id}', 1)">+</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
  updateClientOrderSummary();
}

function updateCartItem(dishId, change) {
  clientCart[dishId] = Math.max(0, (clientCart[dishId] || 0) + change);
  const qtyEl = document.getElementById(`qty-val-${dishId}`);
  if (qtyEl) qtyEl.textContent = clientCart[dishId];
  updateClientOrderSummary();
}

function updateClientOrderSummary() {
  const listEl = document.getElementById('client-order-items-list');
  if(!listEl) return;
  listEl.innerHTML = '';
  let totalCost = 0;

  Object.keys(clientCart).forEach(id => {
    if (clientCart[id] > 0) {
      const dish = state.dishes.find(d => d.id === id);
      if (dish) {
        const cost = dish.price * clientCart[id];
        totalCost += cost;
        const div = document.createElement('div');
        div.className = 'summary-row';
        div.innerHTML = `<span>${dish.name} (x${clientCart[id]})</span><strong>$${cost.toLocaleString()}</strong>`;
        listEl.appendChild(div);
      }
    }
  });
  document.getElementById('client-order-total-price').textContent = `$${totalCost.toLocaleString()}`;
}

function submitClientOrder() {
  const dateStr = document.getElementById('client-order-date').value;
  if (new Date(dateStr + 'T00:00:00').getDay() === 0) {
    showError('No trabajamos los domingos.');
    return;
  }
  
  let hasItems = false;
  Object.keys(clientCart).forEach(id => {
    if (clientCart[id] > 0) {
      hasItems = true;
      const dish = state.dishes.find(d => d.id === id);
      const isExtra = dish.type === 'extra';
      
      state.deliveries.push({
        id: 'del_' + Date.now() + Math.random().toString(36).substring(7),
        date: dateStr,
        clientId: state.currentUser.id,
        clientName: state.currentUser.name,
        mealType: isExtra ? 'Almuerzo' : (dish.type === 'desayuno' ? 'Desayuno' : (dish.type === 'cena' ? 'Cena' : 'Almuerzo')),
        qty: isExtra ? 0 : clientCart[id],
        unitPrice: dish.price,
        extraItem: isExtra ? dish.name : '',
        extraQty: isExtra ? clientCart[id] : 0,
        extraPrice: isExtra ? dish.price : 0,
        total: dish.price * clientCart[id],
        status: 'pendiente'
      });
    }
  });

  if (!hasItems) {
    showError('Debes seleccionar al menos un plato.');
    return;
  }

  saveState();
  clientCart = {};
  renderClientOrderView();
  showGiantSuccess('¡Pedido Enviado!');
  setTimeout(() => goHome(), 1000);
}

// --- CLIENT BALANCE ---
function renderClientBalanceView() {
  const user = state.currentUser;
  if (!user) return;

  const pending = state.deliveries.filter(d => d.clientId === user.id && d.status === 'pendiente');
  const totalOwed = pending.reduce((sum, d) => sum + d.total, 0);
  const totalMeals = pending.reduce((sum, d) => sum + d.qty, 0);

  document.getElementById('client-current-balance').textContent = `$${totalOwed.toLocaleString()}`;
  document.getElementById('client-stat-meals').textContent = `${totalMeals} platos`;

  const badge = document.getElementById('client-balance-status');
  if (totalOwed === 0) {
    badge.textContent = 'Todo Pagado';
    badge.className = 'badge badge-success';
  } else {
    badge.textContent = 'Pago Pendiente';
    badge.className = 'badge badge-warning';
  }
}

function openPaymentModalForCurrentClient() {
  if (state.currentUser) openPaymentModal(state.currentUser.id);
}

// --- MODALS ---
function openModal(modalId) {
  const m = document.getElementById(modalId);
  if (m) m.classList.add('active');
}
function closeModal(modalId) {
  const m = document.getElementById(modalId);
  if (m) m.classList.remove('active');
}
