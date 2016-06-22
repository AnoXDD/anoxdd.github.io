/**
 * A file to do things with bulbs
 * Created by Anoxic on 061616.
 */

"use strict";

window.bulb = function() {
    /**
     * These are the data to be processed
     * @type {{}} Format: {time: {content, location: [longitude, latitude],
     *     website: [], id, url, isAttached, isUploaded...}}
     */
    var _data = {};
    /**
     * The number of bulbs fetched from the bulb folder, in total
     * @type {number}
     */
    var _totalBulbs = 0;

    /**
     * Extracts the website in a timestamp
     * @param timestamp
     * @private
     */
    function _extractWebsiteFromContent(timestamp) {
        var data = _data[timestamp]["content"];
        var websitePattern = /@https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
        var result = data.match(websitePattern);
        _data[timestamp]["website"] = result[0];
        // Remove the website
        data.replaceAll(websitePattern, "");
    };

    /**
     * Extracts the location in a timestamp
     * @param timestamp
     * @private
     */
    function _extractLocationFromContent(timestamp) {
        // Location, without name
        var locationPattern = /#\[-?[0-9]+\.[0-9]+,-?[0-9]+\.[0-9]+\]/g;
        var result = _data[timestamp]["content"].match(locationPattern);
        if (result) {
            result = result[0].split(',');
            _data[timestamp]["location"] = {
                lat: result[0],
                long: result[1]
            };
            // Remove the location
            data.replaceAll(locationPattern, "");
        } else {
            // Location, with name
            locationPattern = /#\[.+,-?[0-9]+\.[0-9]+,-?[0-9]+\.[0-9]+\]/g;
            result = data.match(locationPattern);
            if (result) {
                result = result[0].split(",");
                _data[timestamp]["location"] = {
                    name: result[0],
                    lat: result[1],
                    long: result[2]
                };
            }
        }
    };

    return {
        /**
         * Whether there is any merging in progress
         * This prevents the archive being uploaded
         */
        isMergingInProgress: false,

        setdata: function(timestamp, data) {
            _data[timestamp] = data;
        },

        /**
         * Todo test this method
         * Returns the time from epoch given the representation of bulb
         * filename (in the format of mmddyy_hhmmss)
         * @param {string} myStr - The filename of bulb
         */
        getTimeFromEpoch: function(myStr) {
            var month = parseInt(myStr.substr(0, 2));
            var day = parseInt(myStr.substr(2, 2));
            var year = 2000 + parseInt(myStr.substr(4, 2));
            var hour = parseInt(myStr.substr(7, 2));
            var minute = parseInt(myStr.substr(9, 2));
            var second = parseInt(myStr.substr(11, 2));

            return new Date(year, month - 1, day, hour, minute, second).getTime();
        },


        /**
         * TODO test this method
         * Extract some other information (location, website, etc...) from raw
         * data, given the timestamp to index `_data`
         * @param {number} timestamp - The timestamp of the data
         */
        extractRawContent: function(timestamp) {
            // Website
            _extractWebsiteFromContent(timestamp);

            // Location
            _extractLocationFromContent(timestamp);
        },

        /**
         * Merges the bulb indexed by the timestamp into the local archive
         * @param timestamp - the timestamp of the bulb to be merged
         */
        mergeIntoArchive: function(timestamp) {
            // Test if this timestamp has already been merged into the archive
            if (app.isBulbExist(timestamp)) {
                // Add it to the removal list
                _data[timestamp]["isMerged"] = true;
                _data[timestamp]["isUploaded"] = true;
            } else {
                // Merge it into archive
                app.addBulb(_data[timestamp]);
            }
        },

        setIsMerged: function(timestamp) {
            _bulb[timestamp]["isMerged"] = true;
        },

        setTotalbulbs: function(num) {
            _totalBulbs = num;
        },

        decrementTotalbulbs: function() {
            --_totalBulbs;
        },

        getTotalbulbs: function() {
            return _totalBulbs;
        },

        /**
         * Call the server to remove merged and uploaded bulbs
         * @require called after all the bulbs are downloaded
         */
        removeUploadedBulbs: function() {
            for (var key in _data) {
                if (_data.hasOwnProperty(key)) {
                    if (_data[key]["isMerged"]) {
                        // It's merged, try to remove it
                        var id = _data[key]["id"];
                        removeFileById(id);
                    }
                }
            }
        }
    }
}();


/**
 * Several flags that needs to satisfy before the next step can be processed
 * The bulb folder will only be cleared when:
 *   1. All links are fetched, AND
 *   2. The contents are fetched from the link, AND
 *   3. Those contents have been integrated into the archive, AND
 *   4. The updated archive has been SUCCESSFULLY uploaded
 * No later flag can be set to true unless the previous flags are all true
 *
 * @type {{LINKS_FETCHED: boolean, CONTENT_FETCHED: boolean,
 *     CONTENT_INTEGRATED: boolean, CONTENT_UPLOADED: boolean}}
 */
bulb.isProcessingReady = {
    LINKS_FETCHED: false,
    CONTENT_FETCHED: false,
    CONTENT_INTEGRATED: false,
    CONTENT_UPLOADED: false
};
/**
 * The flag to tell the user if the app is processing the bulb to avoid
 * spamming the icon
 * @type {boolean}
 */
bulb.isProcessing = false;

/**
 * Process the bulbs in _data and add it to the journal map
 */
bulb.process = function() {

}
