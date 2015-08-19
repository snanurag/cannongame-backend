	var stages = ['24301.json','1.json','59203.json', '26904.json', '2.json', '8.406917822341853E8.json', '8.667454087194089E8.json', '5.2186478797800064E8.json',

	'6258359.91985284.json', '3.1290327045556176E8.json', '8.11031994827002E8.json', '8.338782965651317E8.json', '7.19074501173349E7.json', '7.329634825159239E8.json', '6.167622551590418E8.json', '2.7911617107737976E8.json',

	'5.455096460842246E7.json', '9.878414830850183E8.json', '9.876811297099341E7.json',	'6.149199003819513E8.json'
	];
	
	var bckGrounds = ['img/bck_sheilds.png', 'img/bck_sheilds.png', 'img/bck_sheilds.png', 'img/bck_sheild_flag.png', 'img/bck_sheild_flag.png', 'img/bck_flag_torch.png', 'img/bck_sheilds.png', 'img/bck_sheild_flag.png', 
	
	'img/bck_sheild_flag.png', 'img/bck_flag_torch.png', 'img/bck_sheild_flag.png', 'img/bck_sheild_flag.png', 'img/bck_sheild_flag.png', 'img/bck_sheild_flag.png', 'img/bck_flag_torch.png', 'img/bck_flag_torch.png', 
	
	'img/bck_flag_torch.png', 'img/bck_flag_torch.png', 'img/bck_sheild_flag.png', 'img/bck_flag_torch.png'
	];

	//This function is responsible for the recoilation movement of the cannons.
	function recoil(e)
	{
		if(cannons.length > 0)
		{
			for(var i=0; i<cannons.length; i++)
			{
				var body = cannons[i];
				var position = body.GetPosition();
				var bodyX = position.x;
				var bodyY = position.y;

				var fixDef = body.GetFixtureList();
				var userData = fixDef.GetUserData();

				var X = userData.originalX;
				var Y = userData.originalY;

				var distance = Math.sqrt((bodyX-X)*(bodyX-X)+(bodyY-Y)*(bodyY-Y))
				var vel = body.GetLinearVelocity();

				if(distance > 0.1 && userData.cannonRecoilReverse == false)
				{
					vel.x = -(vel.x)/35;
					vel.y = -(vel.y)/35;
					userData.cannonRecoilReverse = true;
				}
				if(userData.cannonRecoilReverse == true && distance < 0.02)
				{
					vel.x = 0;
					vel.y = 0;
					body.SetPosition(new b2Vec2(X, Y));

					//Weld joint stuff		
					// If you are using weld joint then no need to set position of cannon specifically.
//					dynamicCannons[i].SetPosition(new b2Vec2(X, Y));

					userData.cannonRecoilReverse = false;
				}
			}
		}
	}
	
	// This function will give impulse vector of the given magnitude.
	// impulseMagnitude could be passed 1 if it requires unit vector impulse i.e. only with directions.
	function getImpulse(e, body, impulseMagnitude)
	{
		var currentTarget = e.currentTarget;
		var cursorX = currentTarget.mouseX/SCALE;
		var cursorY = currentTarget.mouseY/SCALE;
		var position = body.GetPosition();
		var bodyX = position.x;
		var bodyY = position.y;

		var b2Vec2 = Box2D.Common.Math.b2Vec2;

		var impulseX;
		var impulseY;

		if(scaleX >1.3)
			impulseX = (-bodyX+cursorX) * (scaleX * scaleX * 0.9);
		else	
			impulseX = (-bodyX+cursorX) * scaleX * scaleX;

		//Direction of speed will change if will scale up to scaleY. That is why scaling up to scaleX only
		if(scaleY >1.3)
			impulseY = (-bodyY+cursorY) * (scaleX * scaleX * 0.9) ;
		else
			impulseY = (-bodyY+cursorY) * scaleX * scaleX;
		
		var impulseModulus = Math.sqrt(impulseX*impulseX + impulseY*impulseY);

		if(impulseMagnitude == undefined)
		{
			var impulse = new b2Vec2(impulseX , impulseY);
		}
		else
		{
			var impulse = new b2Vec2(impulseMagnitude * impulseX/impulseModulus, impulseMagnitude * impulseY/impulseModulus);
		}

		return impulse;
	}
	
	//This returns the magnitude of the vector
	function getMagnitude(b2Vec2)
	{	
		return Math.sqrt(b2Vec2.x*b2Vec2.x + b2Vec2.y*b2Vec2.y);
	}

	//This function is responsible for ejecting balls out of cannons.
	function addCannonBallToStage()
	{
		for(var i=0; i<cannons.length; i++)
		{	
			var body = cannons[i];
			var angle = body.GetAngle();
			
			var fixDef = body.GetFixtureList();
			var userData = fixDef.GetUserData();

			var x = (userData.originalX - stage.stageWidth/(2*SCALE)) + (userData.fixtureWidth + userData.centerX) * Math.cos(angle);
			var y = (userData.originalY - stage.stageHeight/(2*SCALE)) + (userData.fixtureWidth + userData.centerX) * Math.sin(angle);
			
			x = x/scaleX;
			y = y/scaleY;
			
			var width = 0.3;
			var height = 0.3;
			var bitmapWidth = -50;
			var bitmapHeight = -50;
			var image = "img/cannonball.png";
			var shape = "circle";
			var type = "dynamic";
			var name = "cannon ball";
			var description = "Cannon ball 1";
			var friction = 1;
			var restitution = 0.3;
			var centerX = 0;
			var centerY = 0;
			var ball = addObjectToStage(stage, world, x, y, width, height, bitmapWidth, bitmapHeight, image, shape, type, name, friction, restitution, centerX, centerY, angle);
			balls.push(ball);
		}
	}
	
	function drawLine(b, stage)
	{

		if(b.m_fixtureList.m_userData.last_x == undefined)
		{
			b.m_fixtureList.m_userData.last_x = b.GetPosition().x * SCALE;
			b.m_fixtureList.m_userData.last_y = b.GetPosition().y * SCALE;
		}
		else
		{
			var s = new Sprite();
			stage.addChild(s);
			
			//  line
			s.graphics.lineStyle(3, 0xff0000);
			s.graphics.moveTo(b.m_fixtureList.m_userData.last_x, b.m_fixtureList.m_userData.last_y);
			s.graphics.lineTo(b.GetPosition().x * SCALE, b.GetPosition().y * SCALE);
			b.m_fixtureList.m_userData.last_x = b.GetPosition().x * SCALE;
			b.m_fixtureList.m_userData.last_y = b.GetPosition().y * SCALE;

		}
	}
	
	function getMetaTag(propertyName)
	{
		var my_arr = window.parent.document.getElementsByTagName("meta");
		for (var counter = 0; counter < my_arr.length; counter++) 
		{
			if (my_arr[counter].name == propertyName) 
			{
				return my_arr[counter];
			}
		}
	}
	
	function replaceBody(orig_x, orig_y, orig_w, orig_h, counter, count)
	{
	
		var y = orig_y - counter*orig_h/count;
	
		var h = (count - counter)*orig_h/count;
	
		var b = getBoxBody(orig_x, y, orig_w, h, 1,0);
	
		return b;
	}

	function getBoxBody(x, y, w, h, friction, restitution)
	{
		var bxFixDef = new b2FixtureDef();
		bxFixDef.shape	= new b2PolygonShape();
		bxFixDef.shape.SetAsBox(w, h);

		bxFixDef.density =  1;
		bxFixDef.friction = friction;
		bxFixDef.restitution = restitution;
		
		var bodyDef = new b2BodyDef();
		bodyDef.type = b2Body.b2_staticBody;
		
		bodyDef.position.Set(x, y);
		var body = world.CreateBody(bodyDef);
	
		var bxFix = body.CreateFixture(bxFixDef);

		return body;
	}
	
	function displayStage(stage, stage_file)
	{
              // TextFormat(font, size, color, bold, italic, align, leading)

  		var stage_no = getStage(stage_file);

		var f1 = new TextFormat("MisterEarl BT", 45, 0x000000, true, false);
               
        var t1 = new TextField();
        t1.selectable = false;	// default is true
        t1.setTextFormat(f1);
        t1.text = "Stage "+stage_no;
        t1.width = t1.textWidth; t1.height = t1.textHeight;
        stage.addChild(t1);  
		t1.x = stage.stageWidth -t1.width -70;
		t1.y = 20;
		
        var f2 = new TextFormat("MisterEarl BT", 45, 0xFFD700, false, false);
               
        var t2 = new TextField();
        t2.selectable = false;	// default is true
        t2.setTextFormat(f2);
        t2.text = "Stage "+stage_no;
        t2.width = t2.textWidth; t2.height = t2.textHeight;
        stage.addChild(t2);  
		t2.x = stage.stageWidth -t2.width -70;
		t2.y = 20;

	}

	

	function getStage(currentLevel)
	{
		for(var i=0; i<stages.length; i++)
		{
			if(currentLevel == stages[i])
			{
				return i+1;
			}
		}
		return -1;
	}

	// This info popup is of dimensions 200*100
	function displayInfo(stage_no)
	{
		var popup = document.getElementById('directions');

		var iDiv = document.createElement('div');
		popup.appendChild(iDiv);
		
		if(stage_no == 1)
		{
			popup.classList.add('easein');
			popup.style.top = 50;
			iDiv.style.left =  30;
			iDiv.style.height = 150;
			iDiv.innerHTML = 'Cannons always point to mouse. Just click, to fire cannons. Destroy brown castle.';
		}
		else if(stage_no == 2)
		{
			popup.classList.add('easein');
			iDiv.style.left = (stage.stageWidth - 200)/2;
			iDiv.innerHTML = 'Destroy both towers in single shot.';
		}
		else if(stage_no == 3)
		{
			popup.classList.add('easein');
			popup.style.top = 100;

			iDiv.style.right =  30;
			iDiv.innerHTML = 'Take mouse far from cannon to give speed to cannon ball.';

		}
		else if(stage_no == 4)
		{
			popup.classList.add('easein');
			popup.style.top = 150;
			iDiv.style.left =  30;
			iDiv.innerHTML = 'Use wall for rebound of cannon balls.';
			

		}
		else if(stage_no == 5)
		{
			popup.classList.add('easein');
			iDiv.style.left = (stage.stageWidth - 200)/2;
			iDiv.innerHTML = 'Use cannon balls collision  for rebound.';
		}
		setTimeout(popupEaseout, 5000, popup);
	}
	
	function popupEaseout(popup)
	{
		popup.classList.add('easeout');
	}
	
	function playCannonCollision(a, b)
	{
		if(a == null)
		{
			playWall();
			b.previousColloider = null;
		}
		else if(b == null)
		{
			playWall();
			a.previousColloider = null;
		}
		else if(b.previousColloider == undefined)
		{
			b.previousColloider = a.name;
		}
		else if(a.name =='building1' || a.name =='building2' || a.name =='building3')
		{
			playCastle();
			b.previousColloider = a.name;
		}
		else if(b.previousColloider != a.name)
		{
			playWall();
			b.previousColloider = a.name;
		}
	}
	
	function storeClearedStagesInCookie(stage, stars)
	{
		var clearedstages = $.cookie("clearedstages");
		
		if(typeof clearedstages == undefined || clearedstages == null)
		{
			clearedstages = {};
		}
		else 
		{
			clearedstages = JSON.parse(clearedstages);
		}

		clearedstages[stage] = stars;
		$.cookie("clearedstages", JSON.stringify(clearedstages));
		
	}

	function displayStages()
	{
		$.get('http://winged-memory-791.appspot.com//retrievescore?email='+$.cookie('cannongameemail'), function(data) 
		{
			$.cookie("clearedstages", JSON.stringify(data));
			var ifrm = document.getElementById('firstStageSet');
			ifrm.src = 'stage_set_1.html';

			var popup = document.getElementById('gsignin');
			popup.parentNode.removeChild(popup);

		});
	}
	
	function storeStagesInDB(callbackFn)
	{
		var clearedstages = $.cookie("clearedstages");
		
		if(typeof clearedstages != undefined && clearedstages != null)
		{
			clearedstages = JSON.parse(clearedstages);
			
			var queryParams = '';
			
			$.each(clearedstages, function(i, obj) {
				queryParams += '&'+i+'='+obj; 
			});
			$.get('http://winged-memory-791.appspot.com/storescore?email='+$.cookie('cannongameemail')+queryParams, callbackFn);
		}
		else
		{
			callbackFn();
		}
		
	}