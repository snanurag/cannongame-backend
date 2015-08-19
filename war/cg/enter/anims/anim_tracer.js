var arr_tracer = new Array();

	var tracerlistener = 'onMDTracer';
	var tracerlistenerp = 'onMDTracerp';
	
function initializeTracerAnim()
{
	arr_tracer[0] = new Bitmap(new BitmapData("flag_imgs/tracer/flag1.png"));
	arr_tracer[1] = new Bitmap(new BitmapData("flag_imgs/tracer/flag2.png"));
	arr_tracer[2] = new Bitmap(new BitmapData("flag_imgs/tracer/flag3.png"));
	arr_tracer[3] = new Bitmap(new BitmapData("flag_imgs/tracer/flag4.png"));
	arr_tracer[4] = new Bitmap(new BitmapData("flag_imgs/tracer/flag5.png"));
	arr_tracer[5] = new Bitmap(new BitmapData("flag_imgs/tracer/flag6.png"));
	arr_tracer[6] = new Bitmap(new BitmapData("flag_imgs/tracer/flag7.png"));
	arr_tracer[7] = new Bitmap(new BitmapData("flag_imgs/tracer/flag8.png"));
	arr_tracer[8] = new Bitmap(new BitmapData("flag_imgs/tracer/flag9.png"));
	arr_tracer[9] = new Bitmap(new BitmapData("flag_imgs/tracer/flag10.png"));
	arr_tracer[10] = new Bitmap(new BitmapData("flag_imgs/tracer/flag11.png"));
	arr_tracer[11] = new Bitmap(new BitmapData("flag_imgs/tracer/flag12.png"));
	arr_tracer[12] = new Bitmap(new BitmapData("flag_imgs/tracer/flag13.png"));
	arr_tracer[13] = new Bitmap(new BitmapData("flag_imgs/tracer/flag14.png"));
	arr_tracer[14] = new Bitmap(new BitmapData("flag_imgs/tracer/flag15.png"));
	arr_tracer[15] = new Bitmap(new BitmapData("flag_imgs/tracer/flag16.png"));

}

function animTracer(counter, stage)
{
	// This ensures that this animation is run only once on contact.

		if(counter < count_flag)
		{
			if(inFrame)
			{
				arr_tracer[counter].x = Math.floor(5*w/8 - flagWidth);
				arr_tracer[counter].y = Math.floor(h/2- flagHeight - flagHeightShift);

				stage.removeChild(arr_tracer[counter-1]);
				arr_tracer[counter].addEventListener(MouseEvent.MOUSE_DOWN, eval(tracerlistenerp));
				arr_tracer[counter].scaleX = window.devicePixelRatio;
				arr_tracer[counter].scaleY = window.devicePixelRatio;
				arr_tracer[counter].buttonMode = true;
				stage.addChild(arr_tracer[counter]);
				counter++;
			}
			setTimeout(animTracer, FRAME_RATE_FLAG, counter, stage); 
		}
		else
		{
			stage.removeChild(arr_tracer[counter-1]);

			if(getMetaTag('tracer').content == 'on')
			{
				arr_tracer[4].x = Math.floor(5*w/8 - flagWidth);
				arr_tracer[4].y = Math.floor(h/2- flagHeight - flagHeightShift);
			
				arr_tracer[4].buttonMode = true;
				arr_tracer[4].addEventListener(MouseEvent.MOUSE_DOWN, eval(tracerlistenerp));
				stage.addChild(arr_tracer[4]);
				setTimeout(animTracer, FRAME_RATE_FLAG, 5, stage); 
			}
			else
			{
				arr_tracer[3].x = Math.floor(5*w/8 - flagWidth);
				arr_tracer[3].y = Math.floor(h/2- flagHeight - flagHeightShift);
			
				arr_tracer[3].buttonMode = true;
				arr_tracer[3].addEventListener(MouseEvent.MOUSE_DOWN, eval(tracerlistenerp));
				stage.addChild(arr_tracer[3]);
				setTimeout(stopTracer, FRAME_RATE_FLAG, 2, stage); 
			}
		}
}

function stopTracer(counter, stage)
{
		if(counter >= 0)
		{
			stage.removeChild(arr_tracer[counter+1]);

			arr_tracer[counter].x = Math.floor(5*w/8 - flagWidth);
			arr_tracer[counter].y = Math.floor(h/2 - flagHeight - flagHeightShift);
			arr_tracer[counter].scaleX = window.devicePixelRatio;
			arr_tracer[counter].scaleY = window.devicePixelRatio;

			arr_tracer[counter].buttonMode = true;
			if(counter > 0)
			{
				arr_tracer[counter].addEventListener(MouseEvent.MOUSE_DOWN, eval(tracerlistenerp));
			}
			else
			{
				arr_tracer[counter].addEventListener(MouseEvent.MOUSE_DOWN, eval(tracerlistener));
			}

			stage.addChild(arr_tracer[counter]);
			
			counter--;
			setTimeout(stopTracer, FRAME_RATE_FLAG, counter, stage); 
		}

}

function startWithTracerStop(stage)
{

	arr_tracer[0].x = Math.floor(5*w/8 - flagWidth);
	arr_tracer[0].y = Math.floor(h/2 - flagHeight - flagHeightShift);
	arr_tracer[0].scaleX = window.devicePixelRatio;
	arr_tracer[0].scaleY = window.devicePixelRatio;

	arr_tracer[0].buttonMode = true;
	arr_tracer[0].addEventListener(MouseEvent.MOUSE_DOWN, eval(tracerlistener));
			
	stage.addChild(arr_tracer[0]);
			
}