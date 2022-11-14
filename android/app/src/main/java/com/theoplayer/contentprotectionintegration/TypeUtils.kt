package com.theoplayer.contentprotectionintegration

import org.json.JSONArray
import org.json.JSONObject

object TypeUtils {
    /**
     * Convert an array of bytes to a JSONArray object.
     */
    fun fromByteArrayToUint8JsonArray(bytes: ByteArray): JSONArray {
        val jsonArray = JSONArray()
        for (aByte in bytes) {
            jsonArray.put((aByte.toInt() and 0xff).toByte())
        }
        return jsonArray
    }

    /**
     * Convert a JSON object to an array of bytes.
     */
    fun fromJsonToByteArray(jsonObject: JSONObject): ByteArray {
        return jsonObject.toString().toByteArray()
    }
}
