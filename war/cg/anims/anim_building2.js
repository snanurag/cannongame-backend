var count_lighthouse = 32;
var buildingWidthLightHouse = 116;
var buildingHeightLightHouse = 123;
var FRAME_RATE_LIGHT_HOUSE = 50;
var arr_lighthouse = new Array();
var lighthouse_x;
var lighthouse_y;
var lighthouse_w;
var lighthouse_h;

function initializeBuilding2()
{
	arr_lighthouse[0] = new Bitmap(new BitmapData("img/lighthouse/lighthouse_2.png"));
	arr_lighthouse[1] = new Bitmap(new BitmapData("img/lighthouse/lighthouse_3.png"));
	arr_lighthouse[2] = new Bitmap(new BitmapData("img/lighthouse/lighthouse_4.png"));
	arr_lighthouse[3] = new Bitmap(new BitmapData("img/lighthouse/lighthouse_5.png"));
	arr_lighthouse[4] = new Bitmap(new BitmapData("img/lighthouse/lighthouse_6.png"));
	arr_lighthouse[5] = new Bitmap(new BitmapData("img/lighthouse/lighthouse_7.png"));
	arr_lighthouse[6] = new Bitmap(new BitmapData("img/lighthouse/lighthouse_8.png"));
	arr_lighthouse[7] = new Bitmap(new BitmapData("img/lighthouse/lighthouse_9.png"));
	arr_lighthouse[8] = new Bitmap(new BitmapData("img/lighthouse/lighthouse_10.png"));
	arr_lighthouse[9] = new Bitmap(new BitmapData("img/lighthouse/lighthouse_11.png"));
	arr_lighthouse[10] = new Bitmap(new BitmapData("img/lighthouse/lighthouse_12.png"));
	arr_lighthouse[11] = new Bitmap(new BitmapData("img/lighthouse/lighthouse_13.png"));
	arr_lighthouse[12] = new Bitmap(new BitmapData("img/lighthouse/lighthouse_14.png"));
	arr_lighthouse[13] = new Bitmap(new BitmapData("img/lighthouse/lighthouse_15.png"));
	arr_lighthouse[14] = new Bitmap(new BitmapData("img/lighthouse/lighthouse_16.png"));
	arr_lighthouse[15] = new Bitmap(new BitmapData("img/lighthouse/lighthouse_17.png"));
	arr_lighthouse[16] = new Bitmap(new BitmapData("img/lighthouse/lighthouse_18.png"));
	arr_lighthouse[17] = new Bitmap(new BitmapData("img/lighthouse/lighthouse_19.png"));
	arr_lighthouse[18] = new Bitmap(new BitmapData("img/lighthouse/lighthouse_20.png"));
	arr_lighthouse[19] = new Bitmap(new BitmapData("img/lighthouse/lighthouse_21.png"));
	arr_lighthouse[20] = new Bitmap(new BitmapData("img/lighthouse/lighthouse_22.png"));
	arr_lighthouse[21] = new Bitmap(new BitmapData("img/lighthouse/lighthouse_23.png"));
	arr_lighthouse[22] = new Bitmap(new BitmapData("img/lighthouse/lighthouse_24.png"));
	arr_lighthouse[23] = new Bitmap(new BitmapData("img/lighthouse/lighthouse_25.png"));
	arr_lighthouse[24] = new Bitmap(new BitmapData("img/lighthouse/lighthouse_26.png"));
	arr_lighthouse[25] = new Bitmap(new BitmapData("img/lighthouse/lighthouse_27.png"));
	arr_lighthouse[26] = new Bitmap(new BitmapData("img/lighthouse/lighthouse_28.png"));
	arr_lighthouse[27] = new Bitmap(new BitmapData("img/lighthouse/lighthouse_29.png"));
	arr_lighthouse[28] = new Bitmap(new BitmapData("img/lighthouse/lighthouse_30.png"));
	arr_lighthouse[29] = new Bitmap(new BitmapData("img/lighthouse/lighthouse_31.png"));
	arr_lighthouse[30] = new Bitmap(new BitmapData("img/lighthouse/lighthouse_32.png"));
	arr_lighthouse[31] = new Bitmap(new BitmapData("img/lighthouse/lighthouse_33.png"));

}

function animBuilding2(x, y, counter, actor, body)
{
	// This ensures that this animation is run only once on contact.
	if((counter > 0) || (bodies.indexOf(body) !=-1 && counter == 0))
	{
		var lastBody;
			
		if(counter < count_lighthouse)
		{
			arr_lighthouse[counter].x = - buildingWidthLightHouse;
			arr_lighthouse[counter].y = - buildingHeightLightHouse;

			if(counter == 0)
			{
				var fixDef = body.GetFixtureList();
				var userData = fixDef.GetUserData();
				lighthouse_x = userData.originalX;
				lighthouse_y = userData.originalY;
				lighthouse_w = userData.fixtureWidth;
				lighthouse_h = userData.fixtureHeight;

				bodies.splice(bodies.indexOf(body), 1);
				actors.splice(actors.indexOf(actor),1);
				actor.removeChildAt(0);

				lastBody = body;
			}
			else if(counter > 0)
			{
	
				actor.removeChild(arr_lighthouse[counter-1]);
				lastBody = replaceBody(lighthouse_x, lighthouse_y, lighthouse_w, lighthouse_h, counter, count_lighthouse);
				world.DestroyBody(body);
			}
			actor.addChild(arr_lighthouse[counter]);
			counter++;
			setTimeout(animBuilding2, FRAME_RATE_LIGHT_HOUSE, x, y, counter, actor, lastBody); 
		}
		else
		{
			world.DestroyBody(body);
		}
	}
}