//  classes ---------------

class List{
    constructor(title, amount, id) {
        this.title = title;
        this.amount = amount;
        this.id = id;
    }

    renderExpense(){
       const div = document.createElement('div');
       div.classList.add('list');
       div.setAttribute('data-id', this.id);
       div.innerHTML = `                                   
       <div class="ex-detail">
            <span class="title">${this.title}</span>
            <span class="amount"> ${this.amount} </span>
        </div>
   
        <div class="icons">
            <i class="fa-solid fa-pen-to-square edit"></i>
            <i class="fa-solid fa-trash-can trash"></i>
        </div>
       `;
       const allExpenses = document.querySelector('.all-expenses');
       allExpenses.appendChild(div);

    }
}

class UI{
    static expensesArr;

    static addBudget(budget){
        if(budget.value.trim() !== '' && !isNaN(parseInt(budget.value)) ){
            localStorage.setItem('budget', budget.value)
            this.updateBudget();
            this.updateBalance();
            this.updateExpense();
            console.log('passed')
        }else{
            document.querySelector('#budget-error').classList.remove('hide');
            setTimeout(() =>{
                document.querySelector('#budget-error').classList.add('hide');
            }, 3000)
        }
    }
    static addExpense(title, amount){
        if((title.trim() !== '' && isNaN(parseInt(title))) && (amount.trim() !== '' && (typeof parseInt(amount) !== 'string' || typeof parseInt(amount) !== 'NaN'))){
            const localArr = JSON.parse(localStorage.getItem('expenses'));
            function genId(){
                if(localArr == null||'' || localArr.length == 0 ){
                    return 1;
                }else{
                    const lastIndex = localArr.length;
                    return  localArr[lastIndex - 1].id + 1;
                }
            }
            let expense = {
                title: title,
                amount: parseInt(amount, 10),
                id: genId(),
            }
            console.log(expense.id);
            this.expensesArr.push(expense);
            // add expenses to local storage
            localStorage.setItem('expenses', JSON.stringify(this.expensesArr));

            // render the expense in the page
            const newExpense = new List(title, amount, expense.id);
            newExpense.renderExpense();
            this.updateBalance();
            this.updateExpense();
        }else{
            document.querySelector('#expense-error').classList.remove('hide');
            setTimeout(() =>{
                document.querySelector('#expense-error').classList.add('hide');
            }, 3000)
        }
    }

    static totalExpense(){
        let localExpenses = JSON.parse(localStorage.getItem('expenses'));
        if(localExpenses){
            let amountsArr = localExpenses.map((expense) =>{
                return expense.amount
            });
            let totalAmount = amountsArr.reduce((a,b)=> a+b,0);
            return totalAmount;
        }
    }

    static updateExpense(){
        const totalExpenses = document.querySelector('.total-expenses');
        totalExpenses.innerText = this.totalExpense();
    }

    static updateBalance(){
        const totalBalance = document.querySelector('.total-balance');
        if(localStorage.getItem('budget')){
            let budget = parseInt(localStorage.getItem('budget'), 10);
            totalBalance.innerText = budget - this.totalExpense();
        }else{
            totalBalance.innerText = -this.totalExpense();
        }
    }

    static updateBudget(){
        const totalBudget = document.querySelector('.total-budget');
        totalBudget.innerText = parseInt(localStorage.getItem('budget'), 10);
    }

    static removeExpense(expense) {
        this.expensesArr.forEach((element, index) =>{
            if(element.id == expense.dataset.id) {
                expense.remove();
                this.expensesArr.splice(index, 1);
            }
        })
        localStorage.setItem('expenses', JSON.stringify(this.expensesArr));
        this.updateBalance();
        this.updateExpense();
    }
    static editExpense(expense) {
        const expenses = JSON.parse(localStorage.getItem('expenses'));
        expenses.forEach((list) => {
            if(list.id == expense.dataset.id){
                const titleInput = document.querySelector('.title-input');
                const amountInput = document.querySelector('.amount-input');
                titleInput.value = list.title;
                amountInput.value = list.amount;
                console.log('Done')
            }
        });
        this.removeExpense(expense);
    }
}


//  Event handlers for the page ----------------------------
const sectionOne = document.querySelector('.grap-info');

sectionOne.addEventListener('submit', (e) => {
    e.preventDefault();
    if(e.target.classList.contains('gudget-form') || e.target.classList.contains('budget-submit')){
        const budgetInput = document.querySelector('.budget-input');
        UI.addBudget(budgetInput);
        budgetInput.value = '';

    }else if(e.target.classList.contains('expenses-form') || e.target.classList.contains('expense-submit')){
        const titleInput = document.querySelector('.title-input');
        const amountInput = document.querySelector('.amount-input');
        UI.addExpense(titleInput.value, amountInput.value);
        titleInput.value = '';
        amountInput.value = '';
    }
});
const sectionTwo = document.querySelector('.show-info');

sectionTwo.addEventListener('click', (e) => {
    if(e.target.classList.contains('trash')){
        console.log('delete');
        UI.removeExpense(e.target.parentElement.parentElement);
    }else if(e.target.classList.contains('edit')){
        console.log('edit');
        UI.editExpense(e.target.parentElement.parentElement);
    }
});

window.addEventListener('load', () => {
    if(localStorage.getItem('budget')){
        UI.updateBudget();
    }else{
        const totalBudget = document.querySelector('.total-budget');
        totalBudget.innerText = 0 ;
    }
    if(localStorage.getItem('expenses')){
        // empty.classList.remove('active')
        let localExpense = JSON.parse(localStorage.getItem('expenses'));
        UI.expensesArr = [...localExpense];
        UI.expensesArr.forEach((expense) =>{
            const expenseList = new List(expense.title, expense.amount, expense.id);
            expenseList.renderExpense();
        })
        UI.updateBalance();
        UI.updateExpense();
    }else{
        UI.expensesArr = []
    }
})


