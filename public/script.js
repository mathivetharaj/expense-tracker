const form = document.querySelector('#expense-form form');
const tableBody = document.querySelector('#expense-table-body');

// Load expenses on page load
window.addEventListener('load', fetchExpenses);

// Handle form submission
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const amount = document.querySelector('#amount').value;
    const category = document.querySelector('#category').value;
    const spend_mode = document.querySelector('#spend_mode').value;
    const date = document.querySelector('#date').value;

    // Send to backend
    await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, category, spend_mode,date })
    });

    // Refresh table
    fetchExpenses();

    // Clear form
    form.reset();
});

// Fetch and render expenses
async function fetchExpenses() {
    const response = await fetch('/api/expenses');
    const expenses = await response.json();

    tableBody.innerHTML = '';
    expenses.forEach(expense => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>AED ${parseFloat(expense.amount).toFixed(2)}</td>
            <td>${expense.category}</td>
            <td>${expense.spend_mode}</td>
            <td>${expense.date}</td>
        `;
        tableBody.appendChild(row);
    });

    // Update total (if you added it)
    const total = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    if (document.querySelector('#total-amount')) {
        document.querySelector('#total-amount').textContent = total.toFixed(2);
    }
}