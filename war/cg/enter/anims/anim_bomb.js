var count_tower = 22;
var bombWidth = 50 * window.devicePixelRatio;
var bombHeight = 50 * window.devicePixelRatio;
var FRAME_RATE_BOMB = 50;
var w = window.innerWidth * window.devicePixelRatio;
var h = window.innerHeight * window.devicePixelRatio;

var arr_bomb = new Array();

	var listeners = ['onMD1', 'onMD2', 'onMD3', 'onMD4', 'onMD5', 'onMD6', 'onMD7', 'onMD8', 'onMD9', 'onMD10', 'onMD11', 'onMD12', 'onMD13', 'onMD14', 'onMD15', 'onMD16', 'onMD17', 'onMD18', 'onMD19', 'onMD20'];
	var stagesX = [w/8, 3*w/8, 5*w/8, 7*w/8, w/8, 3*w/8, 5*w/8, 7*w/8, w/8, 3*w/8, 5*w/8, 7*w/8, w/8, 3*w/8, 5*w/8, 7*w/8, w/8, 3*w/8, 5*w/8, 7*w/8, w/8, 3*w/8, 5*w/8, 7*w/8];
	var stagesY = [h/4, h/4, h/4, h/4, 3*h/4, 3*h/4, 3*h/4, 3*h/4, h/4, h/4, h/4, h/4, 3*h/4, 3*h/4, 3*h/4, 3*h/4, h/4, h/4, h/4, h/4, 3*h/4, 3*h/4, 3*h/4, 3*h/4];
	
	//This array contains stage no.s but it is initialized inside initializeBombAnim function
	var stage_no_images;
	
function initializeBombAnim()
{
	arr_bomb[0] = new Bitmap(new BitmapData("stage_icons/bomb/bomb1.png"));
	arr_bomb[1] = new Bitmap(new BitmapData("stage_icons/bomb/bomb2.png"));
	arr_bomb[2] = new Bitmap(new BitmapData("stage_icons/bomb/bomb3.png"));
	arr_bomb[3] = new Bitmap(new BitmapData("stage_icons/bomb/bomb4.png"));
	arr_bomb[4] = new Bitmap(new BitmapData("stage_icons/bomb/bomb5.png"));
	arr_bomb[5] = new Bitmap(new BitmapData("stage_icons/bomb/bomb6.png"));
	arr_bomb[6] = new Bitmap(new BitmapData("stage_icons/bomb/bomb7.png"));
	arr_bomb[7] = new Bitmap(new BitmapData("stage_icons/bomb/bomb8.png"));
	arr_bomb[8] = new Bitmap(new BitmapData("stage_icons/bomb/bomb9.png"));
	arr_bomb[9] = new Bitmap(new BitmapData("stage_icons/bomb/bomb10.png"));
	arr_bomb[10] = new Bitmap(new BitmapData("stage_icons/bomb/bomb11.png"));
	arr_bomb[11] = new Bitmap(new BitmapData("stage_icons/bomb/bomb12.png"));
	arr_bomb[12] = new Bitmap(new BitmapData("stage_icons/bomb/bomb13.png"));
	arr_bomb[13] = new Bitmap(new BitmapData("stage_icons/bomb/bomb14.png"));
	arr_bomb[14] = new Bitmap(new BitmapData("stage_icons/bomb/bomb15.png"));
	arr_bomb[15] = new Bitmap(new BitmapData("stage_icons/bomb/bomb16.png"));
	arr_bomb[16] = new Bitmap(new BitmapData("stage_icons/bomb/bomb17.png"));
	arr_bomb[17] = new Bitmap(new BitmapData("stage_icons/bomb/bomb18.png"));
	arr_bomb[18] = new Bitmap(new BitmapData("stage_icons/bomb/bomb19.png"));
	arr_bomb[19] = new Bitmap(new BitmapData("stage_icons/bomb/bomb20.png"));
	arr_bomb[20] = new Bitmap(new BitmapData("stage_icons/bomb/bomb21.png"));
	arr_bomb[21] = new Bitmap(new BitmapData("stage_icons/bomb/bomb22.png"));
	
	stage_no_images =[new Bitmap(new BitmapData("stage_icons/1.png")), new Bitmap(new BitmapData("stage_icons/2.png")), new Bitmap(new BitmapData("stage_icons/3.png")), new Bitmap(new BitmapData("stage_icons/4.png")), new Bitmap(new BitmapData("stage_icons/5.png")), new Bitmap(new BitmapData("stage_icons/6.png")), new Bitmap(new BitmapData("stage_icons/7.png")), new Bitmap(new BitmapData("stage_icons/8.png")), new Bitmap(new BitmapData("stage_icons/9.png")), new Bitmap(new BitmapData("stage_icons/10.png")), new Bitmap(new BitmapData("stage_icons/11.png")), new Bitmap(new BitmapData("stage_icons/12.png")), new Bitmap(new BitmapData("stage_icons/13.png")), new Bitmap(new BitmapData("stage_icons/14.png")), new Bitmap(new BitmapData("stage_icons/15.png")), new Bitmap(new BitmapData("stage_icons/16.png")), new Bitmap(new BitmapData("stage_icons/17.png")), new Bitmap(new BitmapData("stage_icons/18.png")), new Bitmap(new BitmapData("stage_icons/19.png")), new Bitmap(new BitmapData("stage_icons/20.png"))];

}

function animBomb(counter, stage, stage_no)
{
	// This ensures that this animation is run only once on contact.

	if(counter < count_tower)
	{
		if(inFrame)
		{
			arr_bomb[counter].x = Math.floor(stagesX[stage_no - 1] - bombWidth);
			arr_bomb[counter].y = Math.floor(stagesY[stage_no - 1]- bombHeight);

			stage.removeChild(arr_bomb[counter-1]);
			
			arr_bomb[counter].scaleX = window.devicePixelRatio;
			arr_bomb[counter].scaleY = window.devicePixelRatio;

			stage.addChild(arr_bomb[counter]);
			counter++;
			setTimeout(animBomb, FRAME_RATE_BOMB, counter, stage, stage_no); 
		}
		else
		{
			stage.removeChild(arr_bomb[counter-1]);
		}
	
	}
	else
	{
		//Setting original bomb image

		stage.removeChild(arr_bomb[counter-1]);

		arr_bomb[0].x = Math.floor(stagesX[stage_no - 1] - bombWidth);
		arr_bomb[0].y = Math.floor(stagesY[stage_no - 1]- bombHeight);
		
		arr_bomb[0].scaleX = window.devicePixelRatio;
		arr_bomb[0].scaleY = window.devicePixelRatio;
		stage.addChild(arr_bomb[0]);
	}
		
	stage_no_images[stage_no -1].x = Math.floor(stagesX[stage_no - 1] - bombWidth);
	stage_no_images[stage_no -1].y = Math.floor(stagesY[stage_no - 1]- bombHeight);
	stage_no_images[stage_no -1].addEventListener(MouseEvent.MOUSE_DOWN, eval(listeners[stage_no-1]));
	stage_no_images[stage_no -1].buttonMode = true;
	stage_no_images[stage_no -1].scaleX = window.devicePixelRatio;
	stage_no_images[stage_no -1].scaleY = window.devicePixelRatio;
	stage.addChild(stage_no_images[stage_no -1]);
		
}