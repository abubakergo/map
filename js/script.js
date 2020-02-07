const mSocket = io(`https://polar-oasis-87239.herokuapp.com/passengers`);
mapboxgl.accessToken = 'pk.eyJ1IjoiYWJ1YmFrZXJobyIsImEiOiJjazZieG0yNnYxMzQ1M2pxanQ5YmdlMjhpIn0.d18HwvUjMTv8VavVlN6Fnw';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/abubakerho/ck53uwhjo080m1clab9c0u6l7',
    center: [33.2970194, 14.7530076],
    zoom: 15,
    attributionControl: false
});
map.on('load', async (ev) => {
    const data = {
    type: "FeatureCollection",
    features: []
    }
    map.addSource('notella', {type: 'geojson', data});
    map.addLayer({
        id: 'layer1',
        type: 'symbol',
        source: 'notella',
        paint: {
            "icon-opacity": 0.3
        },
        layout: {
            "icon-image": "{icon}",
            "icon-allow-overlap": true,
            "icon-size": 1,
        }
    });

    // update points
    mSocket.emit('get-last-points');
    mSocket.on('ping', function() {
        mSocket.emit('get-last-points');
    });
    mSocket.on('get-last-points-response', function(points) {
        const features = []
        for (const point of points) {
            const feature = {
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: point
                },
                properties: {
                    icon: "dot-red"
                }
            }
            features.push(feature)
        }
        data.features = features
        const source = map.getSource('notella')
        source.setData(data)
    });
});
