export const AI_PROMPT= `Generate Travel Plan for Location: {location}, for {days} Days for {companion} with a {budget} budget.
Give me a Hotels options list containing 4 hotels with HotelName, Hotel address, Price per night with currency symbol, hotel image url, geo coordinates, rating, descriptions
and suggest itinerary with placeName, Place Details, Place Image Url, Geo Coordinates,opening hours ,ticket Pricing,
,rating ,Time travel each of the location for {days} days with each day plan with best time to visit in JSON format.

Use this JSON format:

{
    "hotelOptions": [
      {
        "hotelName": "string",
        "hotelAddress": "string",
        "price": "string",
        "hotelImageUrl": "string",
        "geoCoordinates": { "latitude": number, "longitude": number },
        "rating": number,
        "description": "string"
      }
    ],
    "itinerary":[ 
      "day1": {
        "bestTimeToVisit": "string",
        "plan": [
          {
            "placeName": "string",
            "placeDetails": "string",
            "placeImageUrl": "string",
            "geoCoordinates": { "latitude": number, "longitude": number },
            "rating": number,
            "openingHours": "string",
            "ticketPricing": "string",
            "timeTravel": "string"
          }
        ]
      }
   ],
    "tripDetails": {
      "location": "{location}",
      "duration": "{days} Days",
      "budget": "{budget}",
      "travelers": {companion},
      "userEmail": "string"
    },
    
}


`