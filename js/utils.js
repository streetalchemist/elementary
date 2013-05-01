var util = {};

util.intersects = function(box1, box2) {
    if (box1.x < box2.x+box2.width && box1.x+box1.width > box2.x &&
    box1.y < box2.y+box2.height && box1.y+box1.height > box2.y) {
      return true;
    }  else {
      return false
    }
};

//Returns the side of BOX1 that is closest to the edge of BOX2, theoretically meaning that it's the side that hit first
util.getIntersectingSide = function(box1, box2) {
	var northAmt 	= (box2.y+box2.height) - box1.y; //North side intersection amount
	var eastAmt 	= (box1.x+box1.width) - box2.x; //East side intersection amount
	var southAmt 	= (box1.y+box1.height) - box2.y; //South side intersection amount
	var westAmt 	= (box2.x+box2.width) - box1.x; //West side intersection amount

	var leastAmt = northAmt;
	var direction = "north";
	if(eastAmt <= leastAmt) {
		direction = "east";
		leastAmt = eastAmt;
	}
	if(southAmt <= leastAmt) {
		direction = "south";
		leastAmt = southAmt;
	}
	if(westAmt <= leastAmt) {
		direction = "west";
		leastAmt = westAmt;
	}
	return direction;
};