// src/data/restaurants.js

const restaurants = [
    {
        id: 1,
        name: "Kabul Darbar Restaurant",
        address: "55 Charing Cross Rd, London WC2H 0BL",
        cuisine: "Afghani",
        rating: 4.5,
        reviews: [
            { user: "Ali", comment: "Excellent food and service!" },
            { user: "Fatima", comment: "The lamb was perfectly cooked." },
        ],
        imageUrl: "https://example.com/restaurant1.jpg", // Replace with actual image URLs
    },
    {
        id: 2,
        name: "Lahore Karahi",
        address: "1 Tooting High St, London SW17 0SN",
        cuisine: "Pakistani",
        rating: 4.2,
        reviews: [
            { user: "Omar", comment: "Best karahi in town!" },
            { user: "Aisha", comment: "A bit spicy, but delicious." },
        ],
        imageUrl: "https://example.com/restaurant2.jpg", // Replace with actual image URLs
    },
    {
        id: 3,
        name: "Maroush",
        address: "21 Edgware Rd, London W2 2JE",
        cuisine: "Lebanese",
        rating: 4,
        reviews: [
            {user: 'John', comment: "First time trying Lebanese food, and it was so good"},
            {user: 'Jake', comment: "I love this resturant so much, it never misses."}
        ],
        imageUrl: 'https://example.com/resturant3.jpg' //Replace with actual image URLs
    }
    // Add more restaurants as needed
];

export default restaurants;
