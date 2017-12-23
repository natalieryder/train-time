// Initialize Firebase
var config = {
apiKey: "AIzaSyCSPKhc6UfQEVqZrmPnf90Ekxxtwyk2Yak",
authDomain: "train-time-70634.firebaseapp.com",
databaseURL: "https://train-time-70634.firebaseio.com",
projectId: "train-time-70634",
storageBucket: "train-time-70634.appspot.com",
messagingSenderId: "777562335142"
};
firebase.initializeApp(config);

var database = firebase.database();

var trainRef = database.ref().child("trains");
var trainsSnapshot = {};

//update the trains variable when it is changed
database.ref("trains").on("value", function(snapshot) {
	trainsSnapshot = snapshot.val();
});

// on submit button click
$("#trainSubmit").on("click", function() {
	event.preventDefault();
	// get the value from the inputs
	var name = $("#trainName").val();
	var destination = $("#destination").val();
	var ftt = $("#firstTrainTime").val();
	var frequency = $("#frequency").val();
	//push a new object to "trains"
	trainRef.push().set({
		name: name,
		destination: destination,
		firstTrainTime: ftt,
		frequency: frequency,
	});
		$("input").val("");
})

function addTrain(train) {
	// the difference betwenn first train and now
	var diff = moment().diff(moment(train.firstTrainTime, 'HH:mm'),'minutes');
	var nextTrain;
	var minutesUntil;
	if (diff < 0) {
		nextTrain = moment(train.firstTrainTime, 'HH:mm a').format('hh:mm a') + " (first)";
		minutesUntil = (moment(train.firstTrainTime, 'HH:mm').diff(moment(),'minutes'));
	} else {
		var mod = diff%train.frequency;

		// time passed since first train minus the remainer from the frequency
		var mult = diff - mod;
		// add mult + one interval length to get next train
		var lastTrain = moment(train.firstTrainTime, 'HH:mm').add(mult ,'minutes').format('hh:mm a');
		// console.log(lastTrain);
		nextTrain = (moment(lastTrain, 'hh:mm a')).add(train.frequency,'minutes').format('hh:mm a');
		// console.log(nextTrain);
		minutesUntil = train.frequency - mod;

	}
 


	// console.log(diff);
	// console.log(mod);
	// console.log(nextTrain);
	
	var trainTime = moment(train.ftt, 'HH:mm')._i; 
	// console.log(trainTime);
	// console.log(moment().add(trainTime));
	var row = $("<tr>");
	var cell = $("<td>");
	var name = $(cell).clone().html(train.name);
	var destination = $(cell).clone().html(train.destination);
	var frequency = $(cell).clone().html(train.frequency);
	var ftt = $(cell).clone().html(train.ftt);
	var nextTrainCell = $(cell).clone().html(nextTrain);
	var	minutesAway = $(cell).clone().html(minutesUntil);

	$(row).append(name).append(destination).append(frequency).append(nextTrainCell).append(minutesAway).appendTo("tbody");

}
$(document).ready(function() {
	database.ref("trains").on("child_added", function(childSnapshot) {
		addTrain(childSnapshot.val());
	});

	//re-add all the trains relative to the current time
	var update = setInterval(function() {
		$("tbody").empty();
		$.each(trainsSnapshot, function(key,value) {
			addTrain(value);
		})
	}, 60000);
});
	


