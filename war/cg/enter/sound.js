	var introSound = new Audio('../sounds/fp.ogg');
	
	function playSound(fileName)
	{
		fileName = 'sounds/'+fileName + '.ogg';
		
		var audioFile = new Audio(fileName);
		audioFile.play();
	}
	
	function playIntroSound()
	{
		playLoopBack(introSound);
	}
	
	function stopIntroSound()
	{
		stopLoopBack(introSound);
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
	