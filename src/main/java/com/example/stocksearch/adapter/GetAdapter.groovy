package com.example.stocksearch.adapter

import org.springframework.http.ResponseEntity

interface GetAdapter {

    ResponseEntity<String> makeApiCall(String url)

}
