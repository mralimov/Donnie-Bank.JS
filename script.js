'use strict';
// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-11-27T17:01:17.194Z',
    '2020-12-01T23:36:17.929Z',
    '2020-12-02T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-11-27T17:01:17.194Z',
    '2020-12-01T23:36:17.929Z',
    '2020-12-02T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT',
};

const accounts = [account1, account2, account3, account4];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = (account, sort = false) => {
  //TextContent = 0
  containerMovements.innerHTML = '';

  //movements.slice() because we ca not touch original array, That's why we create copy of that aray to sort with slice() method.
  const movSort = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;

  movSort.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(account.movementsDates[i]);
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();
    const displayDate = `${day}/${month}/${year}`;

    const html = `
    <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__date">${displayDate}</div>
           <div class="movements__value">${mov.toFixed(2)}€</div>
        </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = acc => {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
};

const calcTransSummary = account => {
  const depositsTotal = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${depositsTotal.toFixed(2)}€`;

  const withdrawalsTotal = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${withdrawalsTotal.toFixed(2)}€`;

  const interestPaid = account.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * 1.2) / 100)
    .filter(mov => mov > 0)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interestPaid.toFixed(2)}€`;
};

const createUsernames = accs => {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUsernames(accounts);

const updateUI = function (account) {
  //Display movements
  calcTransSummary(account);

  //Display balance
  calcDisplayBalance(account);

  //Display summary
  displayMovements(account);
};

let currentAccount;

//Fake Always logged in
currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 100;

//Event handler
btnLogin.addEventListener('click', e => {
  e.preventDefault();

  currentAccount = accounts.find(
    account => account.username === inputLoginUsername.value
  );

  console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    //Current Date and time
    const now = new Date();
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();
    const hour = now.getHours();
    const min = now.getMinutes();
    const displayDate = `${day}/${month}/${year}, ${hour}:${min}`;

    //Clear inout fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //Update UI
    updateUI(currentAccount);
  } else {
    inputLoginUsername.value = inputLoginPin.value = '';
    alert(`Please check Login or Passowrd information`);
  }
});

//Transfer money funtion
btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const recieverAccount = accounts.find(
    account => account.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  //
  if (
    amount > 0 &&
    //this will give an undefined if account does not exist below.
    recieverAccount &&
    //optional chaining "?" symbol checking if that property exist or not
    currentAccount.balance >= amount &&
    recieverAccount?.username !== currentAccount.username
  ) {
    //Doing the Transfer money
    currentAccount.movements.push(-amount);
    recieverAccount.movements.push(amount);

    //Add transfer date
    currentAccount.movementsDates.push(new Date());
    recieverAccount.movementsDates.push(new Date());

    updateUI(currentAccount);
  }
});

//Request loan function
btnLoan.addEventListener('click', e => {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    //Add money in account
    currentAccount.movements.push(amount);

    //Add transfer date
    currentAccount.movementsDates.push(new Date());

    //Update UI
    updateUI(currentAccount);
  } else {
    alert(
      `Sorry! Your income deposits not 10% of requesting amount. Please request lower amount!`
    );
  }

  //Clear input value
  inputLoanAmount.value = '';
});

//DELETE the ACCOUNT function
btnClose.addEventListener('click', e => {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      el => el.username === currentAccount.username
    );
    //Deletes acoount
    accounts.splice(index, 1);

    //Hides UI
    containerApp.style.opacity = 0;
  }
  //Clears input values
  inputCloseUsername.value = inputClosePin.value = '';
});
// const totalBalance = movements.reduce((acc, mov) => acc + mov, 0);

// State variable let sorted = false because at the beginning arrays not sorted
let sorted = false;

//Calling Movements SORT method
btnSort.addEventListener('click', e => {
  e.preventDefault();

  displayMovements(currentAccount.movements, !sorted);

  //because if array sorted it will go false or not sorted it will go true
  sorted = !sorted;
});

// labelBalance.addEventListener('click', () => {
//   const movementUI = Array.from(
//     document.querySelectorAll('.movements__value'),
//     el => +(el.textContent.replace('€', ''))
//   );
//   console.log(movementUI);
// });
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

//This method to get numbers between Min Max/
const twoNumDifferent = (min, max) =>
  Math.trunc(Math.random() * (max - min) + 1) + min;

console.log(twoNumDifferent(2, 9));

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

const max = movements.reduce((acc, mov) => {
  if (acc > mov) return acc;
  else return mov;
}, movements[0]);

console.log(max);

//USD EURO Conversion
const euroToUSD = 1.1;
const totalDepositsUSD = movements
  .filter(mov => mov > 0)
  .map(mov => mov * euroToUSD)
  .reduce((acc, mov) => acc + mov);
console.log(Math.floor(totalDepositsUSD));
