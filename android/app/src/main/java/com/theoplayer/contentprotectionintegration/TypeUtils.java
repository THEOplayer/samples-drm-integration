package com.theoplayer.contentprotectionintegration;

import org.json.JSONArray;
import org.json.JSONObject;

public class TypeUtils {
    /**
     * Convert an array of bytes to a JSONArray object.
     */
    public static JSONArray fromByteArrayToUint8JsonArray(final byte[] bytes) {
        JSONArray jsonArray = new JSONArray();
        for (byte aByte : bytes) {
            jsonArray.put(aByte & 0xff);
        }
        return jsonArray;
    }

    /**
     * Convert a JSON object to an array of bytes.
     */
    public static byte[] fromJsonToByteArray(final JSONObject jsonObject) {
        return jsonObject.toString().getBytes();
    }
}
