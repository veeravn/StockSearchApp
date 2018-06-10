package com.example.stocksearch.adapter.impl

import com.example.stocksearch.adapter.GetAdapter
import org.apache.http.client.HttpClient
import org.apache.http.impl.client.HttpClients
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.boot.web.client.RestTemplateBuilder
import org.springframework.http.ResponseEntity
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory
import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate

@Service
class GetAdapterImpl implements GetAdapter{

    private static final Logger LOG = LoggerFactory.getLogger(GetAdapterImpl.class)


    RestTemplate restTemplate



    @Override
    ResponseEntity<String> makeApiCall(String url) {

        RestTemplateBuilder builder = new RestTemplateBuilder()
        HttpClient client = HttpClients.custom().build()
        def factory = new HttpComponentsClientHttpRequestFactory(client)
        restTemplate = builder.requestFactory(factory.class).build()
        ResponseEntity<String> responseEntity = restTemplate.getForEntity(new URI(url), String.class)
        LOG.debug("Status Code:\t" + responseEntity.statusCode)

        return responseEntity

    }
}
