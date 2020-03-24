export default function loadGoogleMaps(googleUrl) {
    return new Promise((resolve, reject) => {
        const existingScript = document.getElementById('googleMaps');
        console.log("existingScript", existingScript);
        if (!existingScript) {
            const script = document.createElement('script');
            script.src = googleUrl;
            script.id = 'googleMaps';
            document.body.appendChild(script);
            script.onload = () => {
                resolve(true);
            };
        } else {
            reject();
        }
        //if (existingScript && callback) callback();
    });
}