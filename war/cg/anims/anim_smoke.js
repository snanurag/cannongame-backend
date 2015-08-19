var count_smoke = 15;
var smokeHalfWidth = 350;
var smokeHalfHeight = 350;
var smokeFixWidth = 1.4;
var smokeFixHeight = 1.4;

var arr_smoke = new Array();

function initializeSmoke()
{
	arr_smoke[0] = new Bitmap(new BitmapData("img/smoke/smoke1.png"));
	arr_smoke[1] = new Bitmap(new BitmapData("img/smoke/smoke2.png"));
	arr_smoke[2] = new Bitmap(new BitmapData("img/smoke/smoke3.png"));
	arr_smoke[3] = new Bitmap(new BitmapData("img/smoke/smoke4.png"));
	arr_smoke[4] = new Bitmap(new BitmapData("img/smoke/smoke5.png"));
	arr_smoke[5] = new Bitmap(new BitmapData("img/smoke/smoke6.png"));
	arr_smoke[6] = new Bitmap(new BitmapData("img/smoke/smoke7.png"));
	arr_smoke[7] = new Bitmap(new BitmapData("img/smoke/smoke8.png"));
	arr_smoke[8] = new Bitmap(new BitmapData("img/smoke/smoke9.png"));
	arr_smoke[9] = new Bitmap(new BitmapData("img/smoke/smoke10.png"));
	arr_smoke[10] = new Bitmap(new BitmapData("img/smoke/smoke11.png"));
	arr_smoke[11] = new Bitmap(new BitmapData("img/smoke/smoke12.png"));
	arr_smoke[12] = new Bitmap(new BitmapData("img/smoke/smoke13.png"));
	arr_smoke[13] = new Bitmap(new BitmapData("img/smoke/smoke14.png"));
	arr_smoke[14] = new Bitmap(new BitmapData("img/smoke/smoke15.png"));
}

function animSmoke(x, y, counter, actor, angle)
{
	if(counter<count_smoke)
	{
		arr_smoke[counter].x = -smokeHalfWidth;
		arr_smoke[counter].y = -smokeHalfHeight;
		if(counter == 0)
		{
			actor.scaleX = smokeFixWidth*SCALE/smokeHalfWidth;
			actor.scaleY = smokeFixHeight*SCALE/smokeHalfHeight;
			actor.x = x;
			actor.y = y;
			actor.rotation = angle*180/Math.PI;
			stage.addChild(actor);
		}

		if(counter > 0)
		{
			actor.removeChild(arr_smoke[counter-1]);
		}
		actor.addChild(arr_smoke[counter]);
		counter++;
		setTimeout(animSmoke, 70, x, y, counter, actor, angle); 
	}
	else
	{
		stage.removeChild(actor);
	}

}