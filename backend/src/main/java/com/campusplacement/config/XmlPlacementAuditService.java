package com.campusplacement.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Demonstrates Spring Core XML-based Bean Definition and Setter Property Injection.
 * Configured via src/main/resources/spring-core-context.xml
 */
public class XmlPlacementAuditService {

    private static final Logger logger = LoggerFactory.getLogger(XmlPlacementAuditService.class);

    private String auditPrefix;
    private String version;

    public XmlPlacementAuditService() {
        logger.info("[Spring Core XML] XmlPlacementAuditService bean instantiated by Spring BeanFactory/IoC container.");
    }

    public void setAuditPrefix(String auditPrefix) {
        this.auditPrefix = auditPrefix;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public void logAudit(String action, String details) {
        logger.info("{} [{}] Action: {} | Details: {}", auditPrefix, version, action, details);
    }
}

