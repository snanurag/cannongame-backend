var arr_sound = new Array();

/*
	var stages = ['24301.json','1.json','59203.json', '26904.json', '2.json', '8.406917822341853E8.json', '8.667454087194089E8.json', '5.2186478797800064E8.json',

	'6258359.91985284.json', '3.1290327045556176E8.json', '8.11031994827002E8.json', '8.338782965651317E8.json', '7.19074501173349E7.json', '7.329634825159239E8.json', '6.167622551590418E8.json', '2.7911617107737976E8.json',

	'5.455096460842246E7.json', '9.878414830850183E8.json', '9.876811297099341E7.json',	'6.149199003819513E8.json'
	];

*/
	var soundlistener = 'onMDSound';
	var soundlistenerp = 'onMDSoundp';
	
	//This array contains stage no.s but it is initialized inside initializeBombAnim function
	var stage_no_images;
	
function initializeSoundAnim()
{
	arr_sound[0] = new Bitmap(new BitmapData("flag_imgs/sound/flag1.png"));
	arr_sound[1] = new Bitmap(new BitmapData("flag_imgs/sound/flag2.png"));
	arr_sound[2] = new Bitmap(new BitmapData("flag_imgs/sound/flag3.png"));
	arr_sound[3] = new Bitmap(new BitmapData("flag_imgs/sound/flag4.png"));
	arr_sound[4] = new Bitmap(new BitmapData("flag_imgs/sound/flag5.png"));
	arr_sound[5] = new Bitmap(new BitmapData("flag_imgs/sound/flag6.png"));
	arr_sound[6] = new Bitmap(new BitmapData("flag_imgs/sound/flag7.png"));
	arr_sound[7] = new Bitmap(new BitmapData("flag_imgs/sound/flag8.png"));
	arr_sound[8] = new Bitmap(new BitmapData("flag_imgs/sound/flag9.png"));
	arr_sound[9] = new Bitmap(new BitmapData("flag_imgs/sound/flag10.png"));
	arr_sound[10] = new Bitmap(new BitmapData("flag_imgs/sound/flag11.png"));
	arr_sound[11] = new Bitmap(new BitmapData("flag_imgs/sound/flag12.png"));
	arr_sound[12] = new Bitmap(new BitmapData("flag_imgs/sound/flag13.png"));
	arr_sound[13] = new Bitmap(new BitmapData("flag_imgs/sound/flag14.png"));
	arr_sound[14] = new Bitmap(new BitmapData("flag_imgs/sound/flag15.png"));
	arr_sound[15] = new Bitmap(new BitmapData("flag_imgs/sound/flag16.png"));

}

function animSound(counter, stage)
{
	// This ensures that this animation is run only once on contact.

		if(counter < count_flag)
		{
			if(inFrame)
			{
				arr_sound[counter].x = Math.floor(3*w/8 - flagWidth);
				arr_sound[counter].y = Math.floor(h/2- flagHeight - flagHeightShift);

				stage.removeChild(arr_sound[counter-1]);
				arr_sound[counter].addEventListener(MouseEvent.MOUSE_DOWN, eval(soundlistenerp));
				arr_sound[counter].scaleX = window.devicePixelRatio;
				arr_sound[counter].scaleY = window.devicePixelRatio;
				arr_sound[counter].buttonMode = true;
				stage.addChild(arr_sound[counter]);
				counter++;
			}
			setTimeout(animSound, FRAME_RATE_FLAG, counter, stage); 
		}
		else
		{
			stage.removeChild(arr_sound[counter-1]);

			if(getMetaTag('sound').content == 'on')
			{
				arr_sound[4].x = Math.floor(3*w/8 - flagWidth);
				arr_sound[4].y = Math.floor(h/2- flagHeight - flagHeightShift);
			
				arr_sound[4].buttonMode = true;
				arr_sound[4].addEventListener(MouseEvent.MOUSE_DOWN, eval(soundlistenerp));
				stage.addChild(arr_sound[4]);
				setTimeout(animSound, FRAME_RATE_FLAG, 5, stage); 
			}
			else
			{
				arr_sound[3].x = Math.floor(3*w/8 - flagWidth);
				arr_sound[3].y = Math.floor(h/2- flagHeight - flagHeightShift);
			
				arr_sound[3].buttonMode = true;
				arr_sound[3].addEventListener(MouseEvent.MOUSE_DOWN, eval(soundlistenerp));
				stage.addChild(arr_sound[3]);
				setTimeout(stopSound, FRAME_RATE_FLAG, 2, stage); 
			}
		}
}

function stopSound(counter, stage)
{
		if(counter >= 0)
		{
			stage.removeChild(arr_sound[counter+1]);

			arr_sound[counter].x = Math.floor(3*w/8 - flagWidth);
			arr_sound[counter].y = Math.floor(h/2 - flagHeight - flagHeightShift);
			arr_sound[counter].scaleX = window.devicePixelRatio;
			arr_sound[counter].scaleY = window.devicePixelRatio;

			arr_sound[counter].buttonMode = true;
			if(counter > 0)
			{
				arr_sound[counter].addEventListener(MouseEvent.MOUSE_DOWN, eval(soundlistenerp));
			}
			else
			{
				arr_sound[counter].addEventListener(MouseEvent.MOUSE_DOWN, eval(soundlistener));
			}

			stage.addChild(arr_sound[counter]);
			
			counter--;
			setTimeout(stopSound, FRAME_RATE_FLAG, counter, stage); 
		}

}