export const controlsHandler = (controls) => {
	const newControls = [];
	Object.keys(controls).map(item => {
		if (controls[item]) {
			newControls.push(item);
		}
	});
	return newControls;
};

export const getExtension = (fileName) => fileName.substring(fileName.lastIndexOf('.') + 1);