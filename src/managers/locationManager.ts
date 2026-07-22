const { PlacesClient } = require("@googlemaps/places").v1;
const { GoogleAuth } = require("google-auth-library");

const apiKey = process.env.GOOGLE_PLACES_API_KEY;
const auth = new GoogleAuth({ apiKey });
const placesClient = new PlacesClient(auth);
export class LocationManager {
  async getAutoCompleteLocations(location: string) {
    const request = {
      input: location,
    };
    const response = await placesClient.autocompletePlaces(request, {
      otherArgs: {
        headers: {
          "X-Goog-FieldMask":
            "suggestions.placePrediction.placeId,suggestions.placePrediction.text",
        },
      },
    });

    return this.cleanAutoCompleteResponse(response);
  }

  cleanAutoCompleteResponse(input: any) {
    //lopps through every single suggestion
    const suggestions = input[0].suggestions;
    const cleanSuggestions: any = [];

    suggestions.forEach((suggestion: any) => {
      cleanSuggestions.push({
        placeId: suggestion.placePrediction.placeId,
        name: suggestion.placePrediction.text.text,
      });
    });
    return cleanSuggestions;
  }

  async getPlace(placeId: string) {
    const request = {
      name: `places/${placeId}`,
    };

    const response = await placesClient.getPlace(request, {
      otherArgs: {
        headers: {
          "X-Goog-FieldMask": "id,displayName,formattedAddress,location",
        },
      },
    });

    return this.cleanPlaceResponse(response);
  }
  cleanPlaceResponse(input: any) {
    const place = input[0]; // place is the first item inm the array so im taking that

    return {
      // returns objecvts i care about
      placeId: place.id,
      name: place.displayName?.text,
      formattedAddress: place.formattedAddress,
      latitude: place.location?.latitude,
      longitude: place.location?.longitude,
    };
  }
}
