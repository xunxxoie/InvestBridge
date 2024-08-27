package com.investbridge.config;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.StopWatch;

@Aspect
@Component
public class LoggingAspect {

    private static final Logger logger = LoggerFactory.getLogger(LoggingAspect.class);

    @Pointcut("within(com.investbridge.service.*)")
    public void cut() {}

    @Around("cut()")
    public Object logMethodExecution(ProceedingJoinPoint joinPoint) throws Throwable {
        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getTarget().getClass().getSimpleName();

        logger.info("Start: {}.{}", className, methodName);

        StopWatch stopWatch = new StopWatch();
        stopWatch.start();

        Object result = null;
        try {
            result = joinPoint.proceed();
            stopWatch.stop();
            logger.info("End: {}.{}, Execution time: {}ms, Status: Success",
                    className, methodName, stopWatch.getTotalTimeMillis());
            return result;
        } catch (Throwable e) {
            stopWatch.stop();
            logger.error("End: {}.{}, Execution time: {}ms, Status: Failed, Error: {}",
                    className, methodName, stopWatch.getTotalTimeMillis(), e.getMessage());
            throw e;
        }
    }
}