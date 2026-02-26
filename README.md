# Graph Lab — Social Network Features (Loops + If/Else)

> You will build a small **social network** using a **graph**.
>
> * **People = nodes**
> * **Friendships = edges** (two-way)
> * Your network will be stored as an **adjacency list** (an object where each person has a list of friend IDs).
>
> **Focus:** Strengthen **for-loops** and **if/else** logic.

---

## Learning Goals

By the end, you should be able to:

* Represent a graph using plain JavaScript objects and arrays
* Add/update nodes and edges safely (avoid duplicates, handle missing users)
* Use loops + if/else to:

  * suggest friends (friends-of-friends)
  * filter “People You May Know”
  * calculate profile completeness

---

## How to Work Through This Project

1. **Feel free to use AI. But not as a whole, do it step-by-step for each function**
2. **Create a new js file and write the function on your own. Repititon will help you in building the logic muslce. Also, trace the logic with pen & paper**
3. **Repeat the same for every function**

---

## Data Structure

You will store your social network in an **object**.

Each person should have:

* `details`: basic profile information (name, city, bio, school, etc.)
* `friends`: an array of friend IDs

### Example starter object (you may modify fields)

```js
const network = {
  smo: {
    details: { name: "Smo", city: "Vancouver", bio: "", school: "", company: "" },
    friends: ["palvreet", "brian"]
  },
  palvreet: {
    details: { name: "Palvreet", city: "Toronto", bio: "Likes basketball", school: "", company: "" },
    friends: ["smo", "cory", "jasmine"]
  },
  cory: {
    details: { name: "Cory", city: "Vancouver", bio: "", school: "", company: "" },
    friends: ["palvreet", "brian"]
  },
  brian: {
    details: { name: "Brian", city: "Montreal", bio: "", school: "", company: "" },
    friends: ["smo", "cory"]
  },
  jasmine: {
    details: { name: "Jasmine", city: "Vancouver", bio: "", school: "", company: "" },
    friends: ["palvreet"]
  }
};
```

---

## Core Feature A — Add Friendship

### 1) `addFriendship(network, user1, user2)`

Add a friendship between two users. Friendships are two-way (bidirectional).

**Rules:**

* If either user doesn't exist, add them to the network with default details.
* Add each user to the other's friends list if not already present (avoid duplicates).
* Friendships are mutual.

### What this function must do (step-by-step)

1. Check if `user1` exists in the network. If not, create a new entry with default details and empty friends array.
2. Check if `user2` exists in the network. If not, create a new entry with default details and empty friends array.
3. If `user2` is not already in `user1`'s friends list, add it.
4. If `user1` is not already in `user2`'s friends list, add it.

---

## Core Feature B — Suggest Friends (Friends-of-Friends)

### 2) `suggestFriends(network, personId)`

Suggest friends based on **friends of friends**.

**Rules:**

A suggested person must:

* Not be the same as `personId`
* Not already be a direct friend
* Appear through at least one mutual friend

**Output requirement:**

Return an array of objects like:

* `{ id: "cory", mutualCount: 2 }`

**Ranking rule:**

Sort suggestions from **highest mutualCount → lowest**.

### What this function must do (step-by-step)

1. If `personId` doesn't exist, return an empty list.
2. Create a structure to count mutuals, e.g.:

   * `counts = {}` where keys are candidate IDs and values are counts
3. Loop through each **direct friend** of `personId`.
4. For each direct friend, loop through their friends (friends-of-friends).
5. For each candidate:

   * If candidate is the user → skip
   * If candidate is already a direct friend → skip
   * Otherwise:

     * Increase their count in `counts`
6. Convert `counts` into an array of `{ id, mutualCount }`.
7. Sort it by `mutualCount` descending.
8. Return the sorted array.

---

## Core Feature C — People You May Know (Filters)

### 3) `peopleYouMayKnow(network, personId, options)`

This is like `suggestFriends`, **plus filters**.

**Your function should reuse the same friend-of-friend logic**, then apply filtering rules.

### Options (your filters)

Your `options` object can include:

* `minMutualFriends` (number)

  * Only include candidates with mutualCount ≥ this number

* `sameCityOnly` (boolean)

  * Only include candidates whose `details.city` matches the user's city

> You may add ONE extra filter of your own (optional).

### What this function must do (step-by-step)

1. Start by generating suggestions with mutual counts (same logic as `suggestFriends`).
2. Loop over the suggestions and apply filters using if/else:

   * if mutualCount < minMutualFriends → skip
   * if sameCityOnly and cities don't match → skip
   * if candidate in excludeList → skip
3. Return the filtered results (keep sorting by mutualCount).

---

## Core Feature D — Profile Completeness

### 4) `profileCompleteness(network, personId)`

Return a score from **0 to 100** based on profile fields.

### Scoring Rules (100 total)

* +20 if `name` is present and not empty
* +20 if `city` is present and not empty
* +20 if `bio` is present and not empty
* +20 if at least one of `school` or `company` is present
* +20 if user has **3 or more** friends

### What this function must do (step-by-step)

1. If person doesn't exist, return 0.
2. Start score at 0.
3. Use if/else checks for each rule and add points.
4. Return final score.

---

## Required Test Runs (Documentation)

In your README (or a short write-up), include:

1. **Explain your data structure** (adjacency list + details)

2. **Explain each function** in 1–2 sentences:

* addFriendship
* suggestFriends
* peopleYouMayKnow
* profileCompleteness

3. Show **at least 3 example runs** with outputs:

* Example A: `addFriendship(network, "smo", "cory")` followed by logging the network
* Example B: `suggestFriends(network, "jasmine")`
* Example C: `peopleYouMayKnow(network, "brian", { minMutualFriends: 2, sameCityOnly: true })`
* Example D: `profileCompleteness(network, "palvreet")`

---

## Rules

* Use **plain JavaScript** only.
* Use **for-loops** and **if/else**.
* Focus on clear logic and readable variable names.

---

## Optional Challenge (Pick One)

Choose ONE:

* Add `removeFriendship(network, personA, personB)` (two-way removal + edge cases)
* Add a filter: `sameSchoolOnly`
* Add an explanation output: show the mutual friends list for the top suggestion
