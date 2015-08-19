var count_castle = 32;
var buildingCastleWidth = 219; //This is not kept half of the castle animated sprite's width because animated sprites were not cut even from both sides while making png from psd.
var buildingCastleHeight = 98;
var FRAME_RATE_CASTLE = 50;
var arr_castle = new Array();
var castle_x;
var castle_y;
var castle_w;
var castle_h;

function initializeBuilding3()
{
	arr_castle[0] = new Bitmap(new BitmapData("img/castle/castle2.png"));
	arr_castle[1] = new Bitmap(new BitmapData("img/castle/castle3.png"));
	arr_castle[2] = new Bitmap(new BitmapData("img/castle/castle4.png"));
	arr_castle[3] = new Bitmap(new BitmapData("img/castle/castle5.png"));
	arr_castle[4] = new Bitmap(new BitmapData("img/castle/castle6.png"));
	arr_castle[5] = new Bitmap(new BitmapData("img/castle/castle7.png"));
	arr_castle[6] = new Bitmap(new BitmapData("img/castle/castle8.png"));
	arr_castle[7] = new Bitmap(new BitmapData("img/castle/castle9.png"));
	arr_castle[8] = new Bitmap(new BitmapData("img/castle/castle10.png"));
	arr_castle[9] = new Bitmap(new BitmapData("img/castle/castle11.png"));
	arr_castle[10] = new Bitmap(new BitmapData("img/castle/castle12.png"));
	arr_castle[11] = new Bitmap(new BitmapData("img/castle/castle13.png"));
	arr_castle[12] = new Bitmap(new BitmapData("img/castle/castle14.png"));
	arr_castle[13] = new Bitmap(new BitmapData("img/castle/castle15.png"));
	arr_castle[14] = new Bitmap(new BitmapData("img/castle/castle16.png"));
	arr_castle[15] = new Bitmap(new BitmapData("img/castle/castle17.png"));
	arr_castle[16] = new Bitmap(new BitmapData("img/castle/castle18.png"));
	arr_castle[17] = new Bitmap(new BitmapData("img/castle/castle19.png"));
	arr_castle[18] = new Bitmap(new BitmapData("img/castle/castle20.png"));
	arr_castle[19] = new Bitmap(new BitmapData("img/castle/castle21.png"));
	arr_castle[20] = new Bitmap(new BitmapData("img/castle/castle22.png"));
	arr_castle[21] = new Bitmap(new BitmapData("img/castle/castle23.png"));
	arr_castle[22] = new Bitmap(new BitmapData("img/castle/castle24.png"));
	arr_castle[23] = new Bitmap(new BitmapData("img/castle/castle25.png"));
	arr_castle[24] = new Bitmap(new BitmapData("img/castle/castle26.png"));
	arr_castle[25] = new Bitmap(new BitmapData("img/castle/castle27.png"));
	arr_castle[26] = new Bitmap(new BitmapData("img/castle/castle28.png"));
	arr_castle[27] = new Bitmap(new BitmapData("img/castle/castle29.png"));
	arr_castle[28] = new Bitmap(new BitmapData("img/castle/castle30.png"));
	arr_castle[29] = new Bitmap(new BitmapData("img/castle/castle31.png"));
	arr_castle[30] = new Bitmap(new BitmapData("img/castle/castle32.png"));
	arr_castle[31] = new Bitmap(new BitmapData("img/castle/castle33.png"));
	
	return arr_castle;
}


function animBuilding3(x, y, counter, actor, body)
{

	// This ensures that this animation is run only once on contact.
	if((counter > 0) || (bodies.indexOf(body) !=-1 && counter == 0))
	{
		var lastBody;
			
		if(counter < count_castle)
		{
			arr_castle[counter].x = - buildingCastleWidth;
			arr_castle[counter].y = - buildingCastleHeight;

			if(counter == 0)
			{
				var fixDef = body.GetFixtureList();
				var userData = fixDef.GetUserData();
				castle_x = userData.originalX;
				castle_y = userData.originalY;
				castle_w = userData.fixtureWidth;
				castle_h = userData.fixtureHeight;

				bodies.splice(bodies.indexOf(body), 1);
				actors.splice(actors.indexOf(actor),1);
				actor.removeChildAt(0);

				lastBody = body;
			}
			else if(counter>0)
			{
	
				actor.removeChild(arr_castle[counter-1]);
				lastBody = replaceBody(castle_x, castle_y, castle_w, castle_h, counter, count_castle);
				world.DestroyBody(body);
			}
			actor.addChild(arr_castle[counter]);
			counter++;
			setTimeout(animBuilding3, FRAME_RATE_CASTLE, x, y, counter, actor, lastBody); 
		}
		else
		{
			world.DestroyBody(body);
		}
	}
}