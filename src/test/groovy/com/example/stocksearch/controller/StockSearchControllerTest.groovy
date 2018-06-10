package com.example.stocksearch.controller

import com.example.stocksearch.adapter.impl.GetAdapterImpl
import com.example.stocksearch.service.impl.StockSearchServiceImpl
import org.json.JSONArray
import org.json.JSONObject
import spock.lang.Specification
import com.example.stocksearch.JsonHelper

class StockSearchControllerTest extends Specification {

    StockSearchController controller
    JsonHelper helper
    def "setup"() {
        def adapter = new GetAdapterImpl()
        def service = new StockSearchServiceImpl()
        controller = new StockSearchController(service, adapter)
    }
    def "getStockQuote"() {
        setup:

        when:
        String jsonRes = controller.getQuote("MSFT")
        helper = new JsonHelper(jsonRes)

        then:
        helper.getNodeValue("Status") == "SUCCESS"
        helper.getNodeValue("Symbol") == "MSFT"
        helper.getNodeExists("Name")
        helper.getNodeExists("LastPrice")
        helper.getNodeExists("Change")
        helper.getNodeExists("ChangePercent")
        helper.getNodeExists("ChangeYTD")
        helper.getNodeExists("ChangePercentYTD")
        helper.getNodeExists("High")
        helper.getNodeExists("Open")

    }
    def "getStockNews"() {
        setup:

        when:
        String jsonRes = controller.getNews("NFLX")
        JSONArray arr = new JSONArray(jsonRes)
        then:
        for(int i = 0; i < arr.length(); i++) {
            JSONObject json = arr.getJSONObject(i)
            helper = new JsonHelper()
            helper.object = json
            and:
            helper.getNodeExists("datetime")
            helper.getNodeExists("headline")
            helper.getNodeExists("source")
            helper.getNodeExists("summary")
            helper.getNodeExists("url")
        }
    }
    def "getStockChart"() {
        setup:

        when:
        String jsonRes = controller.getChart("AAPL")
        helper = new JsonHelper(jsonRes)

        then:
        helper.getNodeExists("Positions")
        helper.getNodeExists("Elements")
        helper.getNodeExists("Dates")

    }
    def "lookUpStocks"() {
        setup:

        when:
        String jsonRes = controller.lookupStocks("NF")
        JSONArray arr = new JSONArray(jsonRes)
        then:
        for(int i = 0; i < arr.length(); i++) {
            JSONObject json = arr.getJSONObject(i)
            helper = new JsonHelper()
            helper.object = json
            and:
            helper.getNodeExists("Symbol")
            helper.getNodeExists("Name")
            helper.getNodeExists("Exchange")
        }

    }

}
