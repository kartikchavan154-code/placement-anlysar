package com.campusplacement.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.ImportResource;
import org.springframework.web.client.RestTemplate;

/**
 * Spring Core Configuration class demonstrating:
 * - @Configuration
 * - @Bean
 * - @ImportResource (imports XML bean definitions into the Spring IoC ApplicationContext)
 */
@Configuration
@ImportResource("classpath:spring-core-context.xml")
public class SpringCoreConfig {

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}

