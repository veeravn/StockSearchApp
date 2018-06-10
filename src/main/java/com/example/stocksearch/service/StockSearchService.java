package com.example.stocksearch.service;


public interface StockSearchService {

    String getStockQuoteUrl(String symbol);
    String getStockNewsUrl(String symbol);
    String getStockChartUrl(String symbol);
    String lookUpStocks(String term);
}
