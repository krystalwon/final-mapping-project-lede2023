if (!turf.length && turf.lineDistance) {
    turf.length = turf.lineDistance;
} else if (!turf.lineDistance && turf.length) {
    turf.lineDistance = turf.length;
}

var routeData = [];

var geojsonPoint = {
    "type": "FeatureCollection",
    "features": [{
        "type": "Feature",
        "geometry": {
            "type": "LineString",
            "coordinates": [
        
            ]
        }
    }]
};

function createLine() {
    // Check if routeData is loaded and has the expected structure
    if (!routeData || !routeData.features || !routeData.features[0] || !routeData.features[0].geometry || !routeData.features[0].geometry.coordinates) {
        console.error('Route data is not properly loaded or structured');
        return;
    }

    console.log('Creating line with route data:', routeData);
    
    // get the coordinates of the line you want to highlight
    let extentArray = routeData.features[0].geometry.coordinates;
    
    // create a turf linestring based on the line coordinates
    const line = turf.lineString(extentArray);

    // calculate the total length of the line
    const lineDistance = turf.lineDistance(line);

    // how many points you want along the path (more = smoother animation)
    const rects = driveTime;

    // calculate the distance between each point on the path
    const segments = lineDistance / rects;

    // what units do you want to use?
    const units = 'kilometers';

    // based on the number of points...
    for(let i = 0; i <= rects; i++) {

        // calculate point location for each segment
        const pointonline = turf.along(line, (segments * i), {units: units});

        // push new x,y
        let newX = pointonline.geometry.coordinates[0];
        let newY = pointonline.geometry.coordinates[1];

        geojsonPoint.features[0].geometry.coordinates.push([newX, newY]);

        // draw our initinal point
        if (i === 0) {
            let initPoint = turf.point([newX, newY]);

            // if you want to follow the point...
            if (followPoint === true) {
                map.setCenter([newX, newY]);
            }

            map.getSource('pointSource').setData(initPoint);
        }

        // once 'i' equals the number of points then we're done building our line 
        if (i == rects) {
            map.getSource('lineSource').setData(geojsonPoint);
        }
    }
}

function changeCenter(index) {
    // Make sure we have coordinates first
    if (!geojsonPoint.features[0].geometry.coordinates.length) {
        console.error('No coordinates available for animation');
        return;
    }

    // Make sure the index doesn't exceed our coordinates array length
    if (index >= geojsonPoint.features[0].geometry.coordinates.length) {
        index = geojsonPoint.features[0].geometry.coordinates.length - 1;
    }

    let currentJson = geojsonPoint.features[0].geometry.coordinates.slice(0, index);
    let center = geojsonPoint.features[0].geometry.coordinates[index];
    
    // Check if center exists
    if (!center) {
        console.error('Invalid center point at index:', index);
        return;
    }
    
    let centerX = center[0];
    let centerY = center[1];
    let movingLine = {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": currentJson
            }
        }]
    };
    let movingPoint = turf.point([centerX, centerY]);
    
    try {
        map.getSource('lineSource').setData(movingLine);
        map.getSource('pointSource').setData(movingPoint);

        // if you want to follow the point...
        if (followPoint === true) {
            // Only transition at certain intervals for performance
            // Adjust this number to control transition frequency
            let transitionInterval = 50; 
            
            if (index % transitionInterval == 0) {
                console.log("changeCenter(index) = ", index, center);
                
                // Use flyTo instead of jumpTo for smooth animation
                map.flyTo({
                    center: [centerX, centerY],
                    zoom: followZoomLevel,
                    bearing: followBearing,
                    pitch: followPitch,
                    speed: 0.5, // Controls animation speed (lower = slower)
                    curve: 1, // Controls animation curve (higher = more pronounced)
                    essential: true // Animation is considered essential for the user experience
                });
            }
        }
    } catch (error) {
        console.error('Error updating map sources:', error);
    }
}

// zoom to specific locations
function zoomToLocation(locationId, zoomLevel, bearing, pitch) {
    // Find the location in config.chapters
    const location = config.chapters.find(chap => chap.id === locationId);
    
    if (location && location.location && location.location.center) {
        map.flyTo({
            center: location.location.center,
            zoom: zoomLevel || 15, // Default zoom if not specified
            bearing: bearing || 0, // Default bearing if not specified
            pitch: pitch || 60, // Default pitch if not specified
            duration: 2000, // Animation duration in milliseconds
            essential: true
        });
    } else {
        console.error(`Location with ID "${locationId}" not found or has no center coordinates`);
    }
}


function setupMapClickCoordinates() {
    map.on('click', function(e) {
      var coordinates = e.lngLat;
      console.log(`Clicked coordinates: center: [${coordinates.lng.toFixed(5)}, ${coordinates.lat.toFixed(5)}]`);
      
      // Copy to clipboard for easy pasting
      navigator.clipboard.writeText(`center: [${coordinates.lng.toFixed(5)}, ${coordinates.lat.toFixed(5)}]`)
        .then(() => console.log('Coordinates copied to clipboard'))
        .catch(err => console.error('Error copying to clipboard:', err));
        
      // Show a popup with coordinates
      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(`<strong>Coordinates:</strong><br>[${coordinates.lng.toFixed(5)}, ${coordinates.lat.toFixed(5)}]<br><small>(Copied to clipboard)</small>`)
        .addTo(map);
    });
}


function verifySlideOrder() {
    console.log("=== Verifying Slide Order ===");
    console.log("(Check that these locations make sense in sequence)");
    
    // Extract just the necessary info for debugging
    const slideInfo = config.chapters.map((chapter, index) => {
      return {
        index: index,
        id: chapter.id,
        title: chapter.title || "(No title)",
        location: chapter.location && chapter.location.center ? 
          `[${chapter.location.center[0]}, ${chapter.location.center[1]}]` : 
          "No location"
      };
    });
    
    console.table(slideInfo);
    
    // Check for route continuity
    console.log("\n=== Checking Route Continuity ===");
    
    // Only look at drive slides
    const driveSlides = config.chapters.filter(chapter => 
      chapter.id.startsWith('drive-slide'));
    
    console.log(`Found ${driveSlides.length} drive slides (driveSlides variable is set to ${driveSlides})`);
    
    if (driveSlides.length > 0) {
      console.log("\nDrive Slides Sequence:");
      driveSlides.forEach((slide, i) => {
        if (i > 0 && driveSlides[i-1].location && slide.location) {
          const prev = driveSlides[i-1].location.center;
          const curr = slide.location.center;
          const distance = calculateDistance(prev[1], prev[0], curr[1], curr[0]);
          console.log(`${slide.id}: ${slide.title || "(No title)"} - Distance from previous: ${distance.toFixed(2)} km`);
        } else {
          console.log(`${slide.id}: ${slide.title || "(No title)"}`);
        }
      });
    }
  }
  
  // Simple distance calculation between two points (Haversine formula)
  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2-lat1);
    const dLon = deg2rad(lon2-lon1); 
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; // Distance in km
    return d;
}



function addDebugControls() {
    // Create a container for debug controls
    const controlDiv = document.createElement('div');
    controlDiv.className = 'debug-controls';
    controlDiv.style.position = 'absolute';
    controlDiv.style.top = '10px';
    controlDiv.style.right = '10px';
    controlDiv.style.zIndex = '1000';
    controlDiv.style.backgroundColor = 'white';
    controlDiv.style.padding = '10px';
    controlDiv.style.borderRadius = '4px';
    controlDiv.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
    
    // Add a button for each key location
    const locations = [
      { name: "Waterloo", coords: [-97.75023, 30.27142] },
      { name: "BookPeople", coords: [-97.75111, 30.27125] },
      { name: "Merit Coffee", coords: [-97.74793, 30.26659] },
      { name: "Trader Joe's", coords: [-97.75097, 30.26972] }
    ];
    
    // Add a title
    const title = document.createElement('div');
    title.textContent = 'Test Locations';
    title.style.fontWeight = 'bold';
    title.style.marginBottom = '8px';
    controlDiv.appendChild(title);
    
    // Add buttons for each location
    locations.forEach(loc => {
      const button = document.createElement('button');
      button.textContent = loc.name;
      button.style.display = 'block';
      button.style.margin = '4px 0';
      button.style.padding = '4px 8px';
      
      button.addEventListener('click', () => {
        map.flyTo({
          center: loc.coords,
          zoom: 18,
          pitch: 60,
          bearing: 0,
          duration: 1500
        });
      });
      
      controlDiv.appendChild(button);
    });
    
    // Add a toggle for showing coordinates on click
    const toggleDiv = document.createElement('div');
    toggleDiv.style.marginTop = '8px';
    
    const toggle = document.createElement('input');
    toggle.type = 'checkbox';
    toggle.id = 'coord-toggle';
    
    const label = document.createElement('label');
    label.htmlFor = 'coord-toggle';
    label.textContent = 'Show coords on click';
    label.style.marginLeft = '4px';
    label.style.fontSize = '12px';
    
    toggle.addEventListener('change', (e) => {
      if (e.target.checked) {
        setupMapClickCoordinates();
      }
    });
    
    toggleDiv.appendChild(toggle);
    toggleDiv.appendChild(label);
    controlDiv.appendChild(toggleDiv);
    
    // Add to map
    document.body.appendChild(controlDiv);
  }
  
  // Call this after map is loaded:
  // map.on('load', function() {
  //   ...existing code...
  //   addDebugControls();
  // });