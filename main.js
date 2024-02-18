document.addEventListener('DOMContentLoaded', () => {
  const expenseForm = document.getElementById('expense-form');
  const expenseList = document.getElementById('expense-list');
  const totalSalaryElement = document.createElement('p');
  totalSalaryElement.id = 'total-salary';
  document.querySelector('.container').insertBefore(totalSalaryElement, expenseList.nextSibling);

  expenseForm.addEventListener('submit', addExpense);
  expenseList.addEventListener('click', deleteOrEditExpense);

  displayExpenses();

  function addExpense(event) {
    event.preventDefault();
    const expenseInput = document.getElementById('expense-input');
    const amountInput = document.getElementById('amount-input');

    if (expenseInput.value.trim() === '' || amountInput.value.trim() === '') {
      alert('Please enter both expense name and amount.');
      return;
    }

    const expense = {
      id: Date.now(),
      name: expenseInput.value,
      amount: parseFloat(amountInput.value)
    };

    let expenses = localStorage.getItem('expenses');
    expenses = expenses ? JSON.parse(expenses) : [];
    expenses.push(expense);
    localStorage.setItem('expenses', JSON.stringify(expenses));

    displayExpenses();

    updateTotalSalary();
    expenseInput.value = '';
    amountInput.value = '';
  }
  function deleteOrEditExpense(event) {
    if (event.target.classList.contains('delete-btn')) {
      deleteExpense(event);
    } else if (event.target.classList.contains('edit-btn')) {
      editExpense(event);
    }
  }
  function deleteExpense(event) {
    const id = parseInt(event.target.parentElement.getAttribute('data-id'));
    let expenses = localStorage.getItem('expenses');
    expenses = expenses ? JSON.parse(expenses) : [];
    expenses = expenses.filter(expense => expense.id !== id);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    displayExpenses();
    updateTotalSalary();
  }
  function editExpense(event) {
    const id = parseInt(event.target.parentElement.getAttribute('data-id'));
    let expenses = localStorage.getItem('expenses');
    expenses = expenses ? JSON.parse(expenses) : [];
    const index = expenses.findIndex(expense => expense.id === id);
    const newAmount = prompt('Enter the new amount:');
    if (newAmount !== null) {
      expenses[index].amount = parseFloat(newAmount);
      localStorage.setItem('expenses', JSON.stringify(expenses));
      displayExpenses();
      updateTotalSalary();
    }
  }
  function displayExpenses() {
    let expenses = localStorage.getItem('expenses');
    expenses = expenses ? JSON.parse(expenses) : [];

    expenseList.innerHTML = '';
    expenses.forEach(expense => {
      const li = document.createElement('li');
      li.setAttribute('data-id', expense.id);
      li.innerHTML = `<span>${expense.name}</span> - <span>${expense.amount}</span> 
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>`;
      expenseList.appendChild(li);
    });
    updateTotalSalary();
  }
  function updateTotalSalary() {
    let expenses = localStorage.getItem('expenses');
    expenses = expenses ? JSON.parse(expenses) : [];
    const totalSalary = expenses.reduce((total, expense) => total + expense.amount, 0);
    totalSalaryElement.textContent = `Total Salary: $${totalSalary.toFixed(2)}`;
  }
});
