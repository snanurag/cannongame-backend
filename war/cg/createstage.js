var blockerCounter = 0;

function loadstage(stage, world, level)
{
	$.getJSON("stages/"+level, function(data) {
		$.each( data.imagelist, function( key, val ) {
			addObjectToStage(stage, world, this.x, this.y, this.width, this.height, this.bitmapWidth, this.bitmapHeight, this.image, this.shape, this.type, this.name, this.friction, this.restitution, this.centerX, this.centerY, this.angle);
			
			//Increment number of targets
			if(this.name == "building1" || this.name == "building2" || this.name == "building3")
				numTargets++;
		});
		
		displayStage(stage, currentLevel);
		
		displayInfo(getStage(currentLevel));


	});
}

function addObjectToStage(stage, world, fixtureX, fixtureY, fixtureWidth, fixtureHeight, bitmapWidth, bitmapHeight, imageLoc, shape, type, name, friction, restitution, centerX, centerY, angle)
{
		// Making body
		//1. Create Box fixture
		var bxFixDef = new b2FixtureDef();	// box  fixture definition
		
		fixtureWidth = fixtureWidth * scaleX;

		// Ball should be round
		if(name == "cannon ball")
			fixtureHeight = fixtureHeight * scaleX;
		else
			fixtureHeight = fixtureHeight * scaleY;
		
		centerX = centerX * scaleX;
		centerY = centerY * scaleY;
		
		var center = new b2Vec2(centerX, centerY);

		if(shape == "polygon")
		{
			bxFixDef.shape	= new b2PolygonShape();
			if(centerX != 0 || centerY != 0)
			{

				bxFixDef.shape.SetAsOrientedBox(fixtureWidth, fixtureHeight, center);
			}
			else
			{	
				bxFixDef.shape.SetAsBox(fixtureWidth, fixtureHeight);
			}
		}
		else if(shape == "circle")
		{
			bxFixDef.shape	= new b2CircleShape();
			bxFixDef.shape.SetRadius(fixtureWidth);
		}
		
		bxFixDef.density =  1;
		bxFixDef.friction = friction;
		bxFixDef.restitution = restitution;
		
		//2. Define Body
		var bodyDef = new b2BodyDef();
		if(type == "static")
		{
			bodyDef.type = b2Body.b2_staticBody;
		}
		else if(type == "dynamic")
		{
			bodyDef.type = b2Body.b2_dynamicBody;
		}
		else
		{
			bodyDef.type = b2Body.b2_kinematicBody;
		}
		
		//3. Cordinates are provided keeping cordinate system at center of screen.
		if(fixtureX == "max")
		{
			fixtureX = stage.stageWidth/SCALE;
		}
		else if(fixtureX == "-max")
		{
			fixtureX = 0;
		}
		else
		{
			fixtureX = stage.stageWidth/(2*SCALE) + fixtureX * scaleX;
		}
		
		if (fixtureY == "max")
		{
			if(name == "building1" || name == "building2" || name == "building3")
			{
				fixtureY = stage.stageHeight/SCALE - fixtureHeight
			}
			else
			{
				fixtureY = stage.stageHeight/SCALE;
			}
		}
		else if (fixtureY == "-max")
		{
			fixtureY = 0;
		}
		else 
		{
			fixtureY = stage.stageHeight/(2*SCALE) + fixtureY * scaleY;
		}
			
		bodyDef.position.Set(fixtureX, fixtureY);
		var body = world.CreateBody(bodyDef);
			
		//4. Add Box fixture to Body
		var bxFix = body.CreateFixture(bxFixDef);

			
		//5. Change center of mass of body
		if(centerX!=0 || centerY != 0)
		{
			var bodyMassData = new b2MassData();
			bodyMassData.center.x = centerX;
			bodyMassData.center.y = centerY;
			body.SetMassData(bodyMassData);
			body.ResetMassData();
		}
		
		
		//6. Create Sprite
		var actor = new Sprite();
		
		if(name == 'blocker')
		{
			imageLoc = getAppropriateBlocker(fixtureWidth*SCALE, fixtureHeight*SCALE);
			bitmapWidth = getAppropriateBitmapWidth(fixtureWidth*SCALE);
			bitmapHeight = getAppropriateBitmapHeight(fixtureHeight*SCALE);
			
			//It will help in making all the blockers distinct.
			name = 'blocker' + ++blockerCounter;
		}

		
		// If it is cannon ball then make the sprite a little wider than the box2d cannon ball size. 
		// So that when ball is moving on surface it will appear quite in contact with the surface.
		if(name == "cannon ball")
		{
			actor.scaleX = -(fixtureWidth+0.02)*SCALE/bitmapWidth;
			actor.scaleY = -(fixtureHeight+0.02)*SCALE/bitmapHeight; 
		}
		else
		{
			actor.scaleX = -fixtureWidth*SCALE/bitmapWidth;
			actor.scaleY = -fixtureHeight*SCALE/bitmapHeight; 
		}
		
		//7. Define Bitmap of box.
		//bitmapWidth and bitmapHeight are the half pixels of any image. 
		//This spreads over the whole body size. So the shifting of origin should be in that proportion only.
		var bxBD = new BitmapData(imageLoc);
		var bm = new Bitmap(bxBD);
		bm.x = bitmapWidth + centerX*SCALE/(fixtureWidth*SCALE/-bitmapWidth);
		bm.y = bitmapHeight + centerY*SCALE/(fixtureHeight*SCALE/-bitmapHeight);

		//8. Add Bitmap to sprite
		actor.addChild(bm);

		//9. Set User Data to 
		var userData = new Object();
		userData.originalX = fixtureX;
		userData.originalY = fixtureY;
		userData.fixtureWidth = fixtureWidth;
		userData.fixtureHeight = fixtureHeight;
		userData.name = name;
		userData.actor = actor;
		
		//Cannon weld joint code
//		userData.previousAngle = angle
			
		if(centerX!=0 || centerY != 0)
		{
			userData.centerX = centerX;
			userData.centerY = centerY;
		}

		bxFix.SetUserData(userData);
		
		//10. Add sprite to Stage
		stage.addChild(actor);  

		body.SetAngle(angle);
		
		//11. Push body to array
		bodies.push(body);
		if(name == "cannon")
		{
/*
			//Mass shifting did not work. Cannons got too heavy and drowned down in stage.
			var bodyMassData = new b2MassData();
			body.GetMassData(bodyMassData);
			bodyMassData.mass = 100000;
			body.SetMassData(bodyMassData);
			body.ResetMassData();
			body.m_mass = 500;
			body.m_invMass = 0.002;
*/

/*
			//Weld joint is not very good solution. Although it helps in collision detection but it is not perfect in collision detection. After sometime, it stops detecting collisions. So it can not be used.
			var dynBody;
			if(fixtureX < stage.stageWidth/(2*SCALE))
				dynBody = addObjectToStage(stage, world, -6, "max", 1.5, 0.5, bitmapWidth, bitmapHeight, imageLoc, shape, "dynamic", "dynamic_cannon", friction, restitution, centerX, centerY, angle);
			
			else
				dynBody = addObjectToStage(stage, world, 6, "max", 1.5, 0.5, bitmapWidth, bitmapHeight, imageLoc, shape, "dynamic", "dynamic_cannon", friction, restitution, centerX, centerY, angle);
			
			dynamicCannons.push(dynBody);
			
			var weldJoint = new b2WeldJointDef();
			weldJoint.Initialize(dynBody, body, center);
			world.CreateJoint(weldJoint);
*/
			cannons.push(body);
			userData.cannonRecoilReverse = false;
		}
		
		
		//12. Generating smoke
		if(name == "cannon ball")
		{	
			animSmoke(fixtureX*SCALE, fixtureY*SCALE, 0, new Sprite(), angle);
		}
			
		//13. Push actors to array
		actors.push(actor);
			
		return body;
}

/*
Arguments of this method takes half of the actual width. And, images are compressed to half on the screen. 
So will have to multiply them by 4 before comparing with actual image pixels.
*/
function getAppropriateBlocker(width, height)
{
	width = width*4;
	height = height*4;
	
	if(width <= 350 && height <= 177)
	{
		return 'img/blocker_300_164.png';
	}
	else if(width <= 350 && height > 177)
	{
		return 'img/blocker_300_200.png';
	}
	else if(width <= 450 && height <= 177)
	{
		return 'img/blocker_400_164.png';
	}
	else if(width <= 450 && height > 177)
	{
		return 'img/blocker_400_200.png';
	}
	else if(width <= 550 && height <= 177)
	{
		return 'img/blocker_500_164.png';
	}
	else if(width <= 550 && height > 177)
	{
		return 'img/blocker_500_200.png';
	}
	else if(width <= 650 && height <= 177)
	{
		return 'img/blocker_600_164.png';
	}
	else if(width <= 650 && height > 177)
	{
		return 'img/blocker_600_200.png';
	}
	else if(width <= 750 && height <= 177)
	{
		return 'img/blocker_700_164.png';
	}
	else if(width <= 750 && height > 177)
	{
		return 'img/blocker_700_200.png';
	}
	else if(width <= 850 && height <= 177)
	{
		return 'img/blocker_800_164.png';
	}
	else if(width <= 850 && height > 177)
	{
		return 'img/blocker_800_200.png';
	}
	else if(width > 850 && height <= 177)
	{
		return 'img/blocker_900_164.png';
	}
	else if(width > 850 && height > 177)
	{
		return 'img/blocker_900_200.png';
	}
	
}

function getAppropriateBitmapWidth(width)
{
	width = width*4;
	
	if(width <= 350)
	{
		return -150;
	}
	else if(width <= 450)
	{
		return -200;
	}
	else if(width <= 550)
	{
		return -250;
	}
	else if(width <= 650)
	{
		return -300;
	}
	else if(width <= 750)
	{
		return -350;
	}
	else if(width <= 850)
	{
		return -400;
	}
	else if(width > 850)
	{
		return -450;
	}

}

function getAppropriateBitmapHeight(height)
{
	height = height*4;
	if(height <= 177)
	{
		return -82;
	}
	else
	{
		return -100;
	}

}