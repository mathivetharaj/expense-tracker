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
    try {
        const response = await fetch('/api/expenses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount, category, spend_mode,date })
        });
        if (!response.ok) throw new Error((await response.json()).error);
        fetchExpenses();
        form.reset();
    } catch (error) {
        alert(`Error adding expense: ${error.message}`);
    }

  });

// Fetch and render expenses
async function fetchExpenses() {
    try{
    const response = await fetch('/api/expenses');
    if (!response.ok) throw new Error('Failed to fetch expenses');
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
        .map(([cat, total]) => `<p>${cat}: AED ${total.toFixed(2)}</p>`)
        .join('');

    const spendModeTotals = expenses.reduce((acc, exp) => { 
        acc[exp.spend_mode] = (acc[exp.spend_mode] || 0) + parseFloat(exp.amount);
        return acc;
    }
    , {});
    const spendModeDiv = document.querySelector('#spend-mode-totals');
    spendModeDiv.innerHTML = Object.entries(spendModeTotals)
        .map(([mode, total]) => `<p>${mode}: AED ${total.toFixed(2)}</p>`)
        .join('');
}catch(error){
    console.error('Error fetching expenses:', error);
    alert('Failed to load expenses. Please try again later.');
}}
async function deleteExpense(id) {
    try {
        const response = await fetch(`/api/expenses/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error((await response.json()).error);
        fetchExpenses();
    } catch (error) {
        alert(`Error deleting expense: ${error.message}`);
    }
}