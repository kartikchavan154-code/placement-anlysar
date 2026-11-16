package com.campusplacement.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaForwardingController {

    /**
     * Forwards all non-API and non-static asset routes to index.html for React Router client-side routing.
     */
    @GetMapping(value = {
            "/{path:[^\\.]*}",
            "/*/{path:[^\\.]*}",
            "/*/*/{path:[^\\.]*}"
    })
    public String forwardSpa() {
        return "forward:/index.html";
    }
}
