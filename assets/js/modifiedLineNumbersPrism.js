Prism.hooks.add('after-highlight', function (env) {
	// works only for <code> wrapped inside <pre data-line-numbers> (not inline)
	var pre = env.element.parentNode;
	var multiLineCheck = env.code.match(/\n(?!$)/g);

	//ignore if not a pre element or if only one line
	if (!pre || !/pre/i.test(pre.nodeName) || !multiLineCheck) {
		return;
	}

	//for the highlighting CSS
	if(pre.className.indexOf('line-numbers') === -1) {
		pre.className += ' line-numbers';
	}

	var linesNum = multiLineCheck.length + 1;
	var lineNumbersWrapper;

	var lines = new Array(linesNum + 1);
	lines = lines.join('<span></span>');

	lineNumbersWrapper = document.createElement('span');
	lineNumbersWrapper.className = 'line-numbers-rows';
	lineNumbersWrapper.innerHTML = lines;

	if (pre.hasAttribute('data-start')) {
		pre.style.counterReset = 'linenumber ' + (parseInt(pre.getAttribute('data-start'), 10) - 1);
	}

	env.element.appendChild(lineNumbersWrapper);

});