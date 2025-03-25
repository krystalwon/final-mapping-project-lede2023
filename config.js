// Number of slides that will drive (more = smoother)
// If this doesn't match the number of slides named 'drive-slide' in config below you will not complete the full journey
var driveSlides = 4;

// Number of points on drive route (more = higher quality, but slower to process)
var driveSmoothness = 300;

// Value used to drive
var driveTime = driveSlides*driveSmoothness;

// Do you want to follow the point? True = follow
var followPoint = true;

// ...If so, what zoom, pitch, and bearing should be used to follow?
var followZoomLevel = 16;
var followBearing = -30;
var followPitch = 45;

// to add 'driving' slides just make sure to add 'drive to beginning of slide id'
// you also need to add a running Order total to the end of each 'drive-slide', (ex. drive-slide-0, drive-slide-1, drive-slide-2, etc.)
var config = {
    style: 'mapbox://styles/mapbox/outdoors-v10',
    accessToken: 'pk.eyJ1IjoiZGFsaXZhbnBpY2Fzc29udW0yIiwiYSI6ImNtMTg0MGwzcTBxZnoybHB3dGsxOGs3N3MifQ.ubimGmdKCe9GNuSwkk5T6g',
    showMarkers: false,
    theme: 'light',
    alignment: 'left',
    chapters: [
        {
            id: 'drive-slide-0',
            title: 'Friday: Grocery Day!!',
            description: 
                '<p>Every Friday for the past two years, my roommate and I had a morning routine. Though there was a bus stop right next to our place that could take us to Trader Joe\'s, we always chose to walk. It was our way to conclude the boring school days and start the weekend with a right mood.</p>'+
                '<p><b>That 40-minute walk was our time to chat, plan the weekend, or just simply enjoy the silence with some fresh morning wind.</b></p>',
            location: {
                center: [-97.74808, 30.28815],
                zoom: 15.71,
                pitch: 63.00,
                bearing: -121.60
            },
            onChapterEnter: [],
            onChapterExit: []
        },
        {
            id: 'drive-slide-01',
            title: 
                'This route always holds a special place in my heart',
            description: 
                '<p>This mere 40-minute stroll can feel like a journey through the very essence of the city.</p>'+'<p>Beginning in the student-rich enclave of West Campus, our path would meander towards the heart of downtown.</p>'+'<h3>To me, it is a walk that, in its simplicity, captures the complex tapestry of Austin.</h3>',
            location: {
                center: [-97.74590, 30.28211],
                zoom: 15.03,
                pitch: 38.00,
                bearing: -146.40
            },
            mapAnimation: 'flyTo',
            onChapterEnter: [],
            onChapterExit: []
        },
        {
            id: 'drive-slide-02',
            title: 'Well...sometime we do encounter random roadblocks :|',
            image: './charts/images/roadblock.png',
            location: {
                center: [-97.74990, 30.27611],
                zoom: 16.5,
                pitch: 50.00,
                bearing: -120.00
            },
            onChapterEnter: [],
            onChapterExit: []
        },
        {
            id: 'slide-01',
            title: "Picking up some nostalgia moment :)",
            image: './charts/images/waterloo.png',
            description: 
                '<p>Now we arrives at the testament to Austin\'s rich musical lineage: <b>Waterloo Records.</b></p>'
                +'<p>It\'s more than just a record store for me—<b>it\'s my personal sanctuary</b>, a place where vinyl and nostalgia spin in harmonious synchrony. In a world rapidly turning Spotify, this shop stands as a defiant ode to the tactile joy of music, making it <b>the finest record store on the planet</b><i> (in my own pov!)</i>!</p>',
            location: {
                center: [-97.75023, 30.27142],
                zoom: 16.50,
                pitch: 50.00,
                bearing: -120.00
            },
            onChapterEnter: [],
            onChapterExit: []
        },
        {
            id: 'slide-02',
            title: 'Gotta Introduce Some of My Favs at All Time:',
            image: './charts/images/vinyl.png', 
            location: {
                center: [-97.75023, 30.27142], 
                zoom: 16.50,
                pitch: 50.00,
                bearing: -118.00
            },
            onChapterEnter: [],
            onChapterExit: []
        },
        {
            id: 'slide-03',
            title: 'This Is A Busy Block: Where Vinyl Meets Verse',
            image: './charts/images/bookpeople.png',
            description: 
                '<p>Right across the record store stands the largest independent bookstore in the state. <b>BookPeople</b> has been a staple of Austin\'s literary scene since 1970. They are taking all approaches to make the city a beloved spot for book lovers and a cultural hub in Austin. </p>',
            location: {
                center: [-97.75111, 30.27125], // BookPeople
                zoom: 16.50,
                pitch: 50.00,
                bearing: -122.00
            },
            onChapterEnter: [],
            onChapterExit: []
        },
        {
            id: 'drive-slide-03',
            image: './charts/images/bannedbooks.png',
            description: '<p>At a time when book banning was sweeping the nation, BookPeople took a defiant stand.</p>'+'<p>Proudly, on the first floor, they showcased a vast display of all the banned titles, reminding everyone who entered about the power of books and the importance of intellectual freedom.</p>',
            location: {
                center: [-97.75111, 30.27125], 
                zoom: 16.50,
                pitch: 50.00,
                bearing: -120.00
            },
            onChapterEnter: [],
            onChapterExit: []
        },
        {
            id: 'slide-04',
            title: 'Highlight of the Day!!!!!!!',
            image: './charts/images/merit.png',
            description: 
                '<p>Before hitting up Trader Joe\'s, we always made a stop at <b>Merit Coffee</b>. Their pastries and coffee became our Friday morning must-haves.</p>' + '<p>We became such regulars that we befriended (almost) all the baristas.</p>',
            location: {
                center: [-97.75, 30.26659], 
                zoom: 16.03,
                pitch: 38.00,
                bearing: -146.40
            },
            onChapterEnter: [],
            onChapterExit: []
        },
        {
            id: 'slide-05',
            title: 'According to an uncompleted statistic from my complexed album dataset...',
            image: './charts/images/coffee.png',
            location: {
                center: [-97.75, 30.26659], 
                zoom: 16.03,
                pitch: 38.00,
                bearing: -146.40
            },
            onChapterEnter: [],
            onChapterExit: []
        },
        {
            id: 'slide-06',
            title: 'Another hobby of us is \'Dog Watching\'',
            image: './charts/images/dog.png',
            location: {
                center: [-97.75, 30.26659], 
                zoom: 16.03,
                pitch: 38.00,
                bearing: -146.40
            },
            onChapterEnter: [],
            onChapterExit: []
        },

        {
            id: 'drive-slide-07',
            title: 'Around noon time, we fiiiinallly move our foot into Trader Joe\'s. 🍾',
            image: './charts/images/flower.png',
            description:  
                '<p>But in addition to filling our carts with eggs and milk, we\'d also make a special pick: our <b>"flower of the week"</b> to conclude our Friday.</p>',
            location: {
                center: [-97.75171, 30.26627],
                zoom: 16.03,
                pitch: 38.00,
                bearing: -146.40
            },
            onChapterEnter: [],
            onChapterExit: []
        },  
    ]
};