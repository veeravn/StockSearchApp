package com.example.stocksearch.service.impl

import com.example.stocksearch.service.StockSearchService
import spock.lang.Specification

class StockSearchServiceImplTest extends Specification {

    StockSearchService service = new StockSearchServiceImpl()

    def "getStockQuoteUrl"() {
        setup:
        String finalUrl = "http://dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol=MSFT"

        when:
        String url = service.getStockQuoteUrl("MSFT")

        then:
        url == finalUrl

    }
    def "getStockNewsUrl"() {
        setup:
        String finalUrl = "https://api.iextrading.com/1.0/stock/NFLX/news/"

        when:
        String url = service.getStockNewsUrl("NFLX")

        then:
        url == finalUrl

    }
    def "getStockChartUrl"() {
        setup:
        String finalUrl = "http://dev.markitondemand.com/MODApis/Api/v2/InteractiveChart/json"

        when:
        String url = service.getStockChartUrl("AAPL")

        then:
        url.contains(finalUrl)

    }
    def "lookUpStocks"() {
        setup:
        String finalUrl = "http://dev.markitondemand.com/MODApis/Api/v2/Lookup/json?input=NF"

        when:
        String url = service.lookUpStocks("NF")

        then:
        url == finalUrl

    }
}
