// Social Network Starter File
// Based on the README instructions
// Implement the functions below using the step-by-step guidance

// Data Structure: Adjacency list with details
const network = {
  smo: {
    details: { name: "Smo", city: "Toronto", bio: "", school: "", company: "" },
    friends: ["palvreet", "brian"]
  },
  palvreet: {
    details: { name: "Palvreet", city: "Toronto", bio: "Likes basketball", school: "", company: "" },
    friends: ["smo", "cory", "jasmine"]
  },
  cory: {
    details: { name: "Cory", city: "Montreal", bio: "", school: "", company: "" },
    friends: ["palvreet", "brian"]
  },
  brian: {
    details: { name: "Brian", city: "Toronto", bio: "", school: "", company: "" },
    friends: ["smo", "cory"]
  },
  jasmine: {
    details: { name: "Jasmine", city: "Toronto", bio: "", school: "", company: "" },
    friends: ["palvreet"]
  }
};

// Shared helper functions
function createDefaultUser(userId) {
  return {
    details: { name: userId, city: "", bio: "", school: "", company: "" },
    friends: []
  };
}

function isAlreadyFriend(friendsList, friendId) {
  return friendsList.includes(friendId);
}

function isSameUser(userA, userB) {
  return userA === userB;
}

function increaseMutualCount(counts, candidateId) {
  if (!counts[candidateId]) {
    counts[candidateId] = 0;
  }
  counts[candidateId] = counts[candidateId] + 1;
}

function buildSuggestionsFromCounts(counts) {
  const suggestions = [];
  const candidateIds = Object.keys(counts);

  for (let index = 0; index < candidateIds.length; index++) {
    const candidateId = candidateIds[index];
    suggestions.push({ id: candidateId, mutualCount: counts[candidateId] });
  }

  return suggestions;
}

function sortSuggestionsByMutualCount(suggestions) {
  suggestions.sort(function (a, b) {
    return b.mutualCount - a.mutualCount;
  });
}

function hasText(value) {
  return typeof value === "string" && value.trim() !== "";
}

// Optional Challenge: Find the exact mutual friends between a user and a suggested person.
function getMutualFriends(network, personId, candidateId) {
  const mutualFriends = [];
  const personFriends = network[personId].friends;
  const candidateFriends = network[candidateId].friends;

  for (let index = 0; index < personFriends.length; index++) {
    const friendId = personFriends[index];
    if (candidateFriends.includes(friendId)) {
      mutualFriends.push(friendId);
    }
  }

  return mutualFriends;
}

// Optional Challenge: Explain the top suggestion and show the mutual friends list.
function explainTopSuggestion(network, personId) {
  const suggestions = suggestFriends(network, personId);

  if (suggestions.length === 0) {
    return {
      personId: personId,
      topSuggestion: null,
      message: "No suggestions available"
    };
  }

  const topSuggestion = suggestions[0];
  const mutualFriends = getMutualFriends(network, personId, topSuggestion.id);

  return {
    personId: personId,
    topSuggestion: {
      id: topSuggestion.id,
      mutualCount: topSuggestion.mutualCount,
      mutualFriends: mutualFriends
    }
  };
}

// Core Feature A — Add Friendship (Function Start)
function addFriendship(network, user1, user2) {
  // 1. Check if user1 exists in the network. If not, create a new entry with default details and empty friends array.
  if (!network[user1]) {
    network[user1] = createDefaultUser(user1);
  }

  // 2. Check if user2 exists in the network. If not, create a new entry with default details and empty friends array.
  if (!network[user2]) {
    network[user2] = createDefaultUser(user2);
  }

  // 3. If user2 is not already in user1's friends list, add it.
  if (!isAlreadyFriend(network[user1].friends, user2)) {
    network[user1].friends.push(user2);
  }

  // 4. If user1 is not already in user2's friends list, add it.
  if (!isAlreadyFriend(network[user2].friends, user1)) {
    network[user2].friends.push(user1);
  }
}

// Core Feature B — Suggest Friends (Friends-of-Friends)
function suggestFriends(network, personId) {
  // 1. If personId doesn't exist, return an empty list.
  if (!network[personId]) {
    return [];
  }

  // 2. Create a structure to count mutuals, e.g.: counts = {} where keys are candidate IDs and values are counts
  const counts = {};

  // 3. Loop through each direct friend of personId.
  const directFriends = network[personId].friends;
  for (let friendIndex = 0; friendIndex < directFriends.length; friendIndex++) {
    const directFriendId = directFriends[friendIndex];

    // 4. For each direct friend, loop through their friends (friends-of-friends).
    const friendsOfDirectFriend = network[directFriendId].friends;
    for (let candidateIndex = 0; candidateIndex < friendsOfDirectFriend.length; candidateIndex++) {
      // 5. For each candidate:
      //    - If candidate is the user → skip
      //    - If candidate is already a direct friend → skip
      //    - Otherwise: Increase their count in counts
      const candidateId = friendsOfDirectFriend[candidateIndex];

      if (isSameUser(candidateId, personId)) {
        continue;
      }

      if (isAlreadyFriend(directFriends, candidateId)) {
        continue;
      }

      increaseMutualCount(counts, candidateId);
    }
  }

  // 6. Convert counts into an array of { id, mutualCount }.
  const suggestions = buildSuggestionsFromCounts(counts);

  // 7. Sort it by mutualCount descending.
  sortSuggestionsByMutualCount(suggestions);

  // 8. Return the sorted array.
  return suggestions;
}

// Core Feature C — People You May Know (Filters)
function peopleYouMayKnow(network, personId, options) {
  // 1. Start by generating suggestions with mutual counts (same logic as suggestFriends).
  const suggestions = suggestFriends(network, personId);

  // 2. Loop over the suggestions and apply filters using if/else:
  //    - if mutualCount < minMutualFriends → skip
  //    - if sameCityOnly and cities don't match → skip
  //    - if candidate in excludeList → skip
  const filteredSuggestions = [];
  const filterOptions = options || {};
  const minMutualFriends = filterOptions.minMutualFriends || 0;
  const sameCityOnly = filterOptions.sameCityOnly || false;
  const excludeList = filterOptions.excludeList || [];

  const userCity = network[personId] ? network[personId].details.city : "";

  for (let index = 0; index < suggestions.length; index++) {
    const suggestion = suggestions[index];
    const candidateId = suggestion.id;
    const candidateCity = network[candidateId].details.city;

    if (suggestion.mutualCount < minMutualFriends) {
      continue;
    } else if (sameCityOnly && candidateCity !== userCity) {
      continue;
    } else if (excludeList.includes(candidateId)) {
      continue;
    }

    filteredSuggestions.push(suggestion);
  }

  // 3. Return the filtered results (keep sorting by mutualCount).
  return filteredSuggestions;
}

// Core Feature D — Profile Completeness
function profileCompleteness(network, personId) {
  // 1. If person doesn't exist, return 0.
  if (!network[personId]) {
    return 0;
  }

  // 2. Start score at 0.
  let score = 0;

  // 3. Use if/else checks for each rule and add points.
  const person = network[personId];
  const details = person.details;

  if (hasText(details.name)) {
    score = score + 20;
  }

  if (hasText(details.city)) {
    score = score + 20;
  }

  if (hasText(details.bio)) {
    score = score + 20;
  }

  if (hasText(details.school) || hasText(details.company)) {
    score = score + 20;
  }

  if (person.friends.length >= 3) {
    score = score + 20;
  }

  // 4. Return final score.
  return score;
}

// Example usage (uncomment to test)
console.log("Initial network:", network);
addFriendship(network, "smo", "cory");
console.log("After adding friendship:", network);
console.log("Suggestions for smo:", suggestFriends(network, "jasmine"));
console.log("Filtered suggestions:", peopleYouMayKnow(network, "brian", { minMutualFriends: 2, sameCityOnly: true }));
console.log("Profile completeness for smo:", profileCompleteness(network, "palvreet"));
console.log("Top suggestion explanation:", explainTopSuggestion(network, "jasmine"));