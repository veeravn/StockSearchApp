package com.example.stocksearch
import org.json.JSONObject

class JsonHelper {

    JSONObject object

    JsonHelper(String jsonString) {
        object = new JSONObject(jsonString)
    }
    JsonHelper() {

    }

    String getNodeValue(String key) {
        object.get(key)
    }
    boolean getNodeExists(String key) {
        object.has(key)
    }
}
