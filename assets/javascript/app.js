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
    
    // Calculations
    var timeConversion = moment(childSnapshot.val().firstTrainTime, "hh:mm").subtract(1, "years");
    var timeDifference = moment().diff(moment(timeConversion), "minutes");
    var minutesRemaining = timeDifference % childSnapshot.val().frequency;
    var minutesRemaining = childSnapshot.val().frequency - minutesRemaining;
    var nextArrival = moment().add(minutesRemaining, "minutes");
    nextArrival = moment(nextArrival).format("LT");

    // // Log everything that's coming out of snapshot
    console.log("Name: " + sv.name);
    console.log("Destination: " + sv.destination);
    console.log("First Train Time: " + sv.firstTrainTime);
    console.log("Frequency: " + sv.frequency);
    console.log("Next Arrival: " + nextArrival);
    console.log("Minutes Remaining: " + minutesRemaining);

    // Template Variable
    var newEntry = `
    <tr>
        <td class="text-center">${sv.name}</td>
        <td class="text-center">${sv.destination}</td>
        <td class="text-center">${sv.frequency}</td>
        <td class="text-center">${nextArrival}</td>
        <td class="text-center">${minutesRemaining}</td>
    </tr>
    `

    // Push Template to Table
    $("#trainInfo").append(newEntry);

    });