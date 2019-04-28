module.exports = {
	findError: function (error) {
		if (error === "User does not exist") {
			var x = document.getElementsByClassName("error");
			x[0].innerHTML = "not found";
		}
	}
}