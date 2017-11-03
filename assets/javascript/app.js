var config = {
	apiKey: "AIzaSyDNRPB9UfXd9kaHq42GlnNrh7Eu58D2XWg",
	authDomain: "train-scheduler-af06a.firebaseapp.com",
	databaseURL: "https://train-scheduler-af06a.firebaseio.com",
	projectId: "train-scheduler-af06a",
	storageBucket: "",
	messagingSenderId: "105699376771"
};
firebase.initializeApp(config);

var database = firebase.database();

$("#submit-button").on("click", function() {
	var trainName = $("#train-name").val().trim();
	var trainDestination = $("#train-destination").val().trim();
	var trainFirstTime = $("#train-first-time").val().trim();
	var trainFrequency = $("#train-frequency").val().trim();
	if(trainName && trainDestination && trainFirstTime && trainFrequency) {
		database.ref().push({
			trainName: trainName,
			trainDestination: trainDestination,
			trainFirstTime: trainFirstTime,
			trainFrequency: trainFrequency
		});
		$("#train-name").val("");
		$("#train-destination").val("");
		$("#train-first-time").val("");
		$("#train-frequency").val("");
	}
	else {
		console.log("Missing field");
	}
});

database.ref().on("child_added", function(snapshot) {
	displayTrain(snapshot.val());
	}, function(errorObject) {
	console.log("The read failed: " + errorObject.code);
});

function displayTrain(data) {
	var arrivalData = getArrivalData(data.trainFirstTime, data.trainFrequency);
	var $row = $("<tr>");
	$row.append($("<td>").text(data.trainName))
		.append($("<td>").text(data.trainDestination))
		.append($("<td>").text(data.trainFrequency))
		.append($("<td>").text(arrivalData.nextTime))
		.append($("<td>").text(arrivalData.minutesAway));
	$("tbody").append($row);
}

function getArrivalData(firstTime, frequency) {
	var data = {};
	var arrival = new Date();
	arrival.setHours(firstTime.split(":")[0], firstTime.split(":")[1]);
	var now = new Date();
	//if arrival is in the past, add frequency to arrival until the result is in the future
	while (arrival.getTime() < now.getTime()) {
		arrival.setTime(arrival.getTime() + (frequency * 60 * 1000));
	}
	//minutesAway is the difference between arrival and now
	data.minutesAway = Math.round((arrival.getTime() - now.getTime()) / 60 / 1000);
	var arrivalHour = prependZero(arrival.getHours().toString());
	var arrivalMinute = prependZero(arrival.getMinutes().toString());
	data.nextTime = arrivalHour + ":" + arrivalMinute;
	return data;
}

function prependZero(s) {
	if (s.length === 1) {
		s = "0" + s;
	}
	return s;
}