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

function addTrain(train, key) {
	// the difference betwenn first train and now
	
	var row = $("<tr>").attr("id",key);
	
	$(row).appendTo("tbody");

	editTrain(train,key);

}

function editTrain(train, key) {

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
 
	var trainTime = moment(train.ftt, 'HH:mm')._i; 
	var row = $("#" + key);
	// make it empty
	$(row).empty();
	// add the cells

	var cell = $("<td>");
	var name = $(cell).clone().html(train.name);
	var destination = $(cell).clone().html(train.destination);
	var frequency = $(cell).clone().html(train.frequency);
	var ftt = $(cell).clone().html(train.ftt);
	var nextTrainCell = $(cell).clone().html(nextTrain);
	var	minutesAway = $(cell).clone().html(minutesUntil);
	var editButton = $("<button>").attr("data-key",key).attr("id",key).text("edit").addClass("edit");
	var edit =  $(cell).clone().append(editButton);

	$(row).append(name).append(destination).append(frequency).append(nextTrainCell).append(minutesAway).append(edit);


}
function updateCells() {

}

$(document).on("click", ".edit", function() {
	var key = $(this).data("key");
	var row = $(this).parents("tr");
	console.log(row);
	$(row[0].children[0]).html("<input type='text' class='form-control' id='editTrainName' placeholder='Train Name' value='" + trainsSnapshot[key].name + "'>");
	$(row[0].children[1]).html("<input type='text' class='form-control' id='editTrainDestination' placeholder='Train Name' value='" + trainsSnapshot[key].destination + "'>");
	$(row[0].children[3]).html("<input type='time' class='form-control' id='editTrainStart' placeholder='Train Name' value='" + trainsSnapshot[key].firstTrainTime + "'>");
	$(row[0].children[5]).html("<button class='update' data-key='" + key +"'> update </button>");
	editTrain(key);
});

$(document).on("click", ".update", function() {
	var key = $(this).data("key");
	var newName = $("#editTrainName").val();
	var newDestination = $("#editTrainDestination").val();
	var newStart = $("#editTrainStart").val();

	console.log(newName +  newDestination + newStart);

	database.ref("trains").child(key).update({
		name: newName,
		destination: newDestination,
		firstTrainTime: newStart,
	})


});


$(document).ready(function() {
	database.ref("trains").on("child_added", function(childSnapshot) {
		addTrain(childSnapshot.val(),childSnapshot.key);
	});

	database.ref("trains").on("child_changed", function(childSnapshot) {
		editTrain(childSnapshot.val(),childSnapshot.key);

	});

	

	//re-add all the trains relative to the current time
	var update = setInterval(function() {
		$("tbody").empty();
		$.each(trainsSnapshot, function(key,value) {
			addTrain(value,key);
		})
	}, 60000);
});
	


