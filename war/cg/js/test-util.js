function fadeDiv(box)
{
	box.classList.add('fadeout');

}

function start()
{
	var boxOne = document.getElementById('openModalL');

			setTimeout(fadeDiv, 5000, boxOne);
	
	var iDiv = document.createElement('div');
	iDiv.innerHTML = '<p>testing this ..... </p>';
	boxOne.appendChild(iDiv);
	

}
