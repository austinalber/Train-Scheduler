// Initialize Firebase
var firebaseConfig = {
    apiKey: "AIzaSyA9xG2gqEQadEXlELaiviXxIGubj92JWKc",
    authDomain: "trainscheduler-dac62.firebaseapp.com",
    databaseURL: "https://trainscheduler-dac62.firebaseio.com",
    projectId: "trainscheduler-dac62",
    storageBucket: "",
    messagingSenderId: "281810703705",
    appId: "1:281810703705:web:e03028492835f543"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

var dataRef = firebase.database();

// Initialize Values
var name = "";
var destination = "";
var firstTrainTime = "";
var frequency = 0;

// Calculation Function to determine minutes left
function calculations(firstTrainTime, frequency){

    // Get Both Current Time and First Train Time in HH:mm
    var now = moment(new Date()).format("HH:mm"); //todays date
    var end = moment(firstTrainTime, "HH:mm").format("HH:mm"); // another date

    // Split the two times and turn them into arrays with 2 point
    var nowArray = now.split(":");
    var endArray = end.split(":"); 
    console.log("nowArray: " + nowArray); // 19:01 returns ["18", "53"]
    console.log("endArray: " + endArray); // 12:15

    // Find Difference between times

    // If the minutes of the first arrival is greater than the minutes of the
    // current time: subtract the difference and account for 60min per hour
    endArray[1]= endArray[1]-nowArray[1];
    endArray[0]= endArray[0]-nowArray[0];
    console.log("New endArray: " + endArray);

    if(endArray[0] < 0) {
        endArray[0] = Math.abs(endArray[0]);
    }
    if(endArray[1] < 0) {
        endArray[1] = Math.abs(endArray[1]);
    }

    console.log("endArray after Math.abs: " + endArray);

    // While there is greater than 1 hour of time between the first arrival,
    // remove a hour from the time and add in minutes
    while(endArray[0] > 0)  {
        endArray[0] = endArray[0] - 1;
        endArray[1] = endArray[1] + 60;
    }

    console.log("endArray after while statement: " + endArray);

    // Set the amount of minutes to a variable
    var minutesRemaining = endArray[1];
    console.log("Minutes Remaining until next Train: " + minutesRemaining);
        
    return minutesRemaining;
}

$("#submit").on("click", function(event)  {
        event.preventDefault();

        // Grab from Form
        name = $("#trainName").val().trim();
        destination = $("#destination").val().trim();
        firstTrainTime = $("#firstTrainTime").val().trim();
        frequency = $("#frequency").val().trim();

        // Code for the push
        dataRef.ref().push({

        name: name,
        destination: destination,
        firstTrainTime: firstTrainTime,
        frequency: frequency,
        });

        $("#trainName").val("");
        $("#destination").val("");
        $("#firstTrainTime").val("");
        $("#frequency").val("");
    });

// Firebase water + initial loader
dataRef.ref().on("child_added", function(childSnapshot) {

    // Save snapshot object as a variable
    var sv = childSnapshot.val();

    // Grab info from Calculations
    minutesRemaining = calculations(sv.firstTrainTime, sv.frequency, sv.dateAdded);

    // // Log everything that's coming out of snapshot
    // console.log("Name: " + sv.name);
    // console.log("Destination: " + sv.destination);
    // console.log("First Train Time: " + sv.firstTrainTime);
    // console.log("Frequency: " + sv.frequency);

    // Template Variable
    var newEntry = `
    <tr>
        <td>${sv.name}</td>
        <td>${sv.destination}</td>
        <td>${sv.frequency}</td>
        <td>${sv.nextArrival}</td>
        <td>${minutesRemaining}</td>
    </tr>
    `

    // Push Template to Table
    $("#trainInfo").append(newEntry);

    });