package com.example.stocksearch.service.impl;

import com.example.stocksearch.service.StockSearchService;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

@Service
public class StockSearchServiceImpl implements StockSearchService {

    private static final Logger LOGGER = LoggerFactory.getLogger(StockSearchServiceImpl.class);

    @Override
    public String getStockQuoteUrl(String symbol) {
        return "http://dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol="+symbol;
    }
    @Override
    public String getStockNewsUrl(String symbol) {
        return "https://api.iextrading.com/1.0/stock/"+symbol+"/news/";
    }
    @Override
    public String getStockChartUrl(String symbol) {
        JSONObject json = new JSONObject();
        json.put("Normalized", false);
        json.put("NumberOfDays", 1095);
        json.put("DataPeriod", "Day");
        JSONArray elements = new JSONArray();
        elements.put(new JSONObject().put("Symbol", symbol).put("Type", "price").put("Params", new JSONArray().put("ohlc")));
        json.put("Elements", elements);
        String params = "";
        try {
            params = URLEncoder.encode(json.toString(), "UTF-8");
        } catch (UnsupportedEncodingException e) {
            LOGGER.debug(e.getMessage(), e);
        }
        return "http://dev.markitondemand.com/MODApis/Api/v2/InteractiveChart/json?parameters="+params;

    }
    @Override
    public String lookUpStocks(String term) {
        return "http://dev.markitondemand.com/MODApis/Api/v2/Lookup/json?input=" + term;
    }
}
