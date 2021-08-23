
function getUrl() {
    var urlActual = window.location;
    var port = 9000;
    return `http://${urlActual.hostname}:${port}`;
}
export default {
	API_URL_HOST: 'http://localhost:53438/',
	//API_URL_HOST: getUrl(),
	API_URL_DYNAMIC: getUrl(),
	IMG_NOT_FOUND : `public/Images/Imgen_no_disponible.jpg`
}