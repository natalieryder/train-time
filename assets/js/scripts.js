$("#trainSubmit").on("click", function() {
	event.preventDefault();
	var train = {};
	train.name = $("#trainName").val();
	train.destination = $("#destination").val();
	train.ftt = $("#firstTrainTime").val();
	train.frequency = $("#frequency").val();
	addTrain(train);
})
$("#firstTrainTime").val("20:10");
$("#frequency").val("15");
function addTrain(train) {
	console.log(train);
	// the difference betwenn first train and now
	var diff = moment().diff(moment(train.ftt, 'HH:mm'),'minutes');

	// time passed since first train minus the remainer
	var mod = diff%train.frequency;
	var mult = diff - mod;
	// add mult + one interval length
	var nextTrain = moment(train.ftt, 'HH:mm').add(mult ,'minutes').add(train.frequency,'minutes').format('hh:mm a');


	console.log(diff);
	console.log(mod);
	console.log(nextTrain);
	
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
	var	minutesAway = $(cell).clone().html(mod);

	$(row).append(name).append(destination).append(frequency).append(nextTrainCell).append(minutesAway).appendTo("tbody");

	$("input").val("");

}
	
	var randomDate = "02/23/1999";
    var randomFormat = "MM/DD/YYYY";
    var convertedDate = moment(randomDate, randomFormat);
      console.log("converted date:", convertedDate);