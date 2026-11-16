package com.campusplacement.config;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

/**
 * Demonstrates Spring Core lifecycle concepts:
 * 1. IoC Container instantiation
 * 2. Dependency Injection (Constructor-based)
 * 3. ApplicationContextAware (ApplicationContext & BeanFactory access)
 * 4. @PostConstruct
 * 5. InitializingBean (afterPropertiesSet)
 * 6. @PreDestroy
 * 7. DisposableBean (destroy)
 */
@Component
public class SpringCoreDemonstrator implements InitializingBean, DisposableBean, ApplicationContextAware {

    private static final Logger logger = LoggerFactory.getLogger(SpringCoreDemonstrator.class);

    private ApplicationContext applicationContext;
    private final XmlPlacementAuditService auditService;

    // Constructor-based Dependency Injection (Spring Core DI)
    public SpringCoreDemonstrator(XmlPlacementAuditService auditService) {
        this.auditService = auditService;
        logger.info("[Spring Core DI] SpringCoreDemonstrator constructor invoked with XmlPlacementAuditService bean injected.");
    }

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        this.applicationContext = applicationContext;
        logger.info("[Spring Core IoC] ApplicationContext injected: Application name is '{}', bean count: {}",
                applicationContext.getId(), applicationContext.getBeanDefinitionCount());
    }

    @PostConstruct
    public void postConstruct() {
        logger.info("[Spring Core Lifecycle] @PostConstruct phase: Bean initialization initiated.");
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        logger.info("[Spring Core Lifecycle] InitializingBean.afterPropertiesSet phase executed.");
        auditService.logAudit("SYSTEM_INIT", "Spring Core Bean Lifecycle demonstrated successfully.");
    }

    @PreDestroy
    public void preDestroy() {
        logger.info("[Spring Core Lifecycle] @PreDestroy phase: Bean destruction initiated.");
    }

    @Override
    public void destroy() throws Exception {
        logger.info("[Spring Core Lifecycle] DisposableBean.destroy phase executed.");
    }
}

