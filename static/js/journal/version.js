﻿app.version.main = "v4.7.5 Build 030917_1225";

// Version number show up
$("#version").html(app.version.main);

/**
 * Version update change log and planned update
 *
 * Future:
 * [Add] Automatically create an entry based on \queue
 * [Add] Shortcut keys management
 * [Add] Disable rightclick everywhere
 *
 * Todo add an integrity check before logging in
 *
 * v4.7 - Diverse update
 * [Add] Added support for images in bulb
 * [Chg] The layout of map
 *
 * v4.6 - Calendar update
 * [Add] Add calendar on the left
 * [Chg] The UI when creating the journal
 *
 * v4.5 - Bulb update
 * [Chg] Refactor the code to make it easier to organize
 * [Chg] Put all .js into a single file to speed to load speed in China
 * [Add] Add Bulb functionality
 *
 * v4.4 - SCSS update
 * [Chg] Start using SCSS to organize .css file
 *
 * v4.2 - Comment update
 * [Add] Comment any entries!
 *
 * v4.1 - Patch on release beta
 * [Fix] Several bugs when using it
 *
 * v4.0 - Release build (Beta)
 * Now all the functionalities for writing the diary has been prepared. This
 * build minifies necessary files. The files are not compressed into one single
 * js file for the convenience of future maintenence
 *
 *
 * ===============================================================================
 * -------------------------------------------------------------------------------
 * ===============================================================================
 *
 * v3.26 - UI update v2
 * [Chg] Make log more efficient
 * [Chg] Add more details to fit material design
 * [Fix] Upload all and copy the core data instead of moving
 *
 * v3.25 Data analysis support
 * [Add] Graph and table analysis of keywords for data
 * [Fix] Data version did not update for all the data
 *
 * v3.24 HTML/CSS update
 * [Chg] Reduce redundant id's and css entries
 *
 * v3.23 Year support
 * [Add] View entries by years
 * [Chg] The orginazations of the file folders, by year to optimize the search
 *
 * v3.22 Debug version
 * [Fix] Fix the problems of previous two versions
 *
 * v3.21 List update
 * [Chg] How action buttons look like and the position of confirm button
 *
 * v3.20 - Network Update
 * [Add] Visual feedback for all the possible network activities
 * [Add] Throttle for some functions with network activities
 * [Chg] Remove the refresh-media button, and clean up the leftover
 * [Chg] Shorten the log feedback to provide more useful information
 * [Chg] Rename onedrive.v2.js to network.js and add more functions to that
 * file
 * [Fix] Covertype photo will now correctly be chosen
 *
 * v3.19 - Queue support
 * [Add] Support for /queue folder: now all the media can be added from /queue
 * [Fix] Photos will now not be removed should error occur during transfer
 *
 * v3.18 - Resource cleanup
 * [Add] Clean up resource folder so that media that no entry is related will
 * be moved to corresponding folders
 *
 * v3.17
 * [Chg] The structure of the game
 *    - Will recognize the version of the data and automatically update to the
 * latest version
 * [Chg] The function structure of the tag
 *    - To exploit shortcut to add icon and for future tag update
 *
 * v3.16
 * [Chg] The UI of the app
 *
 * v3.15 - Video support
 * [Add] Support for video display, add and removal
 *
 * v3.14 - Archive support
 * [Add] Archive file data organization
 *
 * v3.13 - Log update
 * [Chg] Visualize the hierachy of game log
 * [Chg] Clean and format the log info
 *
 * v3.12 - Audio support
 * [Add] Support for audio display, add and removal
 *
 * v3.11 - Font update
 * [Chg] Font from Segoe UI to FontAwesome
 *    - Some of the icons for tags and icontags are replaced
 * http://fontawesome.io
 *
 * v3.10 - Weather support
 * [Add] Weather will be automatically loaded if not specifed when the user
 * gets current location
 *
 * v3.9 - Auth update
 * [Chg] Change the authentication type to code flow to enable offline access
 *    - It requires CORS extension on Chrome
 *
 * v3.8 - Photo update
 * [Add] Display of bugs on the screen
 * [Add] Photos can be dragged to sort
 * [Fix] Photos upload problem
 *
 * v3.7 - Photo support
 * [Add] Edit pane can now add photos
 *
 * v3.6
 * [Add] Edit pane can now add website
 *
 * v3.5
 * [Add] Edit pane to edit the content of data
 * [Add] Edit pane can now add location, book, movie, music
 *
 * v3.4
 * [Add] Entry removal and upload the journal data
 *
 * v3.3
 * [Add] Media support
 *
 * v3.1-3.2
 * Start version tracking
 * Solving data display issue on the website
 * Trivia issues
 *
 * v3.0
 * Online version starts
 * First setup
 *
 * v2.0
 * Offline version
 * Version on my own desktop - able to read the local files but unable to write
 * it
 *
 * v1.0
 * Offline version
 * Version on my own desktop - the version of original Flava archive
 */