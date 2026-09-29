'use strict';

const loginForm = document.querySelector('#loginForm');
const usernameInput = document.querySelector('#username');
const passwordInput = document.querySelector('#password');
const rememberUsername = document.querySelector('#rememberUsername');
const togglePassword = document.querySelector('#togglePassword');
const resetPassword = document.querySelector('#resetPassword');
const formMessage = document.querySelector('#formMessage');
const loginLayout = document.querySelector('.login-layout');
const workspace = document.querySelector('#workspace');
const workspaceUsername = document.querySelector('#workspaceUsername');
const logoutButton = document.querySelector('#logoutButton');
const refreshWorkspace = document.querySelector('#refreshWorkspace');
const workspaceMessage = document.querySelector('#workspaceMessage');
const addTableButton = document.querySelector('#addTableButton');
const tableEditor = document.querySelector('#tableEditor');
const tableEditorTitle = document.querySelector('#tableEditorTitle');
const tableEditorMessage = document.querySelector('#tableEditorMessage');
const tableNumberInput = document.querySelector('#tableNumberInput');
const tableCapacityInput = document.querySelector('#tableCapacityInput');
const tableStatusInput = document.querySelector('#tableStatusInput');
const cancelTableEdit = document.querySelector('#cancelTableEdit');
const bookingForm = document.querySelector('#bookingForm');
const bookingTable = document.querySelector('#bookingTable');
const bookingPartySize = document.querySelector('#bookingPartySize');
const bookingStart = document.querySelector('#bookingStart');
const bookingEnd = document.querySelector('#bookingEnd');
const bookingTableInfo = document.querySelector('#bookingTableInfo');
const bookingMessage = document.querySelector('#bookingMessage');
const foodOrderForm = document.querySelector('#foodOrderForm');
const orderTable = document.querySelector('#orderTable');
const foodItemList = document.querySelector('#foodItemList');
const orderTotal = document.querySelector('#orderTotal');
const orderMessage = document.querySelector('#orderMessage');
const billForm = document.querySelector('#billForm');
const billTable = document.querySelector('#billTable');
const billMessage = document.querySelector('#billMessage');
const billResult = document.querySelector('#billResult');
const billTotal = document.querySelector('#billTotal');
const billDetails = document.querySelector('#billDetails');
const demoUsername = 'manager';
const demoPassword = 'TableTurn2026!';
const rememberedUsername = localStorage.getItem('tableturn.username');
let workspaceTables = [];

if (rememberedUsername) {
    usernameInput.value = rememberedUsername;
    rememberUsername.checked = true;
}

document.querySelector('#bookingDate').min = new Date().toLocaleDateString('en-CA');

togglePassword.addEventListener('click', () => {
    const passwordVisible = passwordInput.type === 'text';
    passwordInput.type = passwordVisible ? 'password' : 'text';
    togglePassword.textContent = passwordVisible ? 'Show' : 'Hide';
    togglePassword.setAttribute('aria-pressed', String(!passwordVisible));
});

resetPassword.addEventListener('click', () => {
    formMessage.textContent = 'Password reset is not connected in this frontend preview.';
});

function addEmptyMessage(container, message) {
    const empty = document.createElement('p');
    empty.className = 'data-empty';
    empty.textContent = message;
    container.replaceChildren(empty);
}

function addDataRow(container, title, detail, status, isBusy = false) {
    const row = document.createElement('div');
    row.className = 'data-row';

    const primary = document.createElement('div');
    primary.className = 'data-primary';

    const titleElement = document.createElement('span');
    titleElement.className = 'data-title';
    titleElement.textContent = title;

    const detailElement = document.createElement('span');
    detailElement.className = 'data-detail';
    detailElement.textContent = detail;
    primary.append(titleElement, detailElement);

    const statusElement = document.createElement('span');
    statusElement.className = isBusy ? 'data-status is-busy' : 'data-status';
    statusElement.textContent = status;
    row.append(primary, statusElement);
    container.append(row);
}

function addTableRow(container, table) {
    const row = document.createElement('div');
    row.className = 'data-row table-data-row';

    const primary = document.createElement('div');
    primary.className = 'data-primary';

    const title = document.createElement('span');
    title.className = 'data-title';
    title.textContent = `Table ${table.tableNumber}`;

    const detail = document.createElement('span');
    detail.className = 'data-detail';
    detail.textContent = `${table.capacity} seats · ID ${table.id}`;
    primary.append(title, detail);

    const status = document.createElement('span');
    status.className = table.status?.toUpperCase() === 'FREE' ? 'data-status' : 'data-status is-busy';
    status.textContent = table.status || 'Unknown';

    const actions = document.createElement('div');
    actions.className = 'table-actions';
    actions.append(
        createTableAction('Edit', 'edit', table.id),
        createTableAction('Delete', 'delete', table.id)
    );
    row.append(primary, status, actions);
    container.append(row);
}

function createTableAction(label, action, id) {
    const button = document.createElement('button');
    button.className = 'row-action';
    button.type = 'button';
    button.dataset.tableAction = action;
    button.dataset.tableId = String(id);
    button.textContent = label;
    return button;
}

function openTableEditor(table = null) {
    tableEditor.reset();
    tableEditorMessage.textContent = '';
    tableEditor.dataset.tableId = table ? String(table.id) : '';
    tableEditorTitle.textContent = table ? `Edit table ${table.tableNumber}` : 'Add a table';
    tableNumberInput.value = table ? table.tableNumber : '';
    tableCapacityInput.value = table ? table.capacity : '';
    tableStatusInput.value = table?.status || 'FREE';
    tableEditor.hidden = false;
    tableNumberInput.focus();
}

function closeTableEditor() {
    tableEditor.hidden = true;
    tableEditor.reset();
    tableEditor.dataset.tableId = '';
    tableEditorMessage.textContent = '';
}

function responseMessage(body, fallback) {
    if (!body) {
        return fallback;
    }
    try {
        const error = JSON.parse(body);
        return error.detail || error.message || fallback;
    } catch {
        return body || fallback;
    }
}

function populateTableSelect(select, tables, allowedStatuses, emptyLabel) {
    const previousValue = select.value;
    select.replaceChildren(new Option(emptyLabel, ''));

    const options = tables.filter((table) =>
        allowedStatuses.includes(table.status?.toUpperCase())
    );
    options.forEach((table) => {
        select.add(new Option(
            `Table ${table.tableNumber} · ${table.capacity} seats · ${table.status}`,
            String(table.id)
        ));
    });

    if (options.some((table) => String(table.id) === previousValue)) {
        select.value = previousValue;
    }
}

function updateWorkflowTables() {
    populateTableSelect(bookingTable, workspaceTables, ['FREE'], 'Select a free table');
    populateTableSelect(orderTable, workspaceTables, ['RESERVED', 'OCCUPIED'], 'Select a reserved table');
    populateTableSelect(billTable, workspaceTables, ['OCCUPIED'], 'Select an occupied table');
    updateBookingTableInfo();
}

function updateBookingTableInfo() {
    const table = workspaceTables.find((item) => String(item.id) === bookingTable.value);
    if (!table) {
        bookingTableInfo.textContent = 'Choose a free table to see its seating and status.';
        bookingPartySize.removeAttribute('max');
        return;
    }

    bookingPartySize.max = String(table.capacity);
    if (Number(bookingPartySize.value) > table.capacity) {
        bookingPartySize.value = String(table.capacity);
    }
    bookingTableInfo.textContent = `Table ${table.tableNumber} · ${table.capacity} seats · Status: ${table.status}`;
}

function formatMoney(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(amount);
}

function addFoodItemRow() {
    const row = document.createElement('div');
    row.className = 'food-item-row';
    row.innerHTML = `
        <label>Food item<input class="food-name" type="text" placeholder="Dish name" required></label>
        <label>Qty<input class="food-quantity" type="number" min="1" value="1" required></label>
        <label>Price<input class="food-price" type="number" min="0" step="0.01" placeholder="0.00" required></label>
        <button class="remove-food-item" type="button" aria-label="Remove food item" title="Remove item">&times;</button>
    `;
    foodItemList.append(row);
    row.querySelectorAll('input').forEach((input) => input.addEventListener('input', updateOrderTotal));
    row.querySelector('.remove-food-item').addEventListener('click', () => {
        if (foodItemList.children.length > 1) {
            row.remove();
            updateOrderTotal();
        }
    });
    updateOrderTotal();
}

function updateOrderTotal() {
    const total = [...foodItemList.querySelectorAll('.food-item-row')]
        .reduce((sum, row) => {
            const quantity = Number(row.querySelector('.food-quantity').value) || 0;
            const price = Number(row.querySelector('.food-price').value) || 0;
            return sum + quantity * price;
        }, 0);
    orderTotal.textContent = formatMoney(total);
}

function selectDashboardTab(tabName) {
    document.querySelectorAll('[data-dashboard-tab]').forEach((tab) => {
        const isActive = tab.dataset.dashboardTab === tabName;
        tab.classList.toggle('is-active', isActive);
        tab.setAttribute('aria-selected', String(isActive));
    });
    document.querySelectorAll('.dashboard-view').forEach((view) => {
        view.hidden = view.id !== `dashboard-${tabName}`;
    });
    if (tabName !== 'overview') {
        updateWorkflowTables();
    }
}

document.querySelector('.workspace-tabs').addEventListener('click', (event) => {
    const tab = event.target.closest('[data-dashboard-tab]');
    if (tab) {
        selectDashboardTab(tab.dataset.dashboardTab);
    }
});

bookingTable.addEventListener('change', updateBookingTableInfo);
bookingPartySize.addEventListener('input', updateBookingTableInfo);
document.querySelector('#addFoodItem').addEventListener('click', addFoodItemRow);
addFoodItemRow();

async function loadWorkspace() {
    workspaceMessage.textContent = '';
    addEmptyMessage(document.querySelector('#floorList'), 'Loading tables...');
    addEmptyMessage(document.querySelector('#reservationList'), 'Loading reservations...');

    try {
        const [tablesResponse, reservationsResponse] = await Promise.all([
            fetch('/api/tables'),
            fetch('/api/reservations')
        ]);

        if (!tablesResponse.ok || !reservationsResponse.ok) {
            throw new Error('The service data could not be loaded.');
        }

        const [tables, reservations] = await Promise.all([
            tablesResponse.json(),
            reservationsResponse.json()
        ]);
        const floorList = document.querySelector('#floorList');
        const reservationList = document.querySelector('#reservationList');
        workspaceTables = tables;
        updateWorkflowTables();
        const freeTables = tables.filter((table) => table.status?.toUpperCase() === 'FREE').length;

        document.querySelector('#tableCount').textContent = String(tables.length);
        document.querySelector('#reservationCount').textContent = String(reservations.length);
        document.querySelector('#freeCount').textContent = String(freeTables);

        if (tables.length === 0) {
            addEmptyMessage(floorList, 'No tables have been added yet.');
        } else {
            floorList.replaceChildren();
            tables.forEach((table) => {
                addTableRow(floorList, table);
            });
        }

        if (reservations.length === 0) {
            addEmptyMessage(reservationList, 'No reservations yet.');
        } else {
            reservationList.replaceChildren();
            reservations.forEach((reservation) => {
                addDataRow(
                    reservationList,
                    reservation.customerName || 'Guest',
                    `${reservation.reservationDate || ''} · ${reservation.startTime || ''}`,
                    `Party ${reservation.partySize}`
                );
            });
        }
    } catch (error) {
        document.querySelector('#tableCount').textContent = '--';
        document.querySelector('#reservationCount').textContent = '--';
        document.querySelector('#freeCount').textContent = '--';
        workspaceMessage.textContent = 'Could not load service data. Make sure the TableTurn server is running.';
    }
}

bookingForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!bookingForm.reportValidity()) {
        return;
    }

    const tableId = Number(bookingTable.value);
    const table = workspaceTables.find((item) => item.id === tableId);
    if (!table) {
        bookingMessage.textContent = 'Select an available table first.';
        return;
    }
    if (Number(bookingPartySize.value) > table.capacity) {
        bookingMessage.textContent = `This table has ${table.capacity} seats.`;
        return;
    }
    if (bookingStart.value >= bookingEnd.value) {
        bookingMessage.textContent = 'End time must be later than start time.';
        return;
    }

    try {
        const response = await fetch('/api/reservations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                customerName: document.querySelector('#bookingCustomer').value.trim(),
                reservationDate: document.querySelector('#bookingDate').value,
                startTime: bookingStart.value,
                endTime: bookingEnd.value,
                partySize: Number(bookingPartySize.value),
                table: { id: tableId }
            })
        });
        if (!response.ok) {
            bookingMessage.textContent = responseMessage(
                await response.text(),
                `Could not save reservation (HTTP ${response.status}).`
            );
            return;
        }

        bookingForm.reset();
        bookingMessage.textContent = `Table ${table.tableNumber} reserved. Add food in the Food orders tab.`;
        await loadWorkspace();
    } catch {
        bookingMessage.textContent = 'Could not reach the server. Check that TableTurn is running.';
    }
});

foodOrderForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!foodOrderForm.reportValidity()) {
        return;
    }

    const items = [...foodItemList.querySelectorAll('.food-item-row')].map((row) => ({
        itemName: row.querySelector('.food-name').value.trim(),
        quantity: Number(row.querySelector('.food-quantity').value),
        price: Number(row.querySelector('.food-price').value)
    }));

    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ table: { id: Number(orderTable.value) }, items })
        });
        if (!response.ok) {
            orderMessage.textContent = responseMessage(
                await response.text(),
                `Could not place order (HTTP ${response.status}).`
            );
            return;
        }

        const order = await response.json();
        orderMessage.textContent = `Order #${order.id} placed. Current total: ${formatMoney(
            items.reduce((sum, item) => sum + item.quantity * item.price, 0)
        )}.`;
        foodOrderForm.reset();
        foodItemList.replaceChildren();
        addFoodItemRow();
        await loadWorkspace();
    } catch {
        orderMessage.textContent = 'Could not reach the server. Check that TableTurn is running.';
    }
});

billForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!billForm.reportValidity()) {
        return;
    }

    billMessage.textContent = '';
    billResult.hidden = true;
    try {
        const response = await fetch(`/api/bills/table/${Number(billTable.value)}`, { method: 'POST' });
        if (!response.ok) {
            billMessage.textContent = responseMessage(
                await response.text(),
                `Could not generate bill (HTTP ${response.status}).`
            );
            return;
        }

        const bill = await response.json();
        billTotal.textContent = formatMoney(bill.totalAmount);
        billDetails.textContent = `Bill #${bill.id} · Table ${bill.table.tableNumber} · ${new Date(bill.billTime).toLocaleString()}`;
        billResult.hidden = false;
        await loadWorkspace();
    } catch {
        billMessage.textContent = 'Could not reach the server. Check that TableTurn is running.';
    }
});

addTableButton.addEventListener('click', () => openTableEditor());
cancelTableEdit.addEventListener('click', closeTableEditor);

tableEditor.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!tableEditor.reportValidity()) {
        return;
    }

    const tableId = tableEditor.dataset.tableId;
    const method = tableId ? 'PUT' : 'POST';
    const url = tableId ? `/api/tables/${tableId}` : '/api/tables';
    const table = {
        tableNumber: Number(tableNumberInput.value),
        capacity: Number(tableCapacityInput.value),
        status: tableStatusInput.value
    };

    try {
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(table)
        });
        if (!response.ok) {
            tableEditorMessage.textContent = responseMessage(
                await response.text(),
                `Could not save table (HTTP ${response.status}).`
            );
            return;
        }
        closeTableEditor();
        await loadWorkspace();
    } catch {
        tableEditorMessage.textContent = 'Could not reach the server. Check that TableTurn is running.';
    }
});

document.querySelector('#floorList').addEventListener('click', async (event) => {
    const button = event.target.closest('[data-table-action]');
    if (!button) {
        return;
    }

    const tableId = Number(button.dataset.tableId);
    const table = workspaceTables.find((item) => item.id === tableId);
    if (button.dataset.tableAction === 'edit' && table) {
        openTableEditor(table);
        return;
    }

    if (button.dataset.tableAction !== 'delete' || !table) {
        return;
    }
    if (!window.confirm(`Delete table ${table.tableNumber}?`)) {
        return;
    }

    try {
        const response = await fetch(`/api/tables/${tableId}`, { method: 'DELETE' });
        if (!response.ok) {
            workspaceMessage.textContent = responseMessage(
                await response.text(),
                `Could not delete table (HTTP ${response.status}).`
            );
            return;
        }
        await loadWorkspace();
    } catch {
        workspaceMessage.textContent = 'Could not reach the server. Check that TableTurn is running.';
    }
});

function showWorkspace(username) {
    loginLayout.hidden = true;
    workspace.hidden = false;
    workspaceUsername.textContent = username;
    loadWorkspace();
}

logoutButton.addEventListener('click', () => {
    workspace.hidden = true;
    loginLayout.hidden = false;
    passwordInput.value = '';
    formMessage.textContent = '';
    usernameInput.focus();
});

refreshWorkspace.addEventListener('click', loadWorkspace);

loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!loginForm.reportValidity()) {
        return;
    }

    const username = usernameInput.value.trim();
    if (username !== demoUsername || passwordInput.value !== demoPassword) {
        formMessage.textContent = 'Username or password is incorrect. Use the demo credentials shown below.';
        return;
    }

    if (rememberUsername.checked) {
        localStorage.setItem('tableturn.username', username);
    } else {
        localStorage.removeItem('tableturn.username');
    }

    showWorkspace(username);
});