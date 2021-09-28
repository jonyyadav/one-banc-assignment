
let transactions = [] ;
let date = '';

let months= ["January","February","March","April","May","June","July",
            "August","September","October","November","December"];

let container = document.getElementById('container');
let details = document.getElementById("details");

//Sorting Function
function compare( a, b ) {
  if ( a.startDate < b.startDate ){
    return -1;
  }
  if ( a.startDate > b.startDate ){
    return 1;
  }
  return 0;
}

function showData(){
  $.get("https://dev.onebanc.ai/assignment.asmx/GetTransactionHistory?userId=1&recipientId=2", function (data) {
    transactions = JSON.parse(data).transactions;
    console.log(transactions);


    //Sorting the transaction array based on start time
    transactions.sort(compare);

    //Adding the contact name

    container.innerHTML += `

    <div class="contact">
      <i class="fas fa-arrow-left"></i>
      <div class="profile__icon">
        <p>J</p>
      </div>
      <div class="details">
        <p>John Doe</p>
        <p class="number">+91 7672 2345</p>
      </div>
    </div>
      <hr>
    `;

    //Going through all the transactions and Rendering it.

    transactions.forEach((transaction, i) => {
      let date_local = transaction.startDate.split("T")[0];
      let time = transaction.startDate.split("T")[1];



      //displaying the date

      if(date != date_local){
        date = date_local
        let splittedDate = date.split("-")
        let properDate = splittedDate[2]+" "+months[parseInt(splittedDate[1][1])-1]+" "+splittedDate[0];
        container.innerHTML +=
        `
        <div class="Date">
          <p>${properDate}</p>
        </div>
        `;
      }


      //If We Initiate the transaction


      if(transaction.direction == 1){

        //Getting all the details


        let payload = {
          amount : transaction.amount,
        }

        if(transaction.type == 1){
          payload.message = "You paid"
        }
        else {
          payload.message = "You Requested"
        }

        if(transaction.status == 1){
          payload.buttons = `<a href="#">Cancel</a>`
        }
        else{
          payload.buttons = `<p>Transcation Id : </p> <p>${transaction.id}</p>`;
        }

        //Write the details to the DOM

        container.innerHTML +=
        `
        <div class="sent" onclick='showMoreDetails(${i})'>
        <div class="transaction__details">
          <div class="row">
          <div class="amount">
          <h2>&#8377;${payload.amount}</h2>
          </div>
          <div class="status">
            <p>${payload.message}</p>
          </div>
          </div>
          <div class="row">
            <div class="actions">
              ${payload.buttons}
            </div>
            <div class="more__details" >
              <i class="fas fa-chevron-right"></i>
            </div>
          </div>
          </div>
          <div class="timing">
            <p>${time}</p>
          </div>
        </div>
          `;
      }

      //If the other person initiate the transaction

      else {
        let payload = {
          amount : transaction.amount,
        }

        if(transaction.type == 1){
          payload.message = "You Received"
        }
        else {
          payload.message = "Request Received"
        }

        if(transaction.status == 1){
          payload.buttons = `<a href="#">Pay</a> <a href="#">Decline</a>`
        }
        else{
          payload.buttons = `<p>Transcation Id : </p> <p>${transaction.id}</p>`;
        }

        container.innerHTML +=`
        <div class="received" onclick='showMoreDetails(${i})'>
          <div class="transaction__details">
            <div class="row">
            <div class="amount">
              <h2>&#8377;${payload.amount}</h2>
            </div>
            <div class="status">
              <p>${payload.message}</p>
            </div>
          </div>
          <div class="row">
            <div class="actions">
              ${ payload.buttons}
            </div>
            <div class="more__details">
              <i class="fas fa-chevron-right"></i>
            </div>
          </div>
          </div>
          <div class="timing">
            <p>${time}</p>
          </div>
        </div>
        `;
      }


    });

  })
}




function showMoreDetails(index){
  container.style.display = "none";

  let transaction = transactions[index];
  let date = transaction.startDate.split("T")[0];
  let splittedDate = date.split("-")
  let properDate = splittedDate[2]+" "+months[parseInt(splittedDate[1][1])-1]+" "+splittedDate[0];
  let time = transaction.startDate.split("T")[1];
  let message ;


  if(transaction.direction == 1){
    if(transaction.type == 1){
      message = "You paid"
    }
    else {
      message = "You Requested"
    }
  }
  else {
    if(transaction.type == 1){
      message = "You Received"
    }
    else {
      message = "Request Received"
    }
  }


  if(transaction.description.length == 0){
    transaction.description = "NA"
  }
  details.innerHTML = `
    <p>Transcation id : ${transaction.id}</p>
    <p>Action : ${message}</p>
    <p>Amount : ${transaction.amount}</p>
    <p>Time : ${time + "  " + properDate} </p>
    <p class="lastP">Description : ${transaction.description} </p>
    <a href="#" class="button" onclick="goBack()">Back</a>
  `;

  details.style.display = 'block'
}


function goBack(){
  details.style.display = 'none';
  container.style.display = 'block';
}
showData()
