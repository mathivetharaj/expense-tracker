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
           <td><button onclick="deleteExpense(${expense.id})">Delete</button></td
        `;
        tableBody.appendChild(row);
    });

    // Update total (if you added it)
    const total = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    if (document.querySelector('#total-amount')) {
        document.querySelector('#total-amount').textContent = total.toFixed(2);
    }

    const categoryTotals = expenses.reduce((acc, exp) => {
        acc[exp.category] = (acc[exp.category] || 0) + parseFloat(exp.amount);
        return acc;
    }, {});
    const totalsDiv = document.querySelector('#category-totals');
    totalsDiv.innerHTML = Object.entries(categoryTotals)
        .map(([cat, total]) => `<p>${cat}: $${total.toFixed(2)}</p>`)
        .join('');

    const spendModeTotals = expenses.reduce((acc, exp) => { 
        acc[exp.spend_mode] = (acc[exp.spend_mode] || 0) + parseFloat(exp.amount);
        return acc;
    }
    , {});
    const spendModeDiv = document.querySelector('#spend-mode-totals');
    spendModeDiv.innerHTML = Object.entries(spendModeTotals)
        .map(([mode, total]) => `<p>${mode}: $${total.toFixed(2)}</p>`)
        .join('');
}
function deleteExpense(id) {
    fetch(`/api/expenses/${id}`, {
        method: 'DELETE'
    }).then(() => {
        fetchExpenses();
    });
}