

// d3.select("canvas").on("mousemove", function() {
// 	console.log(d3.mouse(this));
// })


var tooltipText = {
	l1: "title",
	l2: "subtitle"
}


function showTooltip(index) {
	console.log("index:", i, objectMetadata[index]);
	
	var title = objectMetadata[index].title
	var alt = objectMetadata[index]["alt-title"];
	
	console.log(alt);
	console.log(title)

	tooltipP1.text(title);
	tooltipP2.text(alt);

	tooltip.attr("visibility", "visible");
	// .style("top", 20)
	// .style("left", 14);



}


function hideTooltip() {
	// console.log("hide tooltip");
	tooltip.attr("visibility", "hidden");
}