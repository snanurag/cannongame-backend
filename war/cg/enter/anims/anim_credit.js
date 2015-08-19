var arr_shop = new Array();

var shoplistener = 'onMDShop';
	
function initializeShopAnim()
{
	arr_shop[0] = new Bitmap(new BitmapData("flag_imgs/credit/flag1.png"));
	arr_shop[1] = new Bitmap(new BitmapData("flag_imgs/credit/flag2.png"));
	arr_shop[2] = new Bitmap(new BitmapData("flag_imgs/credit/flag3.png"));
	arr_shop[3] = new Bitmap(new BitmapData("flag_imgs/credit/flag4.png"));
	arr_shop[4] = new Bitmap(new BitmapData("flag_imgs/credit/flag5.png"));
	arr_shop[5] = new Bitmap(new BitmapData("flag_imgs/credit/flag6.png"));
	arr_shop[6] = new Bitmap(new BitmapData("flag_imgs/credit/flag7.png"));
	arr_shop[7] = new Bitmap(new BitmapData("flag_imgs/credit/flag8.png"));
	arr_shop[8] = new Bitmap(new BitmapData("flag_imgs/credit/flag9.png"));
	arr_shop[9] = new Bitmap(new BitmapData("flag_imgs/credit/flag10.png"));
	arr_shop[10] = new Bitmap(new BitmapData("flag_imgs/credit/flag11.png"));
	arr_shop[11] = new Bitmap(new BitmapData("flag_imgs/credit/flag12.png"));
	arr_shop[12] = new Bitmap(new BitmapData("flag_imgs/credit/flag13.png"));
	arr_shop[13] = new Bitmap(new BitmapData("flag_imgs/credit/flag14.png"));
	arr_shop[14] = new Bitmap(new BitmapData("flag_imgs/credit/flag15.png"));
	arr_shop[15] = new Bitmap(new BitmapData("flag_imgs/credit/flag16.png"));

}

function animShop(counter, stage)
{
	// This ensures that this animation is run only once on contact.

		if(counter < count_flag)
		{
			if(inFrame)
			{
				arr_shop[counter].x = Math.floor(7*w/8 - flagWidth);
				arr_shop[counter].y = Math.floor(h/2- flagHeight - flagHeightShift);

				stage.removeChild(arr_shop[counter-1]);
				arr_shop[counter].addEventListener(MouseEvent.MOUSE_DOWN, eval(shoplistener));

				arr_shop[counter].buttonMode = true;
				arr_shop[counter].scaleX = window.devicePixelRatio;
				arr_shop[counter].scaleY = window.devicePixelRatio;
				stage.addChild(arr_shop[counter]);
				counter++;
			}
			setTimeout(animShop, FRAME_RATE_FLAG, counter, stage); 
		}
		else
		{
			stage.removeChild(arr_shop[counter-1]);

			arr_shop[4].x = Math.floor(7*w/8 - flagWidth);
			arr_shop[4].y = Math.floor(h/2- flagHeight - flagHeightShift);
		
			arr_shop[4].buttonMode = true;
			arr_shop[4].addEventListener(MouseEvent.MOUSE_DOWN, eval(shoplistener));
			stage.addChild(arr_shop[4]);
			setTimeout(animShop, FRAME_RATE_FLAG, 5, stage); 
		}
}
