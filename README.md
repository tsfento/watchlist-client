# Watchlist Client

The watchlist client is the frontend of my full stack project for CodeLabs. It is an interace for interacting with the backend API, as well as themoviedb.org API. It is not comprehensive. The basic features are browsing categories of titles from themovideb.org, adding those titles to lists, and marking those titles watched with the optional ability to rate and review.


# Architecture

The main components are **Home** and **Lists**. **Home** is the starting point where a user can browse titles pulled from themoviedb.org. Once past the main categories, the user will be provided with recommendations based on titles they have rated positively. If no titles have been rated or all rated titles have had recommendations, the user will be notified to rate more titles for more recommendations.

**Lists** is where the user can view their lists of titles. They are also able to view lists they are following, as well as all available lists that are not private.

# Setup

TODO

# Packages Used

The client utilizes no additional packages at this time.

# Backend API

The backend API repository is located at: https://github.com/tsfento/watchlist-api
