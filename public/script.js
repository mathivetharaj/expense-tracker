// Array to store expenses (temporary, until we use SQLite)
let expenses = [];

// Get DOM elements
const form = document.querySelector('#expense-form form');
const tableBody = document.querySelector('#expense-table-body');

// Handle form submission
form.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent page reload

    // Get form values
    const amount = document.querySelector('#amount').value;
    const category = document.querySelector('#category').value;
    const spendMode = document.querySelector('#spend_mode').value;
    const date = document.querySelector('#date').value;

    // Create expense object
    const expense = { amount, category, spendMode, date };

    // Add to expenses array
    expenses.push(expense);

    // Update table
    renderExpenses();

    // Clear form
    form.reset();
});

// Function to render expenses in the table
function renderExpenses() {
    // Clear existing rows
    tableBody.innerHTML = '';

    // Add each expense as a row
    expenses.forEach(expense => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>AED ${parseFloat(expense.amount).toFixed(2)}</td>
            <td>${expense.category}</td>
            <td>${expense.spendMode}</td>
            <td>${expense.date}</td>
        `;
        tableBody.appendChild(row);
    });
    const total = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    document.querySelector('#total-amount').textContent = total.toFixed(2);
}

// Initial render (for any static data or testing)
renderExpenses();