package com.example.stocksearch.adapter.impl

import org.springframework.http.HttpStatus
import org.springframework.web.client.RestTemplate
import spock.lang.Specification

class GetAdapterImplTest extends Specification {


    GetAdapterImpl adapter = new GetAdapterImpl()
    RestTemplate restTemplate = new RestTemplate()

    def "setup"() {
        adapter.restTemplate = restTemplate
    }
    def "MakeApiCall"() {
        setup:

        String url = "http://dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol=MSFT"

        when:
        def response = adapter.makeApiCall(url)

        then:
        response.statusCode == HttpStatus.OK
    }
}
