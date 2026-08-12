/* ==========================================================================
   ObraGourmet - Sistema de Gestión de Restaurante para Obras de Construcción
   Lógica JavaScript (Autenticación, Inventario, Despachos, Cuentas y Reportes)
   ========================================================================== */

// --- INITIAL SEED DATA ---
const DEFAULT_STATE = {
  currentUser: null,
  
  // Users Data (Admin, Jefes de Obra Empresas y Trabajadores Independientes)
  users: [
    {
      id: 'usr_admin',
      email: 'admin@restaurante.com',
      password: 'admin123',
      name: 'Restaurante ObraGourmet',
      role: 'admin',
      type: 'admin',
      initials: 'AD'
    },
    {
      id: 'usr_jefe_1',
      email: 'jefe.obra@bolivar.com',
      password: 'obra123',
      name: 'Constructora Bolívar - Torres del Norte',
      representative: 'Ing. Carlos Restrepo (Jefe de Obra)',
      role: 'jefe_obra',
      type: 'empresa',
      initials: 'CB',
      phone: '310 456 7890'
    },
    {
      id: 'usr_jefe_2',
      email: 'jefe.vial@consorcio.com',
      password: 'obra123',
      name: 'Consorcio Vial 2026 - Tramo 4',
      representative: 'Ing. María Gómez',
      role: 'jefe_obra',
      type: 'empresa',
      initials: 'CV',
      phone: '315 888 9900'
    },
    {
      id: 'usr_indep_1',
      email: 'pedro.independiente@gmail.com',
      password: 'cliente123',
      name: 'Pedro Pérez (Carpintero)',
      representative: 'Cuenta Independiente',
      role: 'independiente',
      type: 'independiente',
      initials: 'PP',
      phone: '301 222 3344'
    },
    {
      id: 'usr_indep_2',
      email: 'juan.fierrero@gmail.com',
      password: 'cliente123',
      name: 'Juan Delgado (Fierrero)',
      representative: 'Cuenta Independiente',
      role: 'independiente',
      type: 'independiente',
      initials: 'JD',
      phone: '302 555 4411'
    }
  ],

  // Inventory Products & Raw Insumos
  inventory: [
    { id: 'ins_1', code: 'INS-01', name: 'Arroz Roa Grano Largo', category: 'Granos y Harinas', stock: 45, minStock: 20, unit: 'Kg' },
    { id: 'ins_2', code: 'INS-02', name: 'Carne de Res (Cadera/Lomo)', category: 'Proteínas', stock: 12, minStock: 25, unit: 'Kg' }, // Critical
    { id: 'ins_3', code: 'INS-03', name: 'Pollo Entero Limpio', category: 'Proteínas', stock: 38, minStock: 30, unit: 'Kg' },
    { id: 'ins_4', code: 'INS-04', name: 'Aceite Vegetal 5 Litros', category: 'Granos y Harinas', stock: 3, minStock: 8, unit: 'Bidones' }, // Low stock
    { id: 'ins_5', code: 'INS-05', name: 'Huevos Frescos Tipo AAA', category: 'Proteínas', stock: 15, minStock: 10, unit: 'Cubetas (30u)' },
    { id: 'ins_6', code: 'INS-06', name: 'Plátano Verde y Madurito', category: 'Verduras y Frutas', stock: 50, minStock: 25, unit: 'Kg' },
    { id: 'ins_7', code: 'INS-07', name: 'Gaseosa Postobón 1.5L', category: 'Bebidas', stock: 8, minStock: 15, unit: 'Botellas' }, // Low
    { id: 'ins_8', code: 'INS-08', name: 'Envases Térmicos 3 Comp.', category: 'Desechables', stock: 180, minStock: 100, unit: 'Unidades' },
    { id: 'ins_9', code: 'INS-09', name: 'Papa Pastusa', category: 'Verduras y Frutas', stock: 65, minStock: 30, unit: 'Kg' },
    { id: 'ins_10', code: 'INS-10', name: 'Frijol Rojo Bola Roja', category: 'Granos y Harinas', stock: 22, minStock: 15, unit: 'Kg' }
  ],

  // Menu Dishes
  dishes: [
    {
      id: 'dish_1',
      name: 'Desayuno Obra Tradicional',
      type: 'desayuno',
      price: 10000,
      description: 'Arepa con queso, huevos al gusto, carne desmechada o salchicha, chocolate o café con leche.'
    },
    {
      id: 'dish_2',
      name: 'Almuerzo Ejecutivo de Obra',
      type: 'almuerzo',
      price: 14000,
      description: 'Sopa del día, seco con arroz, tajada, ensalada, proteína (pollo sudado, carne asada o chicharrón) y jugo.'
    },
    {
      id: 'dish_3',
      name: 'Cena para Turno Nocturno',
      type: 'cena',
      price: 12000,
      description: 'Plato fuerte reconfortante con proteína, arroz, papa hervida y bebida caliente.'
    },
    {
      id: 'dish_4',
      name: 'Gaseosa 1.5L Fría',
      type: 'extra',
      price: 6000,
      description: 'Bebida gaseosa familiar para compartir en la obra.'
    },
    {
      id: 'dish_5',
      name: 'Porción Carne o Chicharrón Extra',
      type: 'extra',
      price: 5000,
      description: 'Proteína adicional agregada a la ración.'
    },
    {
      id: 'dish_6',
      name: 'Postre Casero (Arroz con Leche)',
      type: 'extra',
      price: 4000,
      description: 'Porción individual dulce para finalizar la jornada.'
    }
  ],

  // Dispatch Log & Historical Deliveries (Lun-Sáb)
  deliveries: [
    {
      id: 'del_1',
      date: '2026-08-10', // Monday
      clientId: 'usr_jefe_1',
      clientName: 'Constructora Bolívar - Torres del Norte',
      mealType: 'Desayuno',
      qty: 25,
      unitPrice: 10000,
      extraItem: 'Gaseosa 1.5L',
      extraQty: 4,
      extraPrice: 6000,
      total: 274000,
      status: 'pendiente'
    },
    {
      id: 'del_2',
      date: '2026-08-10',
      clientId: 'usr_jefe_1',
      clientName: 'Constructora Bolívar - Torres del Norte',
      mealType: 'Almuerzo',
      qty: 28,
      unitPrice: 14000,
      extraItem: 'Porción Carne Extra',
      extraQty: 6,
      extraPrice: 5000,
      total: 422000,
      status: 'pendiente'
    },
    {
      id: 'del_3',
      date: '2026-08-11', // Tuesday
      clientId: 'usr_jefe_2',
      clientName: 'Consorcio Vial 2026 - Tramo 4',
      mealType: 'Almuerzo',
      qty: 15,
      unitPrice: 14000,
      extraItem: 'Gaseosa 1.5L',
      extraQty: 2,
      extraPrice: 6000,
      total: 222000,
      status: 'pendiente'
    },
    {
      id: 'del_4',
      date: '2026-08-11',
      clientId: 'usr_indep_1',
      clientName: 'Pedro Pérez (Carpintero)',
      mealType: 'Almuerzo',
      qty: 1,
      unitPrice: 14000,
      extraItem: 'Postre Casero',
      extraQty: 1,
      extraPrice: 4000,
      total: 18000,
      status: 'pendiente'
    },
    {
      id: 'del_5',
      date: '2026-08-05', // Previous paid record
      clientId: 'usr_indep_2',
      clientName: 'Juan Delgado (Fierrero)',
      mealType: 'Almuerzo',
      qty: 1,
      unitPrice: 14000,
      extraItem: '',
      extraQty: 0,
      extraPrice: 0,
      total: 14000,
      status: 'pagado',
      paymentMethod: 'Efectivo',
      payDate: '2026-08-05'
    }
  ],

  // Payments History Log
  payments: [
    {
      id: 'pay_1',
      clientId: 'usr_indep_2',
      clientName: 'Juan Delgado (Fierrero)',
      amount: 14000,
      method: 'Efectivo',
      date: '2026-08-05',
      reference: 'Pago en caja al recibir almuerzo'
    }
  ]
};

// Global App State Variable
let state = {};

// --- STATE MANAGEMENT WITH LOCALSTORAGE ---
function loadState() {
  const saved = localStorage.getItem('obragourmet_state_v1');
  if (saved) {
    try {
      state = JSON.parse(saved);
    } catch (e) {
      console.error('Error loading state, restoring defaults:', e);
      state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    }
  } else {
    state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    saveState();
  }
}

function saveState() {
  localStorage.setItem('obragourmet_state_v1', JSON.stringify(state));
}

// --- INITIALIZATION ON DOM READY ---
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

// --- AUTHENTICATION & LOGIN ---
function bindFormEvents() {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;

      const user = state.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      if (user) {
        state.currentUser = user;
        saveState();
        showToast(`¡Bienvenido/a, ${user.name}!`, 'success');
        showMainApp();
      } else {
        showToast('Usuario o contraseña incorrectos', 'error');
      }
    });
  }

  // Stock Form Submit
  const stockForm = document.getElementById('stock-form');
  if (stockForm) {
    stockForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const insumoId = document.getElementById('stock-insumo-id').value;
      const newQty = parseInt(document.getElementById('stock-insumo-qty').value, 10);
      
      const insumo = state.inventory.find(i => i.id === insumoId);
      if (insumo) {
        insumo.stock = newQty;
        saveState();
        closeModal('stock-modal');
        renderInventory();
        renderDashboard();
        showToast(`Stock de "${insumo.name}" actualizado a ${newQty} ${insumo.unit}`, 'success');
      }
    });
  }

  // Payment Form Submit
  const paymentForm = document.getElementById('payment-form');
  if (paymentForm) {
    paymentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const clientId = document.getElementById('pay-client-id').value;
      const method = document.getElementById('pay-method').value;
      const reference = document.getElementById('pay-reference').value;

      processPaymentForClient(clientId, method, reference);
      closeModal('payment-modal');
    });
  }

  // Dispatch Form Submit
  const dispatchForm = document.getElementById('dispatch-form');
  if (dispatchForm) {
    dispatchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      processNewDispatch();
    });
  }

  // New Insumo Form Submit
  const insumoForm = document.getElementById('insumo-form');
  if (insumoForm) {
    insumoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('ins-name').value;
      const category = document.getElementById('ins-category').value;
      const stock = parseInt(document.getElementById('ins-stock').value, 10);
      const minStock = parseInt(document.getElementById('ins-min').value, 10);
      const unit = document.getElementById('ins-unit').value;

      const newInsumo = {
        id: 'ins_' + Date.now(),
        code: 'INS-' + (state.inventory.length + 1).toString().padStart(2, '0'),
        name,
        category,
        stock,
        minStock,
        unit
      };

      state.inventory.push(newInsumo);
      saveState();
      closeModal('insumo-modal');
      insumoForm.reset();
      renderInventory();
      renderDashboard();
      showToast(`Insumo "${name}" agregado exitosamente`, 'success');
    });
  }

  // New Dish Form Submit
  const dishForm = document.getElementById('dish-form');
  if (dishForm) {
    dishForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('dish-name').value;
      const type = document.getElementById('dish-type').value;
      const price = parseInt(document.getElementById('dish-price').value, 10);
      const description = document.getElementById('dish-desc').value;

      const newDish = {
        id: 'dish_' + Date.now(),
        name,
        type,
        price,
        description
      };

      state.dishes.push(newDish);
      saveState();
      closeModal('dish-modal');
      dishForm.reset();
      renderMenuDishes();
      showToast(`Plato "${name}" agregado al menú`, 'success');
    });
  }
}

function quickLogin(roleType) {
  let targetUser = null;
  if (roleType === 'admin') {
    targetUser = state.users.find(u => u.role === 'admin');
  } else if (roleType === 'jefe_obra') {
    targetUser = state.users.find(u => u.role === 'jefe_obra');
  } else if (roleType === 'independiente') {
    targetUser = state.users.find(u => u.role === 'independiente');
  }

  if (targetUser) {
    state.currentUser = targetUser;
    saveState();
    showToast(`Acceso Rápido: Conectado como ${targetUser.name}`, 'success');
    showMainApp();
  }
}

function logout() {
  state.currentUser = null;
  saveState();
  showLoginScreen();
  showToast('Sesión cerrada correctamente', 'info');
}

function showLoginScreen() {
  document.getElementById('login-view').style.display = 'flex';
  document.getElementById('main-app').style.display = 'none';
}

function showMainApp() {
  document.getElementById('login-view').style.display = 'none';
  document.getElementById('main-app').style.display = 'block';

  const user = state.currentUser;
  
  // Setup Nav User Badge
  document.getElementById('nav-user-initials').textContent = user.initials || 'US';
  document.getElementById('nav-user-name').textContent = user.name;
  
  const roleTag = document.getElementById('nav-user-role');
  if (user.role === 'admin') {
    roleTag.textContent = 'Administrador Restaurante';
    document.getElementById('admin-nav').style.display = 'flex';
    document.getElementById('client-nav').style.display = 'none';
    populateClientSelectOptions();
    switchView('dashboard');
  } else {
    roleTag.textContent = user.type === 'empresa' ? 'Contrato Obra' : 'Cuenta Independiente';
    document.getElementById('admin-nav').style.display = 'none';
    document.getElementById('client-nav').style.display = 'flex';
    switchView('client-order');
  }
}

// --- VIEW NAVIGATION ---
function switchView(viewName) {
  // Hide all views
  const views = document.querySelectorAll('.view-section');
  views.forEach(v => v.classList.remove('active'));

  // Deactivate all nav items
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => item.classList.remove('active'));

  // Show target view
  const targetView = document.getElementById(`view-${viewName}`);
  if (targetView) {
    targetView.classList.add('active');
  }

  // Highlight active nav item
  const activeNavItem = Array.from(navItems).find(item => item.getAttribute('onclick')?.includes(viewName));
  if (activeNavItem) {
    activeNavItem.classList.add('active');
  }

  // Trigger view specific re-renderers
  if (viewName === 'dashboard') renderDashboard();
  if (viewName === 'inventory') renderInventory();
  if (viewName === 'accounts') renderAccounts();
  if (viewName === 'dispatch') renderDispatchView();
  if (viewName === 'reports') generateReport();
  if (viewName === 'menu') renderMenuDishes();
  if (viewName === 'client-order') renderClientOrderView();
  if (viewName === 'client-balance') renderClientBalanceView();
}

// --- DASHBOARD RENDERER ---
function renderDashboard() {
  // Calculate total meals delivered this month
  const totalMeals = state.deliveries.reduce((sum, d) => sum + d.qty, 0);
  document.getElementById('kpi-meals-count').textContent = totalMeals.toLocaleString() + ' raciones';

  // Calculate pending debt amount
  const pendingDeliveries = state.deliveries.filter(d => d.status === 'pendiente');
  const owedTotal = pendingDeliveries.reduce((sum, d) => sum + d.total, 0);
  document.getElementById('kpi-owed-amount').textContent = `$${owedTotal.toLocaleString()} COP`;

  // Owed clients count
  const owedClientIds = new Set(pendingDeliveries.map(d => d.clientId));
  document.getElementById('kpi-owed-clients').textContent = `${owedClientIds.size} obras/cuentas`;

  // Total Paid Amount (Cash vs Transfer)
  const paidDeliveries = state.deliveries.filter(d => d.status === 'pagado');
  const paidTotal = paidDeliveries.reduce((sum, d) => sum + d.total, 0);
  document.getElementById('kpi-paid-amount').textContent = `$${paidTotal.toLocaleString()} COP`;

  const cashTotal = paidDeliveries.filter(d => d.paymentMethod === 'Efectivo').reduce((sum, d) => sum + d.total, 0);
  const transferTotal = paidDeliveries.filter(d => d.paymentMethod === 'Transferencia Bancaria').reduce((sum, d) => sum + d.total, 0);
  document.getElementById('kpi-paid-split').textContent = `Efectivo: $${cashTotal.toLocaleString()} | Transfer: $${transferTotal.toLocaleString()}`;

  // Inventory Critical Alerts
  const lowStockInsumos = state.inventory.filter(i => i.stock <= i.minStock);
  const criticalStockInsumos = state.inventory.filter(i => i.stock <= (i.minStock / 2));
  
  document.getElementById('kpi-low-stock-count').textContent = lowStockInsumos.length;
  document.getElementById('kpi-critical-stock').textContent = `${criticalStockInsumos.length} en nivel crítico`;

  // Render Recent Deliveries Table
  const recentTable = document.getElementById('dashboard-recent-deliveries');
  recentTable.innerHTML = '';
  const recentList = [...state.deliveries].reverse().slice(0, 5);
  
  if (recentList.length === 0) {
    recentTable.innerHTML = `<tr><td colspan="6" style="text-align:center; color: var(--text-muted);">No hay despachos registrados</td></tr>`;
  } else {
    recentList.forEach(d => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${d.date}</td>
        <td><strong>${d.clientName}</strong></td>
        <td><span class="dish-type-tag type-${d.mealType.toLowerCase()}">${d.mealType}</span></td>
        <td>${d.qty} Raciones</td>
        <td>${d.extraItem ? `${d.extraItem} (x${d.extraQty})` : '<span style="color: var(--text-muted);">-</span>'}</td>
        <td style="font-weight:700; color: var(--primary);">$${d.total.toLocaleString()}</td>
      `;
      recentTable.appendChild(tr);
    });
  }

  // Render Low Stock Sidebar Alerts
  const stockAlertsBox = document.getElementById('dashboard-stock-alerts');
  stockAlertsBox.innerHTML = '';
  if (lowStockInsumos.length === 0) {
    stockAlertsBox.innerHTML = `<div style="padding: 1rem; text-align:center; color: var(--accent-green);"><i class="ri-checkbox-circle-fill"></i> Todos los insumos están con stock óptimo</div>`;
  } else {
    lowStockInsumos.forEach(item => {
      const isCritical = item.stock <= (item.minStock / 2);
      const div = document.createElement('div');
      div.style.cssText = `padding: 0.85rem; border-radius: 12px; background: ${isCritical ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)'}; border: 1px solid ${isCritical ? 'rgba(239,68,68,0.3)' : 'rgba(245,158,11,0.3)'}; display: flex; justify-content: space-between; align-items: center;`;
      div.innerHTML = `
        <div>
          <strong style="color: white; font-size: 0.88rem;">${item.name}</strong>
          <p style="font-size: 0.78rem; color: var(--text-muted);">Categoría: ${item.category}</p>
        </div>
        <div style="text-align: right;">
          <span class="badge ${isCritical ? 'badge-danger' : 'badge-warning'}">${item.stock} / ${item.minStock} ${item.unit}</span>
          <button class="btn btn-secondary btn-sm" style="margin-top:0.3rem; display:block;" onclick="openStockModal('${item.id}')">Reabastecer</button>
        </div>
      `;
      stockAlertsBox.appendChild(div);
    });
  }
}

// --- INVENTORY MODULE ---
let currentInventoryFilter = 'all';

function filterInventory(category) {
  currentInventoryFilter = category;
  const buttons = document.querySelectorAll('#inventory-category-tabs .filter-tab-btn');
  buttons.forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('onclick')?.includes(category));
  });
  renderInventory();
}

function renderInventory() {
  const tbody = document.getElementById('inventory-table-body');
  tbody.innerHTML = '';

  let list = state.inventory;
  if (currentInventoryFilter !== 'all') {
    list = list.filter(i => i.category === currentInventoryFilter);
  }

  list.forEach(item => {
    const isCritical = item.stock <= (item.minStock / 2);
    const isLow = item.stock <= item.minStock;
    
    let statusBadge = `<span class="badge badge-success"><i class="ri-check-line"></i> Normal</span>`;
    if (isCritical) {
      statusBadge = `<span class="badge badge-danger"><i class="ri-error-warning-fill"></i> Stock Crítico</span>`;
    } else if (isLow) {
      statusBadge = `<span class="badge badge-warning"><i class="ri-alert-line"></i> Stock Bajo</span>`;
    }

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><code>${item.code}</code></td>
      <td><strong>${item.name}</strong></td>
      <td>${item.category}</td>
      <td style="font-weight: 800; font-size: 1rem; color: ${isLow ? 'var(--accent-red)' : 'white'};">${item.stock} ${item.unit}</td>
      <td style="color: var(--text-muted);">${item.minStock} ${item.unit}</td>
      <td>${item.unit}</td>
      <td>${statusBadge}</td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="openStockModal('${item.id}')">
          <i class="ri-edit-box-line"></i> Ajustar Stock
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

// --- ACCOUNTS & CONTRACTS MODULE ---
let currentAccountTab = 'empresa';

function filterAccountsTab(type) {
  currentAccountTab = type;
  document.getElementById('tab-btn-empresas').classList.toggle('active', type === 'empresa');
  document.getElementById('tab-btn-independientes').classList.toggle('active', type === 'independiente');
  renderAccounts();
}

function renderAccounts() {
  const tbody = document.getElementById('accounts-table-body');
  tbody.innerHTML = '';

  const clients = state.users.filter(u => u.type === currentAccountTab);

  clients.forEach(client => {
    const clientDeliveries = state.deliveries.filter(d => d.clientId === client.id);
    const pendingDeliveries = clientDeliveries.filter(d => d.status === 'pendiente');

    const totalMealsCount = clientDeliveries.reduce((sum, d) => sum + d.qty, 0);
    const extrasCost = clientDeliveries.reduce((sum, d) => sum + (d.extraQty * d.extraPrice), 0);
    const owedTotal = pendingDeliveries.reduce((sum, d) => sum + d.total, 0);

    const isPaidOut = owedTotal === 0;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <strong>${client.name}</strong>
        <p style="font-size: 0.78rem; color: var(--text-muted);">${client.phone || ''}</p>
      </td>
      <td>${client.representative}</td>
      <td><strong>${totalMealsCount}</strong> Raciones</td>
      <td style="color: var(--accent-cyan); font-weight: 600;">$${extrasCost.toLocaleString()} COP</td>
      <td style="font-size: 1.1rem; font-weight: 800; color: ${isPaidOut ? 'var(--accent-green)' : 'var(--accent-red)'};">
        $${owedTotal.toLocaleString()} COP
      </td>
      <td>
        <span class="badge ${isPaidOut ? 'badge-success' : 'badge-danger'}">
          ${isPaidOut ? 'Al Día' : 'Saldo Pendiente'}
        </span>
      </td>
      <td>
        ${!isPaidOut ? `
          <button class="btn btn-success btn-sm" onclick="openPaymentModal('${client.id}')">
            <i class="ri-money-dollar-circle-line"></i> Liquidar Quincena / Mes
          </button>
        ` : `
          <button class="btn btn-secondary btn-sm" disabled style="opacity: 0.5;">
            <i class="ri-check-double-line"></i> Cuenta Pagada
          </button>
        `}
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function openPaymentModal(clientId) {
  const client = state.users.find(u => u.id === clientId);
  if (!client) return;

  const pendingDeliveries = state.deliveries.filter(d => d.clientId === clientId && d.status === 'pendiente');
  const owedTotal = pendingDeliveries.reduce((sum, d) => sum + d.total, 0);

  document.getElementById('pay-client-id').value = client.id;
  document.getElementById('pay-client-name').value = client.name;
  document.getElementById('pay-total-amount').value = `$${owedTotal.toLocaleString()} COP`;
  document.getElementById('pay-reference').value = '';

  openModal('payment-modal');
}

function processPaymentForClient(clientId, method, reference) {
  const client = state.users.find(u => u.id === clientId);
  const pendingDeliveries = state.deliveries.filter(d => d.clientId === clientId && d.status === 'pendiente');
  
  if (pendingDeliveries.length === 0) {
    showToast('No hay saldo pendiente por liquidar para este cliente', 'info');
    return;
  }

  const today = new Date().toISOString().split('T')[0];
  const totalAmount = pendingDeliveries.reduce((sum, d) => sum + d.total, 0);

  // Mark pending deliveries as paid
  pendingDeliveries.forEach(d => {
    d.status = 'pagado';
    d.paymentMethod = method;
    d.payDate = today;
  });

  // Record Payment Log
  state.payments.push({
    id: 'pay_' + Date.now(),
    clientId,
    clientName: client.name,
    amount: totalAmount,
    method,
    date: today,
    reference: reference || 'Liquidación registrada'
  });

  saveState();
  renderAccounts();
  renderDashboard();
  if (state.currentUser && state.currentUser.role !== 'admin') {
    renderClientBalanceView();
  }
  showToast(`¡Pago de $${totalAmount.toLocaleString()} registrado vía ${method}!`, 'success');
}

// --- DAILY DISPATCH MODULE ---
function populateClientSelectOptions() {
  const select = document.getElementById('dispatch-client');
  if (!select) return;
  select.innerHTML = '';

  const clients = state.users.filter(u => u.role !== 'admin');
  clients.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = `${c.name} (${c.type === 'empresa' ? 'Contrato Obra' : 'Independiente'})`;
    select.appendChild(opt);
  });
}

function renderDispatchView() {
  populateClientSelectOptions();

  // Render recent dispatch log table
  const tbody = document.getElementById('dispatch-log-table');
  tbody.innerHTML = '';

  const list = [...state.deliveries].reverse().slice(0, 10);
  list.forEach(d => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${d.date}</td>
      <td><strong>${d.clientName}</strong></td>
      <td><span class="dish-type-tag type-${d.mealType.toLowerCase()}">${d.mealType}</span></td>
      <td>${d.qty}</td>
      <td>${d.extraItem ? `${d.extraItem} (x${d.extraQty})` : '-'}</td>
      <td style="font-weight: 700; color: var(--primary);">$${d.total.toLocaleString()}</td>
    `;
    tbody.appendChild(tr);
  });
}

function processNewDispatch() {
  const dateStr = document.getElementById('dispatch-date').value;
  const clientId = document.getElementById('dispatch-client').value;
  const mealType = document.getElementById('dispatch-meal-type').value;
  const qty = parseInt(document.getElementById('dispatch-qty').value, 10);
  const extraItem = document.getElementById('dispatch-extra-item').value;
  const extraQty = parseInt(document.getElementById('dispatch-extra-qty').value, 10) || 0;

  // Validate Sunday Exemption
  const selectedDate = new Date(dateStr + 'T00:00:00');
  if (selectedDate.getDay() === 0) { // 0 is Sunday
    showToast('Recordatorio: El servicio de restaurante no labora los domingos.', 'error');
    return;
  }

  const client = state.users.find(u => u.id === clientId);
  if (!client) return;

  // Meal Price Lookup
  let mealPrice = 14000;
  if (mealType === 'Desayuno') mealPrice = 10000;
  if (mealType === 'Cena') mealPrice = 12000;

  // Extra Price Lookup
  let extraUnitPrice = 0;
  if (extraItem === 'Gaseosa 1.5L') extraUnitPrice = 6000;
  if (extraItem === 'Jugos Naturales') extraUnitPrice = 3500;
  if (extraItem === 'Postre Casero') extraUnitPrice = 4000;
  if (extraItem === 'Porción Carne Extra') extraUnitPrice = 5000;

  const totalMealCost = qty * mealPrice;
  const totalExtraCost = extraQty * extraUnitPrice;
  const grandTotal = totalMealCost + totalExtraCost;

  const newDelivery = {
    id: 'del_' + Date.now(),
    date: dateStr,
    clientId: client.id,
    clientName: client.name,
    mealType,
    qty,
    unitPrice: mealPrice,
    extraItem: extraQty > 0 ? extraItem : '',
    extraQty: extraQty > 0 ? extraQty : 0,
    extraPrice: extraUnitPrice,
    total: grandTotal,
    status: 'pendiente'
  };

  // AUTOMATED INVENTORY DEDUCTION (Resolving problem statement)
  // Deduct thermal packages & core proteins
  const envaseInsumo = state.inventory.find(i => i.code === 'INS-08');
  if (envaseInsumo) {
    envaseInsumo.stock = Math.max(0, envaseInsumo.stock - qty);
  }
  const arrozInsumo = state.inventory.find(i => i.code === 'INS-01');
  if (arrozInsumo) {
    arrozInsumo.stock = Math.max(0, arrozInsumo.stock - Math.ceil(qty * 0.15)); // ~150g per portion
  }

  state.deliveries.push(newDelivery);
  saveState();

  renderDispatchView();
  renderDashboard();
  showToast(`¡Despacho registrado! Total cargado a ${client.name}: $${grandTotal.toLocaleString()} COP`, 'success');
}

// --- REPORTS & BILLING CLOSURES MODULE ---
function generateReport() {
  const clientFilter = document.getElementById('report-filter-client')?.value || 'all';
  
  // Populate filter dropdown if empty
  const filterSelect = document.getElementById('report-filter-client');
  if (filterSelect && filterSelect.options.length <= 1) {
    state.users.filter(u => u.role !== 'admin').forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = c.name;
      filterSelect.appendChild(opt);
    });
  }

  let filteredDeliveries = state.deliveries;
  if (clientFilter !== 'all') {
    filteredDeliveries = filteredDeliveries.filter(d => d.clientId === clientFilter);
  }

  const owedDeliveries = filteredDeliveries.filter(d => d.status === 'pendiente');
  const paidDeliveries = filteredDeliveries.filter(d => d.status === 'pagado');

  const totalMealsOwedCount = owedDeliveries.reduce((sum, d) => sum + d.qty, 0);
  const totalExtrasOwedCost = owedDeliveries.reduce((sum, d) => sum + (d.extraQty * d.extraPrice), 0);
  const totalOwedAmount = owedDeliveries.reduce((sum, d) => sum + d.total, 0);
  const totalPaidAmount = paidDeliveries.reduce((sum, d) => sum + d.total, 0);

  document.getElementById('rep-summary-meals-owed').textContent = `${totalMealsOwedCount} raciones`;
  document.getElementById('rep-summary-extras').textContent = `$${totalExtrasOwedCost.toLocaleString()} COP`;
  document.getElementById('rep-summary-total-owed').textContent = `$${totalOwedAmount.toLocaleString()} COP`;
  document.getElementById('rep-summary-total-paid').textContent = `$${totalPaidAmount.toLocaleString()} COP`;

  document.getElementById('report-generated-date').textContent = `Fecha: ${new Date().toLocaleDateString('es-CO')}`;

  // Populate report table breakdown
  const tbody = document.getElementById('report-details-body');
  tbody.innerHTML = '';

  const activeClients = clientFilter === 'all' ? state.users.filter(u => u.role !== 'admin') : state.users.filter(u => u.id === clientFilter);

  activeClients.forEach(client => {
    const cDeliveries = state.deliveries.filter(d => d.clientId === client.id);
    if (cDeliveries.length === 0) return;

    const desayunos = cDeliveries.filter(d => d.mealType === 'Desayuno').reduce((sum, d) => sum + d.qty, 0);
    const almuerzos = cDeliveries.filter(d => d.mealType === 'Almuerzo').reduce((sum, d) => sum + d.qty, 0);
    const cenas = cDeliveries.filter(d => d.mealType === 'Cena').reduce((sum, d) => sum + d.qty, 0);
    const extrasVal = cDeliveries.reduce((sum, d) => sum + (d.extraQty * d.extraPrice), 0);
    const totalVal = cDeliveries.reduce((sum, d) => sum + d.total, 0);

    const pendingVal = cDeliveries.filter(d => d.status === 'pendiente').reduce((sum, d) => sum + d.total, 0);

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${client.name}</strong></td>
      <td>${client.type === 'empresa' ? 'Contrato Obra' : 'Independiente'}</td>
      <td>${desayunos}</td>
      <td>${almuerzos}</td>
      <td>${cenas}</td>
      <td style="color: var(--accent-cyan); font-weight: 600;">$${extrasVal.toLocaleString()}</td>
      <td style="font-weight: 800;">$${totalVal.toLocaleString()}</td>
      <td>
        ${pendingVal > 0 ? 
          `<span class="badge badge-danger">Debe $${pendingVal.toLocaleString()}</span>` : 
          `<span class="badge badge-success"><i class="ri-check-line"></i> Totalmente Pagado</span>`}
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// --- MENU BUILDER (ADMIN) ---
function renderMenuDishes() {
  const container = document.getElementById('admin-dishes-grid');
  container.innerHTML = '';

  state.dishes.forEach(dish => {
    const card = document.createElement('div');
    card.className = 'glass-card dish-card';
    card.innerHTML = `
      <div>
        <div class="dish-header">
          <span class="dish-type-tag type-${dish.type}">${dish.type}</span>
        </div>
        <h4 class="dish-title">${dish.name}</h4>
        <p class="dish-desc">${dish.description}</p>
      </div>
      <div class="dish-footer">
        <span class="dish-price">$${dish.price.toLocaleString()} COP</span>
        <button class="btn btn-secondary btn-sm" onclick="deleteDish('${dish.id}')">
          <i class="ri-delete-bin-line"></i> Eliminar
        </button>
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
  if (confirm('¿Desea eliminar este plato del menú?')) {
    state.dishes = state.dishes.filter(d => d.id !== dishId);
    saveState();
    renderMenuDishes();
    showToast('Plato eliminado del menú', 'info');
  }
}

// --- CLIENT ORDERING MODULE ---
let clientCart = {};

function renderClientOrderView() {
  const grid = document.getElementById('client-dishes-grid');
  grid.innerHTML = '';

  state.dishes.forEach(dish => {
    const qty = clientCart[dish.id] || 0;
    const card = document.createElement('div');
    card.className = 'glass-card dish-card';
    card.innerHTML = `
      <div>
        <div class="dish-header">
          <span class="dish-type-tag type-${dish.type}">${dish.type}</span>
        </div>
        <h4 class="dish-title">${dish.name}</h4>
        <p class="dish-desc">${dish.description}</p>
      </div>
      <div class="dish-footer">
        <span class="dish-price">$${dish.price.toLocaleString()} COP</span>
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
  const current = clientCart[dishId] || 0;
  const next = Math.max(0, current + change);
  clientCart[dishId] = next;

  const qtyEl = document.getElementById(`qty-val-${dishId}`);
  if (qtyEl) qtyEl.textContent = next;

  updateClientOrderSummary();
}

function updateClientOrderSummary() {
  const listEl = document.getElementById('client-order-items-list');
  listEl.innerHTML = '';

  let totalCost = 0;
  let hasItems = false;

  Object.keys(clientCart).forEach(dishId => {
    const count = clientCart[dishId];
    if (count > 0) {
      hasItems = true;
      const dish = state.dishes.find(d => d.id === dishId);
      if (dish) {
        const itemCost = dish.price * count;
        totalCost += itemCost;

        const div = document.createElement('div');
        div.className = 'summary-row';
        div.innerHTML = `
          <span>${dish.name} (x${count})</span>
          <strong>$${itemCost.toLocaleString()} COP</strong>
        `;
        listEl.appendChild(div);
      }
    }
  });

  if (!hasItems) {
    listEl.innerHTML = `<p style="color: var(--text-muted); text-align:center;">No has seleccionado raciones o extras aún.</p>`;
  }

  document.getElementById('client-order-total-price').textContent = `$${totalCost.toLocaleString()} COP`;
}

function submitClientOrder() {
  const dateStr = document.getElementById('client-order-date').value;

  // Validate Sunday Exemption
  const selectedDate = new Date(dateStr + 'T00:00:00');
  if (selectedDate.getDay() === 0) {
    showToast('Los domingos no se realiza despacho de alimentos.', 'error');
    return;
  }

  const selectedDishIds = Object.keys(clientCart).filter(id => clientCart[id] > 0);
  if (selectedDishIds.length === 0) {
    showToast('Por favor selecciona al menos un plato o extra.', 'error');
    return;
  }

  const user = state.currentUser;
  if (!user) return;

  selectedDishIds.forEach(dishId => {
    const dish = state.dishes.find(d => d.id === dishId);
    const count = clientCart[dishId];

    if (dish && count > 0) {
      let mType = 'Almuerzo';
      if (dish.type === 'desayuno') mType = 'Desayuno';
      if (dish.type === 'cena') mType = 'Cena';

      const isExtra = dish.type === 'extra';

      const delivery = {
        id: 'del_' + Date.now() + Math.random().toString(36).substr(2, 4),
        date: dateStr,
        clientId: user.id,
        clientName: user.name,
        mealType: isExtra ? 'Almuerzo' : mType,
        qty: isExtra ? 0 : count,
        unitPrice: dish.price,
        extraItem: isExtra ? dish.name : '',
        extraQty: isExtra ? count : 0,
        extraPrice: isExtra ? dish.price : 0,
        total: dish.price * count,
        status: 'pendiente'
      };

      state.deliveries.push(delivery);
    }
  });

  saveState();
  clientCart = {};
  renderClientOrderView();
  showToast('¡Tu pedido ha sido registrado con éxito!', 'success');
}

// --- CLIENT BALANCE VIEW ---
function renderClientBalanceView() {
  const user = state.currentUser;
  if (!user) return;

  const clientDeliveries = state.deliveries.filter(d => d.clientId === user.id);
  const pendingDeliveries = clientDeliveries.filter(d => d.status === 'pendiente');

  const totalOwed = pendingDeliveries.reduce((sum, d) => sum + d.total, 0);
  const totalMeals = clientDeliveries.reduce((sum, d) => sum + d.qty, 0);
  const totalExtrasCost = clientDeliveries.reduce((sum, d) => sum + (d.extraQty * d.extraPrice), 0);

  document.getElementById('client-current-balance').textContent = `$${totalOwed.toLocaleString()} COP`;
  document.getElementById('client-stat-meals').textContent = `${totalMeals} raciones`;
  document.getElementById('client-stat-extras').textContent = `$${totalExtrasCost.toLocaleString()} COP`;
  document.getElementById('client-account-type-label').textContent = user.type === 'empresa' ? 'Contrato Obra (Jefe)' : 'Trabajador Independiente';

  const statusBadge = document.getElementById('client-balance-status');
  if (totalOwed === 0) {
    statusBadge.textContent = 'Al Día - Sin Deuda';
    statusBadge.className = 'badge badge-success';
  } else {
    statusBadge.textContent = 'Pago Quincenal Pendiente';
    statusBadge.className = 'badge badge-warning';
  }

  // Render Table History
  const tbody = document.getElementById('client-history-table');
  tbody.innerHTML = '';

  const list = [...clientDeliveries].reverse();
  list.forEach(d => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${d.date}</td>
      <td><span class="dish-type-tag type-${d.mealType.toLowerCase()}">${d.mealType}</span></td>
      <td>${d.qty}</td>
      <td>${d.extraItem ? `${d.extraItem} (x${d.extraQty})` : '-'}</td>
      <td style="font-weight: 700; color: var(--primary);">$${d.total.toLocaleString()} COP</td>
    `;
    tbody.appendChild(tr);
  });
}

function openPaymentModalForCurrentClient() {
  if (state.currentUser) {
    openPaymentModal(state.currentUser.id);
  }
}

// --- MODAL & TOAST HELPERS ---
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let iconClass = 'ri-information-line';
  if (type === 'success') iconClass = 'ri-checkbox-circle-line';
  if (type === 'error') iconClass = 'ri-error-warning-line';

  toast.innerHTML = `<i class="${iconClass}" style="font-size: 1.2rem;"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
