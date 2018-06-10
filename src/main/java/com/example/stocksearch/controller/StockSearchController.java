package com.example.stocksearch.controller;

import com.example.stocksearch.adapter.GetAdapter;
import com.example.stocksearch.service.StockSearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class StockSearchController {

    private StockSearchService service;
    private GetAdapter adapter;

    @Autowired
    public StockSearchController(StockSearchService searchService, GetAdapter adapter) {
        this.adapter = adapter;
        service = searchService;
    }

    @GetMapping("/search")
    public String getQuote(@RequestParam(name="symbolVal") String symbol) {
        String url = service.getStockQuoteUrl(symbol);
        return adapter.makeApiCall(url).getBody();
    }
    @GetMapping("/news")
    public String getNews(@RequestParam(name="newsVal") String symbol) {
        String url = service.getStockNewsUrl(symbol);
        return adapter.makeApiCall(url).getBody();
    }
    @GetMapping("/chart")
    public String getChart(@RequestParam(name="chartVal") String symbol) {
        String url = service.getStockChartUrl(symbol);
        return adapter.makeApiCall(url).getBody();
    }
    @GetMapping("/lookup")
    public String lookupStocks(@RequestParam(name="input") String term) {
        String url = service.lookUpStocks(term);
        return adapter.makeApiCall(url).getBody();
    }
}
