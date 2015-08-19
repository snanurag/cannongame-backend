	var backgroundSoundFile = new Audio('/cg/sounds/bg1.ogg');
	var cannonSounds = [new Audio('/cg/sounds/cannon.ogg'), new Audio('/cg/sounds/cannon.ogg')];
	var winningSound = new Audio('/cg/sounds/winning.ogg');
	var failSound = new Audio('/cg/sounds/fail.ogg');
	var wallSound = [new Audio('/cg/sounds/ballvswall.ogg'),new Audio('/cg/sounds/ballvswall.ogg'),new Audio('/cg/sounds/ballvswall.ogg'),new Audio('/cg/sounds/ballvswall.ogg'),
					new Audio('/cg/sounds/ballvswall.ogg'),new Audio('/cg/sounds/ballvswall.ogg'),new Audio('/cg/sounds/ballvswall.ogg'),new Audio('/cg/sounds/ballvswall.ogg')];
	var castleSound = [new Audio('/cg/sounds/ballvsbuilding.ogg'),new Audio('/cg/sounds/ballvsbuilding.ogg'),new Audio('/cg/sounds/ballvsbuilding.ogg'),new Audio('/cg/sounds/ballvsbuilding.ogg')];
	var wallSoundCounter = 0;
	var castleSoundCounter = 0;
	
	function playCannon1Sound()
	{
		if(sound == 'on')
			cannonSounds[0].play();
	}
	
	function playCannon2Sound()
	{
		if(sound == 'on')
			cannonSounds[1].play();
	}
	
	function playWin()
	{
		if(sound == 'on')
			winningSound.play();
	}

	function playFail()
	{
		if(sound == 'on')
			failSound.play();
	}
	
	function playWall()
	{
		if(sound == 'on')
		{
			if(wallSoundCounter == wallSound.length)
				wallSoundCounter = 0;
			wallSound[wallSoundCounter++].play();
		}
	}
	
	function playCastle()
	{
		if(sound == 'on')
		{
			if(castleSoundCounter == castleSound.length)
				castleSoundCounter = 0;
			castleSound[castleSoundCounter++].play();
		}
	}

	function playSound(fileName)
	{
		if(sound == 'on')
		{
			fileName = 'sounds/'+fileName + '.ogg';
		
			var audioFile = new Audio(fileName);
			audioFile.play();
		}	
	}
	
	function playBackgroundSound()
	{
		playLoopBack(backgroundSoundFile);
	}
	
	function stopBackgroundSound()
	{
		stopLoopBack(backgroundSoundFile);
	}
	
	function playLoopBack(audio)
	{
		audio.addEventListener('ended', function() {
		this.currentTime = 0;
		this.play();
		}, false);
		audio.play();
	}
	
	function stopLoopBack(audio)
	{
		audio.pause();
		audio.currentTime = 0;
	}
	