var bombAnimationTriggerRate = 4000;
var inFrame = false;

function startBombBurningDeamon(stage, startingStage, lastStage)
{

	var appender;
	appender = Math.round(Math.random()*(lastStage - startingStage));
	
	var stageToAnimate = startingStage + appender;
	
	animBomb(0, stage, stageToAnimate);
	
	setTimeout(startBombBurningDeamon, bombAnimationTriggerRate, stage, startingStage, lastStage); 
	
	inFrame = false
}


function setStageIconDisabled(x, y)
{
	var imageW = 50 * window.devicePixelRatio;
	var imageH = (37-(50-37)) * window.devicePixelRatio;
	var imageBomb = new Bitmap(new BitmapData('stage_icons/bomb_disabled.png'));
	imageBomb.scaleX = window.devicePixelRatio;
	imageBomb.scaleY = window.devicePixelRatio;
	imageBomb.x =  Math.floor(x - imageW);
	imageBomb.y =  Math.floor(y - imageH);
	stage.addChild(imageBomb);
	imageBomb.buttonMode = true;
}

function setStageIcon(image, x, y)
{

	//Adding bomb in background
	var imageW = 50 * window.devicePixelRatio;
	var imageH = 50 * window.devicePixelRatio;
	var imageBomb = new Bitmap(new BitmapData('stage_icons/bomb/bomb1.png'));
	imageBomb.scaleX = window.devicePixelRatio;
	imageBomb.scaleY = window.devicePixelRatio;
	imageBomb.x =  Math.floor(x - imageW);
	imageBomb.y =  Math.floor(y - imageH);
	stage.addChild(imageBomb);
	
	var bd = new BitmapData(image);

	var b = new Bitmap(bd);
	b.scaleX = window.devicePixelRatio;
	b.scaleY = window.devicePixelRatio;
	b.x = Math.floor(x - imageW);
	b.y = Math.floor(y - imageH);
	b.buttonMode = true;
//			b.alpha = 0.7;
	stage.addChild(b);
	
//			This is how listener events are added to image.			
//			b.addEventListener(MouseEvent.MOUSE_OVER, onMOv);
//			b.addEventListener(MouseEvent.MOUSE_OUT , onMOu);
//			b.addEventListener(MouseEvent.MOUSE_UP  , onMU );
	
	//Returning Bitmap type.
	return b;
}

function onMD ()
{ 
		window.parent.document.body.style.backgroundImage = 'url(../img/loading_stage.jpg)';

	//TODO Have to enable it later and has to verify whether it will work in mozilla and opera too or not?
/*			if(window.parent.outerHeight != window.parent.screen.availHeight || window.parent.outerWidth != window.parent.screen.availWidth)
	{
		alert('Please maximise browser to full size before begining the game.');
		return;
	}
*/	
	// Creating IFrame in parent document.
	var ifrm = window.parent.document.createElement("IFRAME");
	ifrm.setAttribute("id", "maingameframe");
	
	//Resizing Iframe of parent document.
	ifrm.style.width = window.parent.innerWidth +'px';
	ifrm.style.height = window.parent.innerHeight +'px'; 
	window.parent.document.body.style['margin-top'] = 'auto';
	window.parent.document.body.style['margin-bottom'] = 'auto';
	
	
	//Adding frame to the body.
	window.parent.document.body.appendChild(ifrm);

	// Removing contents of parent document.	
	$('div', window.parent.document).remove();
	return ifrm;
}

function onEnterFrame(e)
{
	inFrame = true;
}