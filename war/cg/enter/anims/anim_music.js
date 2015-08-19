var arr_music = new Array();

	var musiclistener = 'onMDMusic';
	var musiclistenerp = 'onMDMusicp';
	
	//This array contains stage no.s but it is initialized inside initializeBombAnim function
	var stage_no_images;
	
function initializeMusicAnim()
{
	arr_music[0] = new Bitmap(new BitmapData("flag_imgs/music/flag1.png"));
	arr_music[1] = new Bitmap(new BitmapData("flag_imgs/music/flag2.png"));
	arr_music[2] = new Bitmap(new BitmapData("flag_imgs/music/flag3.png"));
	arr_music[3] = new Bitmap(new BitmapData("flag_imgs/music/flag4.png"));
	arr_music[4] = new Bitmap(new BitmapData("flag_imgs/music/flag5.png"));
	arr_music[5] = new Bitmap(new BitmapData("flag_imgs/music/flag6.png"));
	arr_music[6] = new Bitmap(new BitmapData("flag_imgs/music/flag7.png"));
	arr_music[7] = new Bitmap(new BitmapData("flag_imgs/music/flag8.png"));
	arr_music[8] = new Bitmap(new BitmapData("flag_imgs/music/flag9.png"));
	arr_music[9] = new Bitmap(new BitmapData("flag_imgs/music/flag10.png"));
	arr_music[10] = new Bitmap(new BitmapData("flag_imgs/music/flag11.png"));
	arr_music[11] = new Bitmap(new BitmapData("flag_imgs/music/flag12.png"));
	arr_music[12] = new Bitmap(new BitmapData("flag_imgs/music/flag13.png"));
	arr_music[13] = new Bitmap(new BitmapData("flag_imgs/music/flag14.png"));
	arr_music[14] = new Bitmap(new BitmapData("flag_imgs/music/flag15.png"));
	arr_music[15] = new Bitmap(new BitmapData("flag_imgs/music/flag16.png"));

}

function animMusic(counter, stage)
{
	// This ensures that this animation is run only once on contact.

		if(counter < count_flag)
		{
			//Because of this block, flag will move only when in frame. Otherwise it will stay in loop but no removal and addition in stage.
			if(inFrame)
			{
				arr_music[counter].x = Math.floor(w/8 - flagWidth);
				arr_music[counter].y = Math.floor(h/2- flagHeight - flagHeightShift);

				stage.removeChild(arr_music[counter-1]);
				arr_music[counter].addEventListener(MouseEvent.MOUSE_DOWN, eval(musiclistenerp));

				arr_music[counter].buttonMode = true;
				arr_music[counter].scaleX = window.devicePixelRatio;
				arr_music[counter].scaleY = window.devicePixelRatio;
				stage.addChild(arr_music[counter]);
				counter++;
			}
			setTimeout(animMusic, FRAME_RATE_FLAG, counter, stage); 
		}
		else
		{
			stage.removeChild(arr_music[counter-1]);

			if(getMetaTag('music').content == 'on')
			{
				arr_music[4].x = Math.floor(w/8 - flagWidth);
				arr_music[4].y = Math.floor(h/2- flagHeight - flagHeightShift);
			
				arr_music[4].buttonMode = true;
				arr_music[4].addEventListener(MouseEvent.MOUSE_DOWN, eval(musiclistenerp));
				stage.addChild(arr_music[4]);
				setTimeout(animMusic, FRAME_RATE_FLAG, 5, stage); 
			}
			else
			{
				arr_music[3].x = Math.floor(w/8 - flagWidth);
				arr_music[3].y = Math.floor(h/2- flagHeight - flagHeightShift);
			
				arr_music[3].buttonMode = true;
				arr_music[3].addEventListener(MouseEvent.MOUSE_DOWN, eval(musiclistenerp));
				stage.addChild(arr_music[3]);
				setTimeout(stopMusic, FRAME_RATE_FLAG, 2, stage); 
			}
		}
}

function stopMusic(counter, stage)
{
		if(counter >= 0)
		{
			stage.removeChild(arr_music[counter+1]);

			arr_music[counter].x = Math.floor(w/8 - flagWidth);
			arr_music[counter].y = Math.floor(h/2 - flagHeight - flagHeightShift);
			arr_music[counter].scaleX = window.devicePixelRatio;
			arr_music[counter].scaleY = window.devicePixelRatio;

			arr_music[counter].buttonMode = true;
			if(counter > 0)
			{
				arr_music[counter].addEventListener(MouseEvent.MOUSE_DOWN, eval(musiclistenerp));
			}
			else
			{
				arr_music[counter].addEventListener(MouseEvent.MOUSE_DOWN, eval(musiclistener));
			}

			stage.addChild(arr_music[counter]);
			
			counter--;
			setTimeout(stopMusic, FRAME_RATE_FLAG, counter, stage); 
		}

}