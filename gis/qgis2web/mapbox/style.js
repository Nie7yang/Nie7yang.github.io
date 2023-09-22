
var styleJSON = {
    "version": 8,
    "name": "qgis2web export",
    "pitch": 0,
    "light": {
        "intensity": 0.2
    },
    "sources": {
        "OpenStreetMap_0": {
            "type": "raster",
            "tiles": ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            "tileSize": 256
        },
        "watershed_WGS84_1": {
            "type": "geojson",
            "data": json_watershed_WGS84_1
        }
                    ,
        "_2": {
            "type": "geojson",
            "data": json__2
        }
                    },
    "sprite": "",
    "glyphs": "https://glfonts.lukasmartinelli.ch/fonts/{fontstack}/{range}.pbf",
    "layers": [
        {
            "id": "background",
            "type": "background",
            "layout": {},
            "paint": {
                "background-color": "#ffffff"
            }
        },
        {
            "id": "lyr_OpenStreetMap_0_0",
            "type": "raster",
            "source": "OpenStreetMap_0"
        },
        {
            "id": "lyr_watershed_WGS84_1_0",
            "type": "fill",
            "source": "watershed_WGS84_1",
            "layout": {},
            "paint": {'fill-opacity': 0.5, 'fill-color': '#f3a6b2'}
        }
,
        {
            "id": "lyr__2_0",
            "type": "circle",
            "source": "_2",
            "layout": {},
            "paint": {'circle-radius': ['/', 8.571428571428571, 2], 'circle-color': '#d50c12', 'circle-opacity': 1.0, 'circle-stroke-width': 2.857142857142857, 'circle-stroke-color': '#ffffff'}
        }
],
}