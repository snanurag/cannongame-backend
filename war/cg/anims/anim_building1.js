var count_tower = 31;
var buildingWidthTower = 160;
var buildingHeightTower = 97;
var FRAME_RATE_TOWER = 50;
var arr_tower = new Array();
var tower_x;
var tower_y;
var tower_w;
var tower_h;
//var lastBody;

function initializeBuilding1()
{
	arr_tower[0] = new Bitmap(new BitmapData("img/tower/tower_3.png"));
	arr_tower[1] = new Bitmap(new BitmapData("img/tower/tower_4.png"));
	arr_tower[2] = new Bitmap(new BitmapData("img/tower/tower_5.png"));
	arr_tower[3] = new Bitmap(new BitmapData("img/tower/tower_6.png"));
	arr_tower[4] = new Bitmap(new BitmapData("img/tower/tower_7.png"));
	arr_tower[5] = new Bitmap(new BitmapData("img/tower/tower_8.png"));
	arr_tower[6] = new Bitmap(new BitmapData("img/tower/tower_9.png"));
	arr_tower[7] = new Bitmap(new BitmapData("img/tower/tower_10.png"));
	arr_tower[8] = new Bitmap(new BitmapData("img/tower/tower_11.png"));
	arr_tower[9] = new Bitmap(new BitmapData("img/tower/tower_12.png"));
	arr_tower[10] = new Bitmap(new BitmapData("img/tower/tower_13.png"));
	arr_tower[11] = new Bitmap(new BitmapData("img/tower/tower_14.png"));
	arr_tower[12] = new Bitmap(new BitmapData("img/tower/tower_15.png"));
	arr_tower[13] = new Bitmap(new BitmapData("img/tower/tower_16.png"));
	arr_tower[14] = new Bitmap(new BitmapData("img/tower/tower_17.png"));
	arr_tower[15] = new Bitmap(new BitmapData("img/tower/tower_18.png"));
	arr_tower[16] = new Bitmap(new BitmapData("img/tower/tower_19.png"));
	arr_tower[17] = new Bitmap(new BitmapData("img/tower/tower_20.png"));
	arr_tower[18] = new Bitmap(new BitmapData("img/tower/tower_21.png"));
	arr_tower[19] = new Bitmap(new BitmapData("img/tower/tower_22.png"));
	arr_tower[20] = new Bitmap(new BitmapData("img/tower/tower_23.png"));
	arr_tower[21] = new Bitmap(new BitmapData("img/tower/tower_24.png"));
	arr_tower[22] = new Bitmap(new BitmapData("img/tower/tower_25.png"));
	arr_tower[23] = new Bitmap(new BitmapData("img/tower/tower_26.png"));
	arr_tower[24] = new Bitmap(new BitmapData("img/tower/tower_27.png"));
	arr_tower[25] = new Bitmap(new BitmapData("img/tower/tower_28.png"));
	arr_tower[26] = new Bitmap(new BitmapData("img/tower/tower_29.png"));
	arr_tower[27] = new Bitmap(new BitmapData("img/tower/tower_30.png"));
	arr_tower[28] = new Bitmap(new BitmapData("img/tower/tower_31.png"));
	arr_tower[29] = new Bitmap(new BitmapData("img/tower/tower_32.png"));
	arr_tower[30] = new Bitmap(new BitmapData("img/tower/tower_33.png"));
	
}

function animBuilding1(x, y, counter, actor, body)
{
	// This ensures that this animation is run only once on contact.
	if((counter > 0) || (bodies.indexOf(body) !=-1 && counter == 0))
	{
		var lastBody;
			
		if(counter<count_tower)
		{
			arr_tower[counter].x = - buildingWidthTower;
			arr_tower[counter].y = - buildingHeightTower;

			if(counter == 0)
			{
				var fixDef = body.GetFixtureList();
				var userData = fixDef.GetUserData();
				tower_x = userData.originalX;
				tower_y = userData.originalY;
				tower_w = userData.fixtureWidth;
				tower_h = userData.fixtureHeight;

				bodies.splice(bodies.indexOf(body), 1);
				actors.splice(actors.indexOf(actor),1);
				actor.removeChildAt(0);

				lastBody = body;
			}
			else if(counter>0)
			{
	
				actor.removeChild(arr_tower[counter-1]);
				lastBody = replaceBody(tower_x, tower_y, tower_w, tower_h, counter, count_tower);
				world.DestroyBody(body);
			}
			actor.addChild(arr_tower[counter]);
			counter++;
			setTimeout(animBuilding1, FRAME_RATE_TOWER, x, y, counter, actor, lastBody); 
		}
		else
		{
			world.DestroyBody(body);
		}
	}
}
