  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyC0s3nDaC_z6cbqn_c5EcAxqv0cKwwh6y0",
    authDomain: "train-scheduler-dc5f7.firebaseapp.com",
    databaseURL: "https://train-scheduler-dc5f7.firebaseio.com",
    projectId: "train-scheduler-dc5f7",
    storageBucket: "train-scheduler-dc5f7.appspot.com",
    messagingSenderId: "296193772862"
  };
  firebase.initializeApp(config);

var trainData = firebase.database().ref();
//Current time
$("#currentTime").append(moment().format("hh:mm A"));


$("#addTrainBtn").on("click", function() {
    event.preventDefault();

    var trainName = $("#trainNameInput").val().trim();
    var destination = $("#destinationInput").val().trim();
    var firstTrain = moment($("#firstTrainInput").val().trim(), "HH:mm").subtract(10, "years").format("X");
    var frequency = $("#frequencyInput").val().trim();

    // Object
    var newTrain = {
        name: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency
    }

    trainData.push(newTrain);

    alert(newTrain.name + " has been successfully added");

    $("#trainNameInput").val("");
    $("#destinationInput").val("");
    $("#firstTrainInput").val("");
    $("#frequencyInput").val("");

    return false;
});

trainData.on("child_added", function(childSnapshot) {

    let data = childSnapshot.val();
    let trainNames = data.name;
    let trainDestin = data.destination;
    let trainFrequency = data.frequency;
    let theFirstTrain = data.firstTrain;
    console.log(theFirstTrain);

    let tRemainder = moment().diff(moment.unix(theFirstTrain), "minutes") % trainFrequency;
    let tMinutes = trainFrequency - tRemainder;

    // Add the tMinutes to the currrent time, to calculate arrival time.
    let tArrival = moment().add(tMinutes, "m").format("hh:mm A");

    // Add each train's data into the table 
    $("#trainTable > tbody").append("<tr><td>" + trainNames + "</td><td>" + trainDestin + "</td><td class='min'>" + trainFrequency + "</td><td class='min'>" + tArrival + "</td><td class='min'>" + tMinutes + "</td></tr>");

});